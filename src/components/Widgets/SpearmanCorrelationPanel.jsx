import { useState, useEffect } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Card from 'react-bootstrap/Card';

import { useSelector } from 'react-redux'

import round from 'lodash/round';

import Table from 'react-bootstrap/Table';

import PanelInputForm from './PanelInputForm';

import pairs from '../../helpers/generate-pairs'
import widgets from '../../constants/widgets'
import spearmanCorrelation from '../../utils/statistics/spearmanCorrelation'

export default function SpearmanCorrelationPanel(props) {

  const stateDashboard = useSelector(state => state.dashboard)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateParameters = useSelector(state => state.parameters)

  const subsets = stateDatasubsets.filter((itm) => itm.isVisible)
  const thresholds = stateThresholds.filter((itm) => itm.isSelected)
  const parameterName = stateParameters.find(itm => itm.name == props.parameter)?.alias || props.parameter

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

  const widget = widgets.find( itm => itm.type == 'spearmancorrelation');

  return (
    <>
      {!state && <PanelInputForm {...props} selectType='number' selectHelp={`Parameter for ${widget.name}`} />}
      {state && <>
        <Card.Body className='p-0 overflow-y'>
          <CalculateSpearmanCorrelation {...props} parameterName={parameterName} subsets={subsets} thresholds={thresholds} />
        </Card.Body>
      </>}
    </>
  )
}

function CalculateSpearmanCorrelation(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds
  const parameterName = props.parameterName

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
    let test = spearmanCorrelation(data[combinations[i][0]], data[combinations[i][1]])

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
            Spearman Rank Correlation for selected subsets and "{parameterName}" failed.
          </span>
        </div>
      }
      {table.length > 0 &&
        <>
          <p className='form-text'>Tests for all 2x2 combinations between subsets and "{parameterName}".</p>
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
                      <td>Correlation</td>
                      <td>{round(itm.correlation,4)}</td>
                    </tr>
                    <tr>
                      <td><em>p</em>-value</td>
                      <td className={`${itm.pValue < props.confidence_level? 'text-success': 'text-danger'}`}>{itm.pValue < props.confidence_level? '< ' + props.confidence_level : round(itm.pValue, 4)}</td>
                    </tr>
                    <tr>
                      <td>Confidence Interval</td>
                      <td>{round(itm.confidenceInterval[0],4)} - {round(itm.confidenceInterval[1],4)}</td>
                    </tr>
                    <tr>
                      <td>n</td>
                      <td>{itm.n}</td>
                    </tr>
                    <tr>
                      <td>Test Statistic</td>
                      <td>{round(itm.testStatistic,4)}</td>
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
