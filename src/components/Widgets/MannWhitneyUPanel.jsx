import { useState, useEffect } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Table from 'react-bootstrap/Table';

import { useSelector } from 'react-redux'

import numberFormat from '../../helpers/number-format'

import PanelStatistics from './helpers/PanelStatistics'
import PanelWarning from './helpers/PanelWarning'

import pairs from '../../helpers/generate-pairs'
import mannWhitneyU, {interpretMannWhitneyU} from '../../utils/statistics/mannWhitneyU'

export default function MannWhitneyUPanel(props) {
  return (
    <PanelStatistics 
      widgetType="mannwhitneyu" 
      props={props} 
      CalculateComponent={CalculateMannWhitneyU}
    />
  );
}

function CalculateMannWhitneyU(props) {
  
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

    // Perform Mann-Whitney U Test for combinations
    let table = []
    for (let i in combinations) {
      let test = mannWhitneyU(data[combinations[i][0]], data[combinations[i][1]], alternative)

      table.push({
        testType: test.testType,
        compare: combinations[i],
        names: combinations[i].map(itm => series_lookup[itm].name),
        colors: combinations[i].map(itm => series_lookup[itm].color),
        U: test.U,
        z: test.z,
        pValue: test.pValue,
        meanRank1: test.meanRank1,
        meanRank2: test.meanRank2,
        alternative
      })
    }

    setResults(table);

  },[subsets, thresholds, parameter])

  return (
    <>
      {results.length === 0 && <PanelWarning warning={`Test for selected subsets and "${parameterName}" failed.`}/>}
      {results.length > 0 &&
        <>
          {results.map((itm, idx) => <>
              <Table size='sm' key={idx}>
                <thead className='text-center small'>
                  <tr>
                    <th><i className='bi-square-fill' style={{ 'color': itm.colors[0] }} />&nbsp;{itm.names[0]}</th>
                    <th><i className='bi-square-fill' style={{ 'color': itm.colors[1] }} />&nbsp;{itm.names[1]}</th>
                  </tr>
                </thead>
                <tbody className='small text-center'>
                  <tr>
                    <td colSpan={2} className='text-start'>{itm.testType}</td>
                  </tr>
                  <tr>
                    <th className='text-start'>U statistic</th>
                    <td>{numberFormat(itm.U)}</td>
                  </tr>
                  <tr>
                    <th className='text-start'>Z score</th>
                    <td>{numberFormat(itm.z)}</td>
                  </tr>
                  <tr>
                    <th className='text-start'>p-value</th>
                    <td className={`${itm.pValue < confidenceLevel? 'text-success': 'text-danger'}`}>{numberFormat(itm.pValue)}</td>
                  </tr>
                  <tr>
                    <th className='text-start'>Group 1 mean rank</th>
                    <td>{numberFormat(itm.meanRank1)}</td>
                  </tr>
                  <tr>
                    <th className='text-start'>Group 2 mean rank</th>
                    <td>{numberFormat(itm.meanRank2)}</td>
                  </tr>
                  <tr>
                    <th className='text-start'>Alternative</th>
                    <td>{itm.alternative}</td>
                  </tr>
                </tbody>
              </Table>
              
              <span className='form-text p-1' key={idx+'h'}>Interpretation</span>
              <p className='small px-2' key={idx+'i'}>{interpretMannWhitneyU(itm, confidenceLevel)}</p>
            </>)}
        </>
      }
    </>
  )
}
