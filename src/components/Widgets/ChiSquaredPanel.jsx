import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'
import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Table from 'react-bootstrap/Table';

import numberFormat from '../../helpers/number-format'

import PanelStatistics from './helpers/PanelStatistics'
import PanelWarning from './helpers/PanelWarning'

import chiSquaredTest, {interpretChiSquaredTest} from '../../utils/statistics/chiSquaredTest'

export default function ChiSquarePanel(props) {
  return (
    <PanelStatistics 
      widgetType="chisquared" 
      props={props} 
      CalculateComponent={CalculateChiSquare}
    />
  );
}

function CalculateChiSquare(props) {

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

    let data = []
    let rowLabels = []
    let colLabels = []

    if (subsets.length > 0) {
      for (let series in subsets) {
        let query = getFilteredData('data', { filters: subsets[series].filter, thresholds, dropna: parameter })
        data.push(getSeries(query.data({ removeMeta: true }), parameter)[parameter] || [])
        
        let cols = getUnique(query.data({ removeMeta: true }), parameter)
        colLabels = [...new Set([...colLabels, ...cols])]
        
        rowLabels.push({
          id: subsets[series].id,
          name: subsets[series].name,
          color: subsets[series].color
        })
      }
    }

    // Build contingency table
    let contingencyTableData = []

    for(let i in data){
      let row = []
      for(let ii in colLabels){
        row.push( data[i].filter(el => el == colLabels[ii]).length || 0 )
      }
      contingencyTableData.push(row)
    }

    // Run test
    let test = chiSquaredTest(contingencyTableData);

    // Header Row
    let resultTable = [];
    if(!test.error){
      resultTable.push( [null, ...colLabels, null] );
      for(let i=0; i<test.rowCount; i++){
        let row = [rowLabels[i] || null]
        for(let ii=0; ii<test.colCount; ii++){
          row.push( test.details.find( itm => itm.row == i && itm.column == ii ) )
        }
        row.push(test.rowTotals[i])
        resultTable.push( row )
      }
      // Footer Row
      resultTable.push( [null, ...test.columnTotals, test.sampleSize] );
    }

    // Add table to test
    test = {...test, ...{table: resultTable} }

    setResults(test);

  },[subsets, thresholds, parameter])

  return (
    <>
      {(results && results.error) && <PanelWarning warning={`Test for selected subsets and "${parameterName}" failed. ${results.error}`}/>}
      {(results && !results.error) &&<>
          <Table size="sm">
            <tbody className='text-start small'>
              <tr>
                <td colSpan={2}>{results.testType}</td>
              </tr>
              <tr>
                <th>Statistic</th>
                <td>{numberFormat(results.statistic)}</td>
              </tr>
              <tr>
                <th>p-value</th>
                <td>{numberFormat(results.pValue)}</td>
              </tr>
              <tr>
                <th>Effect Size</th>
                <td>{numberFormat(results.effectSize)}</td>
              </tr>
              <tr>
                <th>Sample Size</th>
                <td>{results.sampleSize}</td>
              </tr>
              <tr>
                <th>Degrees Of Freedom</th>
                <td>{results.degreesOfFreedom}</td>
              </tr>
            </tbody>
          </Table>

          <span className='form-text p-1'>Contingency Table - Observed (Expected)</span>

          <Table responsive bordered size="sm" className='align-middle text-center'>
            <tbody className='text-center small'>
              {results && results.table.map( (row, idx, arr) => {
                return <tr key={idx}>
                  { row.map( (cell, cidx, carr) => {
                      // Header row
                      if(idx == 0)
                        return <td key={cidx}>{cell}</td>

                      // Footer row
                      if(idx == arr.length-1)
                        return <td className={`${cidx == carr.length-1? 'fw-bold' : ''}`} key={cidx}>{cell}</td>

                      // Add row Totals
                      if(cidx == carr.length-1)
                        return <td key={cidx}>{cell}</td>

                      if(cidx == 0)
                        return <td key={cidx} className='text-start'>
                          <i className='bi-square-fill' style={{ 'color': cell?.color }} /> {cell?.name}
                        </td>

                      return <td key={cidx} 
                        className={`${cell?.expectedWarning? 'bg-danger-subtle' : ''}`}
                        title={'𝛸²: '+ cell?.chiSquared}
                        >
                          {cell?.observed}
                          <br />
                          <small className='fw-light'>({ numberFormat(cell?.expected)})</small>
                        </td>
                  }) }
                </tr>
              })}
            </tbody>
          </Table>
          
          <span className='form-text p-1'>Interpretation</span>
          <p className='small px-2'>{interpretChiSquaredTest(results, confidenceLevel)}</p>
        </>
      }
    </>
  )
}