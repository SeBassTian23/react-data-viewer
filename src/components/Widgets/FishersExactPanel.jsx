import { useState, useEffect } from 'react'

import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Table from 'react-bootstrap/Table';

import { useSelector } from 'react-redux'

import PanelStatistics from './helpers/PanelStatistics'
import PanelWarning from './helpers/PanelWarning'
import pairs from '../../helpers/generate-pairs'
import fisherExactTest, {interpretFisherExactTest} from '../../utils/statistics/fisherExactTest'

import numberFormat from '../../helpers/number-format'

export default function FishersExactPanel(props) {
  return (
    <PanelStatistics 
      widgetType="fishersexact" 
      props={props} 
      CalculateComponent={CalculateFishersExact}
    />
  );
}

function CalculateFishersExact(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds
  const alternative = props.alternative
  const stateParameters = useSelector(state => state.parameters)
  const parameterName = stateParameters.find(itm => itm.name == props?.parameter)?.alias || props?.parameter

  const confidenceLevel = props.confidence_level || 0.05

  const [results, setResults] = useState([]);
  const [hasError, setHasError] = useState(null);

  useEffect( () => {
    
    if(!parameter){
      setResults([]);
      setHasError(null);
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
      tables.push({
        rowLabels: tests[t].rows.map( itm => subsetInfo[itm]),
        colLabels: tests[t].cols,
        ...fisherExactTest(tests[t].data, alternative)
      })
    }

    setResults(tables);

    if(results.length == 0)
      setHasError(`Not enough subsets (${Object.keys(subsetInfo).length}) and categories (${columns.length}) to generate combinations for a test.`);

  },[subsets, thresholds, parameter])

  return (
    <>
      {(results.length === 0) && <PanelWarning warning={`Test for selected subsets and "${parameterName}" failed. ${hasError}`}/>}
      {(results.length > 30) && <PanelWarning warning={<>The current selection of subsets and the category <strong>"{parameterName}"</strong> will generate <strong>{results.length}</strong> tests. Please select fewer subsets or make the filters more stringent to reduce the number of categories.</>}/>
      }
      {(results.length > 0 && results.length <=30) &&
        <>
          {results.map((table, idx) => {
            return (
              <>
                <Table size='sm' key={idx}>
                  <tbody className='small text-center align-middle'>
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
                      <th className='text-start'>Alternative</th>
                      <td>{table.alternative}</td>
                    </tr>
                  </tbody>
                </Table>

                <span className='form-text p-1' key={idx+'h1'}>Contingency Table</span>

                <Table responsive bordered size='sm' key={idx+'t'}>
                  <tbody className='small text-center align-middle'>
                    <tr>
                      <td></td>
                      <td>{table.colLabels[0]}</td>
                      <td>{table.colLabels[1]}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td className='text-start'><i className='bi-square-fill' style={{ 'color': table.rowLabels[0].color }} /> {table.rowLabels[0].name}</td>
                      <td>{table.a}</td>
                      <td>{table.b}</td>
                      <td>{table.rowSums[0]}</td>
                    </tr>
                    <tr>
                      <td className='text-start'><i className='bi-square-fill' style={{ 'color': table.rowLabels[1].color }} /> {table.rowLabels[1].name}</td>
                      <td>{table.c}</td>
                      <td>{table.d}</td>
                      <td>{table.rowSums[1]}</td>
                    </tr>
                    <tr>
                      <td>{''}</td>
                      <td>{table.colSums[0]}</td>
                      <td>{table.colSums[1]}</td>
                      <td>{table.n}</td>
                    </tr>
                  </tbody>
                </Table>

                <span className='form-text p-1' key={idx+'h2'}>Interpretation</span>
                <p className='small px-2' key={idx+'i'}>{interpretFisherExactTest(table, confidenceLevel)}</p>
              </>
            )
          })}
        </>
      }
    </>
  )
}
