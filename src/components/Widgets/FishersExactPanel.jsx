import { useState, useEffect } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

import { useSelector } from 'react-redux'

import jStat from 'jstat'
import round from 'lodash/round'

import PanelInputForm from './PanelInputForm'

import pairs from '../../helpers/generate-pairs'

import widgets from '../../constants/widgets';


export default function FishersExactPanel(props) {

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

  const widget = widgets.find( itm => itm.type == 'fishersexact');

  return (
    <>
      {!state && <PanelInputForm {...props} selectType='string' selectHelp={`Parameter for ${widget.name}`} />}
      {state && <>
        <Card.Body className='p-0 overflow-y'>
          <CalculateFishersExact {...props} subsets={subsets} thresholds={thresholds} />
        </Card.Body>
      </>}
    </>
  )
}

function CalculateFishersExact(props) {

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

  //get input data
  let ids = Object.keys(data)
  let combinationsIDs = pairs(ids) || []
  let combinationsCols = pairs(columns) || []

  let subsetInfo = {}
  ids.forEach((id) => {
    let idxSubset = subsets.findIndex((itm) => itm.id === id)
    subsetInfo[id] = {
      'color': subsets[idxSubset].color || "#000",
      'name': subsets[idxSubset].name || "Unknown"
    }
  })

  let tests = []
  for (let i in combinationsIDs) {
    for (let j in combinationsCols) {
      tests.push({
        rows: combinationsIDs[i],
        cols: combinationsCols[j],
        data: [[
          data[combinationsIDs[i][0]].filter(itm => itm === combinationsCols[j][0]).length,
          data[combinationsIDs[i][0]].filter(itm => itm === combinationsCols[j][1]).length
        ],
        [
          data[combinationsIDs[i][1]].filter(itm => itm === combinationsCols[j][0]).length,
          data[combinationsIDs[i][1]].filter(itm => itm === combinationsCols[j][1]).length
        ]]
      })
    }
  }

  let tables = []
  for (let t in tests) {
    // one-tailed p-value
    let n = jStat.sum(tests[t].data.flat())
    let rowSum = jStat.sum(tests[t].data[0])
    let colSum = jStat.sum([tests[t].data[0][0], tests[t].data[1][0]])
    var p_value = jStat.hypgeom.cdf(tests[t].data[0][0], n, colSum, rowSum);

    // two-tailed p value
    var all_p = [];
    for (var i = tests[t].data[0][0] - (-1); i <= rowSum; i++) {
      all_p.push(jStat.hypgeom.pdf(i, n, colSum, rowSum));
    }

    var greater_p = [];
    for (var j = 0; j <= all_p.length; j++) {
      if (all_p[j] <= p_value)
        greater_p.push(all_p[j]);
    }

    var greater_p_total = jStat.sum(greater_p);
    var p_value_two_tailed = jStat.sum([greater_p_total, p_value]);

    if (!tests[t].cols)
      continue;

    tables.push({
      p_value,
      p_value_two_tailed,
      view: [
        [{ name: '', color: '' }, ...tests[t].cols, ''],
        [subsetInfo[tests[t].rows[0]], tests[t].data[0][0], tests[t].data[0][1], jStat.sum(tests[t].data[0])],
        [subsetInfo[tests[t].rows[1]], tests[t].data[1][0], tests[t].data[1][1], jStat.sum(tests[t].data[1])],
        [{ name: '', color: '' }, jStat.sum([tests[t].data[0][0], tests[t].data[1][0]]), jStat.sum([tests[t].data[0][1], tests[t].data[1][1]]), n]
      ]
    }
    )

  }

  return (
    <>
      {tables.length === 0 &&
        <div className='d-flex justify-content-center align-items-center m-0 p-3 h-100'>
          <span className='text-danger small'>
            Fisher's Exact Test for selected subsets and "{parameter}" failed.
          </span>
        </div>
      }
      {tables.length > 30 &&
        <div className='d-flex justify-content-center align-items-center m-0 p-3 h-100'>
          <span className='text-danger small'>
            The current selection of subsets and the category <strong>"{props.parameter}"</strong> will generate <strong>{tables.length}</strong> tests. Please select fewer subsets or make the filters more stringent to reduce the number of categories.
          </span>
        </div>
      }
      {(tables.length > 0 && tables.length <=30) &&
        <>
          <p className='form-text'>Tests for all 2x2 combinations between subsets and "{parameter}".</p>
          {tables.map((table, idx) => {
            return (
              <Table responsive bordered size='sm' className='mt-1' key={idx}>
                <tbody className='small text-center align-middle'>
                  {table.view.map((row, idx) => {
                    return (
                      <tr key={idx}>
                        <td className='text-start'>{row[0].name !== '' && <i className='bi-square-fill' style={{ 'color': row[0].color }} />}&nbsp;{row[0].name}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className='small'>
                  <tr>
                    <th colSpan={2}><em>p</em>-value (one-tailed)</th>
                    <td colSpan={2} className={`${p_value < ConfidenceInterval? 'text-success': 'text-danger'}`}>{round(p_value, 3)}</td>
                  </tr>
                  <tr>
                    <th colSpan={2} ><em>p</em>-value (two-tailed)</th>
                    <td colSpan={2} className={`${p_value_two_tailed < ConfidenceInterval? 'text-success': 'text-danger'}`}>{round(p_value_two_tailed, 3)}</td>
                  </tr>
                </tfoot>
              </Table>
            )
          })}
          <span className='form-text text-muted small p-1'>Confidence: <em>p</em> {'<'} {ConfidenceInterval || 'unknown'}</span>
        </>
      }
    </>
  )
}
