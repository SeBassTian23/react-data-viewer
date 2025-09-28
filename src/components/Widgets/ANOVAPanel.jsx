import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'
import { getFilteredData, getSeries, getUnique } from '../../modules/database'

import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

import jStat from 'jstat'
import round from 'lodash/round';

import PanelInputForm from './PanelInputForm'

import widgets from '../../constants/widgets';

export default function ANOVAPanel(props) {

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

  const widget = widgets.find(itm => itm.type == 'anova');

  return (
    <>
      {!state && <PanelInputForm {...props} selectType='number' selectHelp={`Parameter for ${widget.name}`} />}
      {state && <>
        <Card.Body className='p-0 overflow-y-hidden'>
          <CalculateANOVA {...props} subsets={subsets} thresholds={thresholds} />
        </Card.Body>
      </>}
    </>
  )
}

function CalculateANOVA(props) {

  const parameter = props.parameter
  const subsets = props.subsets || []
  const thresholds = props.thresholds

  const ConfidenceInterval = props.confidence_level || 0.05

  let data = []
  let columns = []

  if (subsets.length > 0) {
    for (let series in subsets) {
      let query = getFilteredData('data', { filters: subsets[series].filter, thresholds, dropna: parameter })
      data.push(getSeries(query.data({ removeMeta: true }), parameter)[parameter] || [])
      columns.push(subsets[series].id)
    }
  }

  const anovadata = oneWayANOVA(data, columns)

  return (
    <>
      {anovadata.length === 0 &&
        <div className='d-flex justify-content-center align-items-center m-0 p-3 h-100'>
          <span className='text-danger small'>
            ANOVA for selected subsets and "{parameter}" failed.
          </span>
        </div>
      }

      {anovadata.error &&
        <div className='d-flex justify-content-center align-items-center m-0 p-3 h-100'>
          <span className='text-danger small'>
            {anovadata.error}
          </span>
        </div>
      }

      {!anovadata.error && <>
        <Table size="sm" className='align-middle small'>
          <thead className='text-center'>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th title="Degrees of Freedom - Between">D.F. Between</th>
              <td>{anovadata.degreesOfFreedomBetween}</td>
            </tr>
            <tr>
              <th title="Degrees of Freedom - Total">D.F. Total</th>
              <td>{anovadata.degreesOfFreedomTotal}</td>
            </tr>
            <tr>
              <th title="Degrees of Freedom - Within">D.F. Within</th>
              <td>{anovadata.degreesOfFreedomWithin}</td>
            </tr>
            <tr>
              <th>Eta-squared (η²)</th>
              <td>{round(anovadata.etaSquared, 4)}</td>
            </tr>
            <tr>
              <th><em>f</em>-Value</th>
              <td>{round(anovadata.fStatistic, 4)}</td>
            </tr>
            <tr>
              <th>Mean Squares</th>
              <td>{round(anovadata.meanSquares.between, 4)} <small>(between)</small><br />{round(anovadata.meanSquares.within, 4)} <small>(within)</small></td>
            </tr>
            <tr>
              <th>Overall Mean</th>
              <td>{round(anovadata.overallMean, 4)}</td>
            </tr>
            <tr>
              <th><em>p</em>-Value</th>
              <td className={`${anovadata.pValue < ConfidenceInterval? 'text-success': 'text-danger'}`}>{anovadata.pValue < ConfidenceInterval? '< ' + ConfidenceInterval : round(anovadata.pValue, 4)}</td>
            </tr>
            <tr>
              <th>Sum Of Squares</th>
              <td>{round(anovadata.sumOfSquares.between, 4)} <small>(between)</small><br />{round(anovadata.sumOfSquares.total, 4)} <small>(total)</small><br />{round(anovadata.sumOfSquares.within, 4)} <small>(within)</small></td>
            </tr>
            <tr>
              <th>Total Sample Size</th>
              <td>{anovadata.totalSampleSize}</td>
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
            {anovadata.groupStatistics.map(row => <tr>
              <td><i className='bi-square-fill' style={{ 'color': subsets.find(itm => itm?.id == row.label)?.color || '#000' }} />&nbsp;{subsets.find(itm => itm?.id == row.label)?.name}</td>
              <td>{row.n}</td>
              <td>{round(row.mean, 4)}</td>
              <td>{round(row.standardDeviation, 4)}</td>
              <td>{round(row.variance, 4)}</td>
            </tr>)}
          </tbody>
        </Table>
        <span className='form-text text-muted small p-1'>Confidence: <em>p</em> {'<'} {ConfidenceInterval || 'unknown'}</span>
      </>
      }
    </>
  )
}

/**
 * One-way ANOVA
 * @param {Array} groups - Array of arrays, each containing data for one group
 * @param {Array} labels - Group labels (optional)
 * @returns {Object} ANOVA results
 */
function oneWayANOVA(groups, labels = null) {
  if (!Array.isArray(groups) || groups.length < 2) {
    return { error: 'Need at least 2 groups' };
  }

  const k = groups.length; // number of groups
  const groupSizes = groups.map(g => g.length);
  const n = jStat.sum(groupSizes); // total sample size

  if (labels === null) {
    labels = groups.map((_, i) => `Group ${i + 1}`);
  }

  // Group means and overall mean
  const groupMeans = groups.map(g => jStat.mean(g));
  const allData = groups.flat();
  const overallMean = jStat.mean(allData);

  // Sum of squares between groups (SSB)
  const ssb = jStat.sum(groups.map((g, i) => g.length * Math.pow(groupMeans[i] - overallMean, 2)));

  // Sum of squares within groups (SSW)
  const ssw = jStat.sum(groups.map((g, i) =>
    jStat.sum(g.map(x => Math.pow(x - groupMeans[i], 2)))
  ));

  // Total sum of squares
  const sst = ssb + ssw;

  // Degrees of freedom
  const dfBetween = k - 1;
  const dfWithin = n - k;
  const dfTotal = n - 1;

  // Mean squares
  const msb = ssb / dfBetween;
  const msw = ssw / dfWithin;

  // F-statistic and p-value
  const fStat = msb / msw;
  const pValue = 1 - jStat.centralF.cdf(fStat, dfBetween, dfWithin);

  // Effect size (eta-squared)
  const etaSquared = ssb / sst;

  // Group statistics
  const groupStats = groups.map((g, i) => ({
    label: labels[i],
    n: g.length,
    mean: groupMeans[i],
    variance: jStat.variance(g, true),
    standardDeviation: jStat.stdev(g, true)
  }));

  return {
    testType: 'One-way ANOVA',
    fStatistic: fStat,
    pValue: pValue,
    degreesOfFreedomBetween: dfBetween,
    degreesOfFreedomWithin: dfWithin,
    degreesOfFreedomTotal: dfTotal,
    sumOfSquares: {
      between: ssb,
      within: ssw,
      total: sst
    },
    meanSquares: {
      between: msb,
      within: msw
    },
    etaSquared: etaSquared,
    groupStatistics: groupStats,
    overallMean: overallMean,
    totalSampleSize: n
  };
}