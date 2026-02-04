import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Table from 'react-bootstrap/Table';

import numberFormat from '../../helpers/number-format'

import PanelStatistics from './helpers/PanelStatistics';
import PanelWarning from './helpers/PanelWarning'

import pairs from '../../helpers/generate-pairs'
import pearsonCorrelation, {interpretPearsonCorrelation} from '../../utils/statistics/pearsonCorrelation'

export default function PearsonCorrelationPanel(props) {
  return (
    <PanelStatistics 
      widgetType="pearsoncorrelation" 
      props={props} 
      CalculateComponent={PearsonCorrelationCalculation}
    />
  );
}

function PearsonCorrelationCalculation(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds
  const alternative = props.alternative
  const stateParameters = useSelector(state => state.parameters)
  const parameterName = stateParameters.find(itm => itm.name == props?.parameter)?.alias || props?.parameter

  const confidenceLevel = props.confidence_level || 0.05

  const [results, setResults] = useState([]);
  
  useEffect( () => {
    
    if(!parameter){
      setResults([]);
      return
    }
      

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
      let t = pearsonCorrelation(data[combinations[i][0]], data[combinations[i][1]], alternative)
      table.push(
        {
          compare: combinations[i],
          names: combinations[i].map(itm => series_lookup[itm].name),
          colors: combinations[i].map(itm => series_lookup[itm].color),
          ...t
        }
      )
    }

    setResults(table);

  },[subsets, thresholds, parameter])

  return (
    <>
      {results.length === 0 && <PanelWarning warning={`Test for selected subsets and "${parameterName}" failed.`} /> }
      {results.length > 0 &&
        results.map( (itm,idx) => <>
          <Table size='sm' key={idx}>
            <thead className='text-center small'>
              <tr>
                <th className='w-50'><i className='bi-square-fill' style={{ 'color': itm.colors[0] }} />&nbsp;{itm.names[0]}</th>
                <th className='w-50'><i className='bi-square-fill' style={{ 'color': itm.colors[1] }} />&nbsp;{itm.names[1]}</th>
              </tr>
            </thead>
            <tbody className='small' style={{ 'verticalAlign': 'middle' }}>
              {itm.error && <tr>
                <td colSpan={2} className='text-danger'>{itm.error}</td>
                </tr>}
              {!itm.error && <>
                <tr>
                  <td colSpan={2}>{itm.testType}</td>
                </tr>
                <tr>
                  <th>t-Statistic</th>
                  <td>{numberFormat(itm.tStatistic)}</td>
                </tr>
                <tr>
                  <th><em>p</em>-value</th>
                  <td className={`${itm.pValue < confidenceLevel? 'text-success': 'text-danger'}`}>{numberFormat(itm.pValue)}</td>
                </tr>
                <tr>
                  <th>Degrees Of Freedom</th>
                  <td>{itm.degreesOfFreedom}</td>
                </tr>
                <tr>
                  <th>Sample Size</th>
                  <td>{itm.sampleSize}</td>
                </tr>
                <tr>
                  <th>Correlation Coefficient</th>
                  <td>{numberFormat(itm.correlationCoefficient)}</td>
                </tr>
                <tr>
                  <th>Confidence Interval (95%)</th>
                  <td>{numberFormat(itm.confidenceInterval95[0])} - {numberFormat(itm.confidenceInterval95[1])}</td>
                </tr>
                <tr>
                  <th>Alternative</th>
                  <td>{itm.alternative}</td>
                </tr>
              </>}
            </tbody>
          </Table>
          
          {!itm.error && <>
            <span className='form-text p-1' key={idx+'h'}>Interpretation</span>
            <p className='small px-2' key={idx+'i'}>{interpretPearsonCorrelation(itm, confidenceLevel)}</p>
          </>}
        </>)  
      }
    </>
  )
}
