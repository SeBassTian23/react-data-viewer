import jStat from 'jstat'
import {getEffectSizeDescription} from './helpers'

/**
 * One-way ANOVA
 * @param {Array} groups - Array of arrays, each containing data for one group
 * @param {Array} labels - Group labels (optional)
 * @returns {Object} ANOVA results
 */
export default function oneWayANOVA(groups, labels = null) {
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

/**
 * Interpret One-Way ANOVA results
 * @param {Object} result - ANOVA result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretOneWayANOVA(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = isSignificant ? "supports" : "does not support";
  const effectSize = getEffectSizeDescription(result.etaSquared, 'anova');
  
  return `The difference between groups is ${isSignificant ? "statistically significant" : "not statistically significant"} (F(${result.degreesOfFreedomBetween},${result.degreesOfFreedomWithin})=${result.fStatistic.toFixed(2)}, p=${result.pValue.toFixed(4)}), ${direction} the hypothesis of group differences with a ${effectSize} effect size (η²=${result.etaSquared.toFixed(4)}).`;
}