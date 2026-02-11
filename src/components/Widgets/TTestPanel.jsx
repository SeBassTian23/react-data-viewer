import { useState, useEffect, Fragment } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import { useSelector } from 'react-redux'

import Table from 'react-bootstrap/Table';

import PanelStatistics from './helpers/PanelStatistics';
import PanelWarning from './helpers/PanelWarning'

import numberFormat from '../../helpers/number-format'

import pairs from '../../helpers/generate-pairs'
import tTest, {interpretTTest} from '../../utils/statistics/tTest'

export default function TTestPanel(props) {
  return (
    <PanelStatistics 
      widgetType="ttest" 
      props={props} 
      CalculateComponent={CalculateTTest}
    />
  );
}

export function CalculateTTest(props) {

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
      let test = tTest(data[combinations[i][0]], data[combinations[i][1]], alternative)
      table.push(
        {
          compare: combinations[i],
          names: combinations[i].map(itm => series_lookup[itm].name),
          colors: combinations[i].map(itm => series_lookup[itm].color),
          ...test
        }
      )
    }

    setResults(table);

  },[subsets, thresholds, parameter])

  return (
    <>
      {results.length === 0 && <PanelWarning warning={`Test for selected subsets and "${parameterName}" failed.`}/>}
      {results.length > 0 && <>
        {results.map( (itm, idx) => <Fragment key={idx}>
          <Table size='sm' key={idx+'t'}>
            <thead className='text-center small align-middle'>
              <tr>
                <th className='w-50'><i className='bi-square-fill' style={{ 'color': itm.colors[0] }} />&nbsp;{itm.names[0]}</th>
                <th className='w-50'><i className='bi-square-fill' style={{ 'color': itm.colors[1] }} />&nbsp;{itm.names[1]}</th>
              </tr>
            </thead>
            <tbody className='text-center small align-middle'>
              <tr>
                <td colSpan={2} className='text-start'>{itm.testType}</td>
              </tr>
              <tr>
                <th className='text-start'>t-Statistic</th>
                <td>{numberFormat(itm.tStatistic)}</td>
              </tr>
              <tr>
                <th className='text-start'>p-value</th>
                <td className={`${itm.pValue < confidenceLevel? 'text-success': 'text-danger'}`}>{numberFormat(itm.pValue, 4)}</td>
              </tr>
              <tr>
                <th className='text-start'>Degrees Of Freedom</th>
                <td>{itm.degreesOfFreedom}</td>
              </tr>
              <tr>
                <th className='text-start'>Sample Means</th>
                <td>{numberFormat(itm.means[0])} - {numberFormat(itm.means[1])}</td>
              </tr>
              <tr>
                <th className='text-start'>Mean Difference</th>
                <td>{numberFormat(itm.meanDifference)}</td>
              </tr>
              <tr>
                <th className='text-start'>Standard Error</th>
                <td>{numberFormat(itm.standardError)}</td>
              </tr>
              <tr>
                <th className='text-start'>Confidence Interval (95%)</th>
                <td>{numberFormat(itm.confidenceInterval[0])} - {numberFormat(itm.confidenceInterval[1])}</td>
              </tr>
              <tr>
                <th className='text-start'>Alternative</th>
                <td>{itm.alternative}</td>
              </tr>
            </tbody>
          </Table>

          <span className='form-text p-1' key={idx+'h'}>Interpretation</span>
          <p className='small px-2' key={idx+'i'}>{interpretTTest(itm, confidenceLevel)}</p>

        </Fragment>)}

        </>
      }
    </>
  )
}
