import { useState, useEffect } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

import { useSelector } from 'react-redux'

import round from 'lodash/round';

import PanelInputForm from './PanelInputForm'

import pairs from '../../helpers/generate-pairs'
import widgets from '../../constants/widgets'
import sign from '../../utils/statistics/sign'

export default function SignPanel(props) {

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

  const widget = widgets.find( itm => itm.type == 'sign');

  return (
    <>
      {!state && <PanelInputForm {...props} selectType='number' selectHelp={`Parameter for ${widget.name}`} additionalSelect={widget.additionalSelect} />}
      {state && <>
        <Card.Body className='p-0 overflow-y-hidden'>
          <CalculateSign {...props} subsets={subsets} thresholds={thresholds} />
        </Card.Body>
      </>}
    </>
  )
}

function CalculateSign(props) {
  
  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds
  const alternative = props.alternative

  const ConfidenceInterval = props.confidence_level || 0.05

  let data = {}
  let columns = []

  if (subsets.length > 0) {
    for (let series in subsets) {
      if (!subsets[series].isVisible)
        continue
      let query = getFilteredData('data', { filters: subsets[series].filter, thresholds, dropna: parameter })
      data[subsets[series].id] = getSeries(query.data({ removeMeta: true }), parameter)[parameter] || []

      let cols = getUnique(query.data({ removeMeta: true }), parameter)
      columns = [...new Set([...columns, ...cols])]
    }
  }

  let ids = Object.keys(data)
  let combinations = pairs(ids) || []
  let series_lookup = {}

  for (let i in ids) {
    let l = subsets.filter((itm) => itm.id === ids[i])
    if (l.length > 0)
      l = l[0]
    series_lookup[ids[i]] = {
      name: l.name,
      color: l.color
    }
  }

  // Perform Sign Test for combinations
  let table = []
  for (let i in combinations) {
    let test = sign(data[combinations[i][0]], data[combinations[i][1]], alternative)

    table.push({
      compare: combinations[i],
      names: combinations[i].map(itm => series_lookup[itm].name),
      colors: combinations[i].map(itm => series_lookup[itm].color),
      ...test
    })
  }

  return (
    <>
      {table.length === 0 &&
        <div className='d-flex justify-content-center align-items-center m-0 p-3 h-100'>
          <span className='text-danger small'>
            Sign-Test for selected subsets and "{parameter}" failed.
          </span>
        </div>
      }
      {table.length > 0 &&
        <>
          <p className='form-text'>Tests for all 2x2 combinations between subsets and "{parameter}".</p>
          {table.map((itm, idx) => {
            return <Table size='sm' key={idx}>
                <thead className='text-start small'>
                  <tr>
                    <th><i className='bi-square-fill' style={{ 'color': itm.colors[0] }} />&nbsp;{itm.names[0]}</th>
                    <th><i className='bi-square-fill' style={{ 'color': itm.colors[1] }} />&nbsp;{itm.names[1]}</th>
                  </tr>
                </thead>
                <tbody className='small text-start align-middle'>
                  {itm.error && <tr>
                    <td colSpan={2} className='text-danger'>{itm.error}</td>
                  </tr>}
                  {!itm.error && <>
                    <tr>
                      <td>Total pairs</td>
                      <td>{itm.pairs}</td>
                    </tr>
                    <tr>
                      <td>Non-zero differences</td>
                      <td>{itm.non_zero_diff}</td>
                      </tr>
                    <tr>
                      <td>Positive differences</td>
                      <td>{itm.positive}</td>
                      </tr>
                    <tr>
                      <td>Negative differences</td>
                      <td>{itm.negative}</td>
                      </tr>
                    <tr>
                      <td>Ties (ignored)</td>
                      <td>{itm.ignored}</td>
                      </tr>
                    <tr>
                      <td><em>p</em>-value ({alternative})</td>
                      <td className={`${itm.pValue < ConfidenceInterval? 'text-success': 'text-danger'}`}>{itm.pValue < ConfidenceInterval? '< ' + ConfidenceInterval : round(itm.pValue, 4)}</td>
                    </tr>
                  </>}
                </tbody>
              </Table>
          })}
          <span className='form-text text-muted small p-1'>Confidence: <em>p</em> {'<'} {ConfidenceInterval || 'unknown'}</span>
        </>
      }
    </>
  )
}
