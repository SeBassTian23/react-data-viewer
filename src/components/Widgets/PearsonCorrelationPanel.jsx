import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

import round from 'lodash/round';

import PanelInputForm from './PanelInputForm';

import pairs from '../../helpers/generate-pairs'
import widgets from '../../constants/widgets'
import pearsonCorrelation from '../../utils/statistics/pearsonCorrelation'

export default function PearsonCorrelationPanel(props) {

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

  const widget = widgets.find( itm => itm.type == 'pearsoncorrelation');

  return (
    <>
      {!state && <PanelInputForm {...props} selectType='number' selectHelp={`Parameter for ${widget.name}`} additionalSelect={widget.additionalSelect} />}
      {state && <>
        <Card.Body className='p-0 overflow-y-hidden'>
          <PearsonCorrelationCalculation {...props} subsets={subsets} thresholds={thresholds} />
        </Card.Body>
      </>}
    </>
  )
}

function PearsonCorrelationCalculation(props) {

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

  // Perform t-test for combinations
  let table = []
  for (let i in combinations) {
    let t = pearsonCorrelation(data[combinations[i][0]], data[combinations[i][1]], 0, alternative)
    table.push(
      {
        compare: combinations[i],
        names: combinations[i].map(itm => series_lookup[itm].name),
        colors: combinations[i].map(itm => series_lookup[itm].color),
        ...t
      }
    )
  }

  return (
    <>
      {table.length === 0 &&
        <div className='d-flex justify-content-center align-items-center m-0 p-3 h-100'>
          <span className='text-danger small'>
            Pearson Rank Correlation for the selected subsets and "{parameter}" failed.
          </span>
        </div>
      }
      {table.length > 0 &&
        table.map( (itm,idx) =>{
          return <Table size='sm' key={idx}>
            <thead className='text-center small'>
              <tr>
                <th className='w-50'><i className='bi-square-fill' style={{ 'color': itm.colors[0] }} />&nbsp;{itm.names[0]}</th>
                <th className='w-50'><i className='bi-square-fill' style={{ 'color': itm.colors[1] }} />&nbsp;{itm.names[1]}</th>
              </tr>
            </thead>
            <tbody className='small' style={{ 'verticalAlign': 'middle' }}>
              <tr>
                <td colSpan={2}>{itm.testType}</td>
              </tr>
              <tr>
                <th>t-Statistic</th>
                <td>{round(itm.tStatistic,4)}</td>
              </tr>
              <tr>
                <th><em>p</em>-value</th>
                <td className={`${itm.pValue < ConfidenceInterval? 'text-success': 'text-danger'}`}>{itm.pValue < ConfidenceIntervall? '< ' + ConfidenceInterval : round(itm.pValue, 4)}</td>
              </tr>
              <tr>
                <th>Degrees Of Freedom</th>
                <td>{itm.degreesOfFreedom}</td>
              </tr>
              <tr>
                <th>Sample Means</th>
                <td>{round(itm.mean1,4)}; {round(itm.mean2,4)}</td>
              </tr>
              <tr>
                <th>Standard Error</th>
                <td>{round(itm.standardError,4)}</td>
              </tr>
              <tr>
                <th>Confidence Interval (95%)</th>
                <td>{round(itm.confidenceInterval95[0],4)} - {round(itm.confidenceInterval95[1],4)}</td>
              </tr>
              <tr>
                <th>Alternative</th>
                <td>{itm.alternative}</td>
              </tr>
            </tbody>
          </Table>
        })  
      }
      <span className='form-text text-muted small p-1'>Confidence: <em>p</em> {'<'} {ConfidenceInterval || 'unknown'}</span>
    </>
  )
}
