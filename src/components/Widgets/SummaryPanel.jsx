import { useState, useEffect } from 'react'

import { getFilteredData, getSeries } from '../../modules/database'

import { useSelector } from 'react-redux'

import numberFormat from '../../helpers/number-format'
import Table from 'react-bootstrap/Table';

import PanelStatistics from './helpers/PanelStatistics'
import statsSummary from '../../utils/statistics/statsSummary'

export default function SummaryPanel(props) {
  return (
    <PanelStatistics 
      widgetType="summary" 
      props={props} 
      CalculateComponent={CalculateSummary}
    />
  );
}

function CalculateSummary(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds
  const stateParameters = useSelector(state => state.parameters)
  const parameterName = stateParameters.find(itm => itm.name == props?.parameter)?.alias || props?.parameter

  const confidenceLevel = props.confidence_level || 0.05

  const [results, setResults] = useState([]);
  
  useEffect( () => {
    
    if(!parameter){
      setResults([]);
      return
    }
        
    let summary = [];
  
    if (subsets.length === 0) {
      let query = getFilteredData('data', { thresholds, dropna: parameter }).data({ removeMeta: true })
      let summarydata = getSeries(query, parameter)[parameter] || []
      summary.push({
        ...statsSummary(summarydata, 1-confidenceLevel),
        ...{color: 'blue', name: 'All Data' }
      })
    }
  
    if (subsets.length > 0) {
      for (let series in subsets) {
        let query = getFilteredData('data', { filters: subsets[series].filter, thresholds, dropna: parameter })
        let summarydata = getSeries(query.data({ removeMeta: true }), parameter)[parameter] || []
        summary.push({
          ...statsSummary(summarydata, 1-confidenceLevel),
          ...{color: subsets[series].color, name: subsets[series].name }
        })
      }
    }

    setResults(summary);

  },[subsets, thresholds, parameter])

  return (<>
    { results.length > 0 && results.map((itm, idx) => {
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
            {!itm?
              <tr>
                <td colSpan={2} className={'text-danger'}>Subset has no data</td>
              </tr> : <>
                <tr>
                  <td colSpan={2}>Summary - {parameterName}</td>
                </tr>                  
                <tr>
                  <th>Sample Size</th>
                  <td>{itm.size}</td>
                </tr>                  
                <tr>
                  <th>Median</th>
                  <td>{numberFormat(itm.median)}</td>
                </tr>                  
                <tr>
                  <th>Average</th>
                  <td>{numberFormat(itm.average)}</td>
                </tr>                  
                <tr>
                  <th>Confidence Interval ({numberFormat((1-confidenceLevel)*100)}%)</th>
                  <td>{numberFormat(itm.ci[0])} - {numberFormat(itm.ci[1])}</td>
                </tr>                  
                <tr>
                  <th>Standard Deviation</th>
                  <td>{numberFormat(itm.sd)}</td>
                </tr>                  
                <tr>
                  <th>Standard Error</th>
                  <td>{numberFormat(itm.se)}</td>
                </tr>                  
                <tr>
                  <th>Minimum</th>
                  <td>{numberFormat(itm.min)}</td>
                </tr>                  
                <tr>
                  <th>Maximum</th>
                  <td>{numberFormat(itm.max)}</td>
                </tr>
                <tr>
                  <th>Sum</th>
                  <td>{numberFormat(itm.sum)}</td>
                </tr>                  
              </>
            }
          </tbody>
        </Table>
      )
    })}
  </>)
}