import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'
import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

import jStat from 'jstat'
import round from 'lodash/round';

import number2letter from '../../helpers/number2letter';

import PanelInputForm from './PanelInputForm'

import widgets from '../../constants/widgets'

export default function ChiSquarePanel(props) {

  const stateDashboard = useSelector(state => state.dashboard)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)

  const subsets = stateDatasubsets.filter((itm) => itm.isVisible)
  const thresholds = stateThresholds.filter((itm) => itm.isSelected)

  const [state, setState] = useState(false)

  useEffect(() => {
    const itms = stateDashboard.filter((itm) => itm.id === props.id)
    if (itms.length > 0 && itms[0].content) {
      setState(true)
    }
    else {
      setState(false)
    }
  }, [stateDashboard, stateThresholds, stateDatasubsets])

  const widget = widgets.find( itm => itm.type == 'barnardsexact');

  return (
    <>
      {!state && <PanelInputForm {...props} selectType='string' selectHelp={`Parameter for ${widget.name}`} />}
      {state && <>
        <Card.Body className='p-0 overflow-y'>
          <CalculateChiSquare {...props} subsets={subsets} thresholds={thresholds} />
        </Card.Body>
      </>}
    </>
  )
}

function CalculateChiSquare(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds

  const ConfidenceInterval = props.confidence_level || 0.05

  let data = {}
  let columns = []

  if (subsets.length > 0) {
    for (let series in subsets) {
      let query = getFilteredData('data', { filters: subsets[series].filter, thresholds, dropna: parameter })
      data[subsets[series].id] = getSeries(query.data({ removeMeta: true }), parameter)[parameter] || []

      let cols = getUnique(query.data({ removeMeta: true }), parameter)
      columns = [...new Set([...columns, ...cols])]
    }
  }


  // Build the data table for the chi2-test
  let dataTest = {}
  for (let id in data) {
    dataTest[id] = data[id].reduce((acc, curr) => {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    columns.map((itm) => {
      if (dataTest[id][itm] === undefined)
        dataTest[id][itm] = 0
      return itm
    });
  }

  // Get the totals for rows
  let rowTotals = {}
  for (let id in dataTest) {
    rowTotals[id] = jStat.sum(Object.values(dataTest[id]))
  }

  // Get the totals for columns
  let columnTotals = columns.reduce((acc, curr) => { acc[curr] = 0; return acc }, {})
  for (let id in dataTest) {
    for (let col in columns) {
      columnTotals[columns[col]] += dataTest[id][columns[col]]
    }
  }

  // Calculate degrees of freedom
  const rowCount = subsets.length || 0
  const colCount = columns.length || 0
  const dof = (rowCount - 1) * (colCount - 1);

  // Calculate chi2 values and contingincy table
  let x2_sum = []
  let table = []
  let n = jStat.sum(Object.values(rowTotals))
  for (let id in dataTest) {
    for (let i in columns) {
      let col = columns[i]
      if (columnTotals[col] === 0 || rowTotals[id] === 0)
        continue
      let E = (rowTotals[id] * columnTotals[col]) / n
      // Χ2 = Σ [ (Or,c - Er,c)2 / Er,c ]
      let chi2 = Math.pow((dataTest[id][col] - E), 2) / E
      if (!Number.isNaN(chi2))
        x2_sum.push(chi2)

      let idx = table.findIndex((itm) => itm.id === id)
      if (idx < 0) {
        let idxSubset = subsets.findIndex((itm) => itm.id === id)
        table.push({ id, 'name': subsets[idxSubset].name || "Unknown", 'color': subsets[idxSubset].color || "#000", 'expected': [], 'observed': [], 'x2': [], 'p-value': [] })
        idx = table.findIndex((itm) => itm.id === id)
      }
      table[idx]['expected'].push(E)
      table[idx]['observed'].push(dataTest[id][col])
      table[idx]['x2'].push(chi2)
      table[idx]['p-value'].push(1 - jStat.chisquare.cdf(chi2, dof))
    }
  }

  // Sum x2 values
  const x2 = jStat.sum(x2_sum);

  // Calculate p-value
  const p_value = 1 - jStat.chisquare.cdf(x2, dof);
  const msg = p_value <= ConfidenceInterval ? `Subsets and "${parameter}" seem to be dependent` : `Subsets and "${parameter}" seem not to be dependent`

  return (
    <>
      {x2 === 0 &&
        <div className='d-flex justify-content-center align-items-center m-0 p-3 h-100'>
          <span className='text-danger small'>
            χ²-Test for selected subsets and "{parameter}" failed.
          </span>
        </div>
      }
      {x2 > 0 &&
        <>
          <Table size="sm">
            <thead className='text-center small'>
              <tr>
                <th>χ²-value</th>
                <th><em>p</em>-value</th>
              </tr>
            </thead>
            <tbody>
              <tr className='text-center'>
                <td>{round(x2, 3) || x2}</td>
                <td><em>p</em>{(p_value < ConfidenceInterval) ? ' < ' + ConfidenceInterval : ' = ' + p_value.toFixed(3)}</td>
              </tr>
              <tr>
                <td colSpan={2} className={p_value > ConfidenceInterval ? 'small text-danger' : 'small'}>{msg}</td>
              </tr>
            </tbody>
          </Table>

          <span className='form-text p-1'>Contingency Table - Observed (Expected)</span>
          <Table responsive bordered size="sm" className='align-middle text-center'>
            <tbody>
              <tr>
                <td>&nbsp;</td>
                {/* {columns.map( (col,idx) => <td className='small' key={idx} style={{"height":"100px","whiteSpace": "nowrap", "verticalAlign": "bottom", "overflow": "hidden"}}> <div className='ps-1' style={{"transform": "rotate(-90deg)", "width": "30px"}}>{col}</div></td> )} */}
                {columns.map((col, idx) => <td className='small' key={idx} title={col}>{(idx + 1)}</td>)}
                <td>&nbsp;</td>
              </tr>
              {table.map((row, idx) => {
                return (
                  <tr key={idx} className='small'>
                    <td className='text-start text-nowrap' title={row.name}>
                      <i className='bi-square-fill' style={{ 'color': row.color }} /> {number2letter(idx + 1)}
                    </td>
                    {row['p-value'].map((cell, idx) => {
                      return <td
                        key={idx}
                        className={`text-white fw-bold ${cell <= ConfidenceInterval ? 'bg-success' : 'bg-danger'}`}
                        title={row.name + ' vs.\n' + columns[idx] + '\n' + '𝛸²: ' + row['observed'][idx] + '\n' + 'p-value: ' + cell}>
                        {row['observed'][idx]}<br /><small className='fw-light'>({round(row['expected'][idx], 1)})</small>
                      </td>
                    })}
                    <td>{Object.values(rowTotals)[idx]}</td>
                  </tr>
                )
              })}
              <tr className='small text-center'>
                <td></td>
                {Object.values(columnTotals).map((itm, idx) => <td key={idx}>{itm}</td>)}
                <td className='fw-bold'>{n}</td>
              </tr>
            </tbody>
          </Table>
          <span className='form-text text-muted small p-1'>Confidence: <em>p</em> {'<'} {ConfidenceInterval || 'unknown'}</span>
        </>
      }
    </>
  )
}