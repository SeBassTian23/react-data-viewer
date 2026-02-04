import { useState, useEffect } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import { useSelector } from 'react-redux'

import Table from 'react-bootstrap/Table';

import PanelStatistics from './helpers/PanelStatistics';
import PanelWarning from './helpers/PanelWarning'

import numberFormat from '../../helpers/number-format'

import kruskalWallisTest, {interpretKruskalWallis} from '../../utils/statistics/kruskalWallisTest'

export default function KruskalWallisPanel(props) {
  return (
    <PanelStatistics 
      widgetType="kruskalwallis" 
      props={props} 
      CalculateComponent={KruskalWallisTest}
    />
  );
}

function KruskalWallisTest(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds
  const stateParameters = useSelector(state => state.parameters)
  const parameterName = stateParameters.find(itm => itm.name == props?.parameter)?.alias || props?.parameter

  const confidenceLevel = props.confidence_level || 0.05

  const [results, setResults] = useState(null);

  useEffect( () => {
    
    if(!parameter){
      setResults(null);
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

    let result = kruskalWallisTest(Object.values(data));

    setResults(result);

  },[subsets, thresholds, parameter])

  return (
    <>
      {(results && results.error) && <PanelWarning warning={`Test for selected subsets and "${parameterName}" failed. ${results.error}`}/>}
      {(results && !results.error) &&
        <>
          <Table size='sm'>
            <tbody className='small text-center'>
              <tr>
                <td colSpan={2} className='text-start'>{results.testType}</td>
              </tr>
              <tr>
                <th className='text-start'>Statistic</th>
                <td>{numberFormat(results.statistic)}</td>
              </tr>
              <tr>
                <th className='text-start'>p-value</th>
                <td className={`${results.pValue < confidenceLevel? 'text-success': 'text-danger'}`}>{numberFormat(results.pValue)}</td>
              </tr>
              <tr>
                <th className='text-start'>Degrees Of Freedom</th>
                <td>{results.degreesOfFreedom}</td>
              </tr>
              <tr>
                <th className='text-start'>Effect Size (ε²)</th>
                <td>{numberFormat(results.effectSize)}</td>
              </tr>
              <tr>
                <th className='text-start'>Group Sizes</th>
                <td>{results.groupSizes.join(" - ")}</td>
              </tr>
            </tbody>
          </Table>
          
          <span className='form-text p-1'>Interpretation</span>
          <p className='small px-2'>{interpretKruskalWallis(results, confidenceLevel)}</p>
        </>
      }
    </>
  )
}
