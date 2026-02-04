import { useState, useEffect } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import { useSelector } from 'react-redux'

import jStat from 'jstat'
import numberFormat from '../../helpers/number-format'

import Table from 'react-bootstrap/Table';

import PanelStatistics from './helpers/PanelStatistics';
import PanelWarning from './helpers/PanelWarning'

import pairs from '../../helpers/generate-pairs'
import mcnemarTest, {interpretMcNemar} from '../../utils/statistics/mcnemarTest'

export default function McNemarPanel(props) {
  return (
    <PanelStatistics 
      widgetType="mcnemar" 
      props={props} 
      CalculateComponent={McNemarTest}
    />
  );
}

function McNemarTest(props) {

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
       

    let data = {}
    let columns = []

    if (subsets.length > 0) {
      for (let series in subsets) {
        let query = getFilteredData('data', { filters: subsets[series].filter, thresholds, dropna: parameter })
        data[subsets[series].id] = getSeries(query.data({ removeMeta: true }), parameter)[parameter] || []

        let cols = getUnique(query.data({ removeMeta: true }), parameter)
        columns = [...new Set([...columns, ...cols])]
      }
    }

    //get input data
    let ids = Object.keys(data)
    let combinationsIDs = pairs(ids) || []
    let combinationsCols = pairs(columns) || []

    let subsetInfo = {}
    ids.forEach((id) => {
      let idxSubset = subsets.findIndex((itm) => itm.id === id)
      subsetInfo[id] = {
        'color': subsets[idxSubset].color || "#000",
        'name': subsets[idxSubset].name || "Unknown"
      }
    })

    let tests = []
    for (let i in combinationsIDs) {
      for (let j in combinationsCols) {
        tests.push({
          rows: combinationsIDs[i],
          cols: combinationsCols[j],
          data: [[
            data[combinationsIDs[i][0]].filter(itm => itm === combinationsCols[j][0]).length,
            data[combinationsIDs[i][0]].filter(itm => itm === combinationsCols[j][1]).length
          ],
          [
            data[combinationsIDs[i][1]].filter(itm => itm === combinationsCols[j][0]).length,
            data[combinationsIDs[i][1]].filter(itm => itm === combinationsCols[j][1]).length
          ]]
        })
      }
    }

    let tables = []
    for (let t in tests) {
      
      let n = jStat.sum(tests[t].data.flat())
          
      let test = mcnemarTest(tests[t].data, true)

      tables.push({
        ...test,
        subsets: [
          subsetInfo[tests[t].rows[0]],
          subsetInfo[tests[t].rows[1]]
        ],
        contingencyTable: tests[t].data,
        view: [
          [{ name: '', color: '' }, ...tests[t].cols, ''],
          [subsetInfo[tests[t].rows[0]], tests[t].data[0][0], tests[t].data[0][1], jStat.sum(tests[t].data[0])],
          [subsetInfo[tests[t].rows[1]], tests[t].data[1][0], tests[t].data[1][1], jStat.sum(tests[t].data[1])],
          [{ name: '', color: '' }, jStat.sum([tests[t].data[0][0], tests[t].data[1][0]]), jStat.sum([tests[t].data[0][1], tests[t].data[1][1]]), n]
        ]
      }
      )

    }

    setResults(tables);

  },[subsets, thresholds, parameter])

  return (
    <>
      {results.length === 0 && <PanelWarning warning={`Test for selected subsets and "${parameterName}" failed.`}/>}
      {results.length > 30 && <PanelWarning warning={<>The current selection of subsets and the category <strong>"{parameterName}"</strong> will generate <strong>{results.length}</strong> tests. Please select fewer subsets or make the filters more stringent to reduce the number of categories.</>}/>}
      {(results.length > 0 && results.length <=30) &&
        <>
          {results.map((table, idx) =>
            <>
              <Table size='sm' className='mt-1' key={idx}>
                 <thead className='text-center small'>
                  <tr>
                    <th><i className='bi-square-fill' style={{ 'color': table.subsets[0].color }} />&nbsp;{table.subsets[0].name}</th>
                    <th><i className='bi-square-fill' style={{ 'color': table.subsets[1].color }} />&nbsp;{table.subsets[1].name}</th>
                  </tr>
                </thead>
                <tbody className='text-center small'>
                  <tr>
                    <td colSpan={2} className='text-start'>{table.testType}</td>
                  </tr>
                  <tr>
                    <th className='text-start'>Statistic</th>
                    <td>{numberFormat(table.statistic)}</td>
                  </tr>
                  <tr>
                    <th className='text-start'>p-value</th>
                    <td className={`${table.pValue < confidenceLevel? 'text-success': 'text-danger'}`}>{numberFormat(table.pValue)}</td>
                  </tr>
                  <tr>
                    <th className='text-start'>Discordant Pairs</th>
                    <td>{table.discordantPairs}</td>
                  </tr>
                  {table?.oddsRatio && <tr>
                    <th className='text-start'>Odds Ratio</th>
                    <td>{numberFormat(table.oddsRatio)}</td>
                  </tr>}
                  <tr>
                    <th className='text-start'>Method</th>
                    <td>{table.method}</td>
                  </tr>
                </tbody>
              </Table>

              <span className='form-text p-1' key={idx+'h1'}>Contingency Table</span>

              <Table responsive bordered size='sm' className='mt-1' key={idx+'t'}>
                <tbody className='small text-center align-middle'>
                  {table.view.map((row, idx) => {
                    return (
                      <tr key={idx}>
                        <td className='text-start'>{row[0].name !== '' && <i className='bi-square-fill' style={{ 'color': row[0].color }} />}&nbsp;{row[0].name}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>

              <span className='form-text p-1' key={idx+'h2'}>Interpretation</span>
              <p className='small px-2' key={idx+'i'}>{interpretMcNemar(table, confidenceLevel)}</p>
            </>
          )}
        </>
      }
    </>
  )
}
