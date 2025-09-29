import { useState, useEffect } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Card from 'react-bootstrap/Card';

import { useSelector } from 'react-redux'

import round from 'lodash/round';

import Table from 'react-bootstrap/Table';

import PanelInputForm from './PanelInputForm';

import widgets from '../../constants/widgets'
import kruskalWallisTest from '../../utils/statistics/kruskalWallisTest'

export default function KruskalWallisPanel(props) {

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

  const widget = widgets.find( itm => itm.type == 'kruskalwallis');

  return (
    <>
      {!state && <PanelInputForm {...props} selectType='number' selectHelp={`Parameter for ${widget.name}`} />}
      {state && <>
        <Card.Body className='p-0 overflow-y'>
          <KruskalWallisTest {...props} subsets={subsets} thresholds={thresholds} />
        </Card.Body>
      </>}
    </>
  )
}

function KruskalWallisTest(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds

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

  let test = kruskalWallisTest(Object.values(data));

  return (
    <>
      {test.error &&
        <div className='d-flex justify-content-center align-items-center m-0 p-3 h-100'>
          <span className='text-danger small'>
            Kruskal-Wallis Test for selected subsets and "{parameter}" failed.
          </span>
        </div>
      }
      {!test.error &&
        <>
          <Table size='sm'>
            <tbody className='small' style={{ 'verticalAlign': 'middle' }}>
              <tr>
                <th>Statistic</th>
                <td>{round(test.statistic,4)}</td>
              </tr>
              <tr>
                <th><em>p</em>-value</th>
                <td className={`${test.pValue < ConfidenceInterval? 'text-success': 'text-danger'}`}>{test.pValue < ConfidenceInterval? '< ' + ConfidenceInterval : round(test.pValue, 4)}</td>
              </tr>
              <tr>
                <th>Degrees Of Freedom</th>
                <td>{test.degreesOfFreedom}</td>
              </tr>
              <tr>
                <th>Effect Size</th>
                <td>{round(test.effectSize,4)}</td>
              </tr>
              <tr>
                <th>Group Sizes</th>
                <td>{test.groupSizes}</td>
              </tr>
            </tbody>
          </Table>
          
          <span className='form-text text-muted small p-1'>Confidence: <em>p</em> {'<'} {ConfidenceInterval || 'unknown'}</span>

          <p className='small text-muted p-1'>Results for parameter "{parameter}" and the selected subsets:{' '}
            { Object.values(series_lookup).map((itm, idx, arr) => {
               return <><i className='bi-square-fill' style={{ 'color': itm.color }} />&nbsp;{itm.name}{idx<arr.length-1 && ", "}</>
            })
            }
          </p>
        </>
      }
    </>
  )
}
