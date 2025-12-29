import { useState, useEffect } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Card from 'react-bootstrap/Card';

import { useSelector } from 'react-redux'

import round from 'lodash/round';

import Table from 'react-bootstrap/Table';

import PanelInputForm from './PanelInputForm';

import pairs from '../../helpers/generate-pairs'
import widgets from '../../constants/widgets'
import kolmogorovSmirnovTest from '../../utils/statistics/kolmogorovSmirnovTest'

export default function WelchesTTestPanel(props) {

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

  const widget = widgets.find( itm => itm.type == 'kolmogorovsmirnov');

  return (
    <>
      {!state && <PanelInputForm {...props} selectType='number' selectHelp={`Parameter for ${widget.name}`} additionalSelect={widget.additionalSelect} />}
      {state && <>
        <Card.Body className='p-0 overflow-y'>
          <CalculateKolmogorovSmirnovTest {...props} parameterName={parameterName} subsets={subsets} thresholds={thresholds} />
        </Card.Body>
      </>}
    </>
  )
}

function CalculateKolmogorovSmirnovTest(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds
  const alternative = props.alternative
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

  // Perform t-test for combinations
  let table = []
  for (let i in combinations) {
    let t = kolmogorovSmirnovTest(data[combinations[i][0]], data[combinations[i][1]], 0, alternative)
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
            Welch's <em>t</em>-Test for selected subsets and "{parameterName}" failed.
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
                <th>d-Statistic</th>
                <td>{round(itm.dStatistic,4)}</td>
              </tr>
              <tr>
                <th><em>p</em>-value</th>
                <td className={`${itm.pValue < props.confidence_level? 'text-success': 'text-danger'}`}>{itm.pValue < props.confidence_level? '< ' + props.confidence_level : round(itm.pValue, 4)}</td>
              </tr>
              <tr>
                <th>Sample Size (n2)</th>
                <td>{itm.sampleSize1}</td>
              </tr>
              <tr>
                <th>Sample Size (n2)</th>
                <td>{itm.sampleSize2}</td>
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
