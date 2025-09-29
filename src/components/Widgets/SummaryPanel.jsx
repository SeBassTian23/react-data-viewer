import { useState, useEffect } from 'react'

import { getFilteredData, getSeries } from '../../modules/database'

import Card from 'react-bootstrap/Card';

import { useSelector } from 'react-redux'

import jStat from 'jstat'
import round from 'lodash/round';
import Table from 'react-bootstrap/Table';

import PanelInputForm from './PanelInputForm'

import widgets from '../../constants/widgets'

export default function SummaryPanel(props) {

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

  const widget = widgets.find( itm => itm.type == 'summary');

  return (
    <>
      {!state && <PanelInputForm {...props} selectType='number' selectHelp={`Parameter for ${widget.name}`} />}
      {state && <>
        <Card.Body className='p-0 overflow-y'>
          <CalculateSummary {...props} subsets={subsets} thresholds={thresholds} />
        </Card.Body>
      </>}
    </>
  )
}

function CalculateSummary(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds

  const ConfidenceInterval = props.confidence_level || 0.05

  let summarydata = []

  if (subsets.length === 0) {
    let query = getFilteredData('data', { thresholds, dropna: parameter }).data({ removeMeta: true })
    summarydata.push(getSeries(query, parameter)[parameter] || [])
  }

  if (subsets.length > 0) {
    for (let series in subsets) {
      let query = getFilteredData('data', { filters: subsets[series].filter, thresholds, dropna: parameter })
      summarydata.push(getSeries(query.data({ removeMeta: true }), parameter)[parameter] || [])
    }
  }

  let summary = []

  for (let i in summarydata) {
    const mean = jStat.mean(summarydata[i]);
    const confInt = jStat.normalci(mean, ConfidenceInterval, summarydata[i])
    if (summarydata[i].length > 0)
      summary.push([
        ['Sample Size', summarydata[i].length],
        ['Median', round(jStat.median(summarydata[i]), 3)],
        ['Average', round(mean, 3)],
        ['Confidence Interval of Avg.', round(confInt[0], 3) + ' - ' + round(confInt[1], 3)],
        ['Standard Deviation', round(jStat.stdev(summarydata[i]), 3)],
        ['Standard Error', round(jStat.stdev(summarydata[i]) / Math.sqrt(summarydata[i].length), 3)],
        ['Minimum', round(jStat.min(summarydata[i]), 3)],
        ['Maximum', round(jStat.max(summarydata[i]), 3)],
        ['Sum', round(jStat.sum(summarydata[i]), 3)]
      ])
    else
      summary.push([])
  }

  return (
    <>
      {props.subsets.length === 0 &&
        <Table size="sm">
          <tbody className='small'>
            {summary[0].map((row, idx) => {
              return (
                <tr key={idx}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      }
      {props.subsets.length > 0 && <>
        {props.subsets.map((itm, idx) => {
          return (
            <Table size="sm" key={idx}>
              <thead className='small'>
                <tr>
                  <th colSpan={2}>
                    <i className="bi-square-fill" style={{ "color": itm.color }}></i>{' '}
                    {itm.name}
                  </th>
                </tr>
              </thead>
              <tbody className='small'>
                {summary[idx].length === 0 &&
                  <tr>
                    <td colSpan={2} className={'text-danger'}>Subset has no data</td>
                  </tr>
                }
                {summary[idx].length > 0 && summary[idx].map((row, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )
        })}
        <span className='form-text text-muted small p-1'>Confidence: <em>p</em> {'<'} {ConfidenceInterval || 'unknown'}</span>
      </>
      }
    </>
  )
}