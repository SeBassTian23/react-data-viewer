import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'
import { getFilteredData, getSeries } from '../../modules/database'

import Table from 'react-bootstrap/Table';

import PanelStatistics from './helpers/PanelStatistics'
import PanelWarning from './helpers/PanelWarning'

import oneWayANOVA, {interpretOneWayANOVA} from '../../utils/statistics/oneWayANOVA'
import numberFormat from '../../helpers/number-format'


export default function ANOVAPanel(props) {
  return (
    <PanelStatistics 
      widgetType="anova" 
      props={props} 
      CalculateComponent={CalculateANOVA}
    />
  );
}

function CalculateANOVA(props) {

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
    let columns = []
  
    if (subsets.length > 0) {
      for (let series in subsets) {
        let query = getFilteredData('data', { filters: subsets[series].filter, thresholds, dropna: parameter })
        data.push(getSeries(query.data({ removeMeta: true }), parameter)[parameter] || [])
        columns.push(subsets[series].id)
      }
    }
  
    setResults( oneWayANOVA(data, columns) );

  },[subsets, thresholds, parameter])


  return (
    <>
      { (results && results.error) && <PanelWarning warning={`ANOVA for selected subsets and "${parameterName}" failed. ${results.error}`}/>}

      { (results && !results.error) && <>
        <Table size="sm" className='align-middle small'>
          <tbody>
            <tr>
              <td colSpan={2}>{results.testType}</td>
            </tr>
            <tr>
              <th>f-value</th>
              <td>{numberFormat(results.fStatistic)}</td>
            </tr>
            <tr>
              <th>Eta-squared (η²)</th>
              <td>{numberFormat(results.etaSquared)}</td>
            </tr>
            <tr>
              <th title="Degrees of Freedom">Degrees Of Freedom</th>
              <td>{results.degreesOfFreedomTotal} <small>(total)</small><br />{results.degreesOfFreedomBetween} <small>(between)</small><br />{results.degreesOfFreedomWithin} <small>(within)</small></td>
            </tr>
            <tr>
              <th>Mean Squares</th>
              <td>{numberFormat(results.meanSquares.between)} <small>(between)</small><br />{numberFormat(results.meanSquares.within)} <small>(within)</small></td>
            </tr>
            <tr>
              <th>Overall Mean</th>
              <td>{numberFormat(results.overallMean)}</td>
            </tr>
            <tr>
              <th>p-value</th>
              <td className={`${results.pValue < 1-confidenceLevel? 'text-success': 'text-danger'}`}>{numberFormat(results.pValue)}</td>
            </tr>
            <tr>
              <th>Sum Of Squares</th>
              <td>{numberFormat(results.sumOfSquares.between)} <small>(between)</small><br />{numberFormat(results.sumOfSquares.total)} <small>(total)</small><br />{numberFormat(results.sumOfSquares.within)} <small>(within)</small></td>
            </tr>
            <tr>
              <th>Total Sample Size</th>
              <td>{results.totalSampleSize}</td>
            </tr>
          </tbody>
        </Table>

        <span className='form-text p-1'>Group Statistics</span>
        <Table responsive bordered size="sm" className='small align-middle text-center'>
          <thead>
            <tr>
              <th>Groups</th>
              <th>N</th>
              <th>Mean</th>
              <th>S.D.</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {results.groupStatistics.map( (row, idx) => <tr key={idx}>
              <td className='text-start'><i className='bi-square-fill' style={{ 'color': subsets.find(itm => itm?.id == row.label)?.color || '#000' }} />&nbsp;{subsets.find(itm => itm?.id == row.label)?.name}</td>
              <td>{row.n}</td>
              <td>{numberFormat(row.mean)}</td>
              <td>{numberFormat(row.standardDeviation)}</td>
              <td>{numberFormat(row.variance)}</td>
            </tr>)}
          </tbody>
        </Table>

        <span className='form-text p-1'>Interpretation</span>
        <p className='small px-2'>{interpretOneWayANOVA(results, confidenceLevel)}</p>
      </>
      }
    </>
  )
}
