import jStat from 'jstat'
import {getEffectSizeDescription} from './helpers'

/**
 * Welch's t-test (unequal variances)
 * @param {Array} sample1 - First sample data
 * @param {Array} sample2 - Second sample data
 * @param {string} alternative - 'two-sided', 'greater', 'less' (default: 'two-sided')
 * @returns {Object} Test results
 */
export default function welchsTTest(sample1, sample2, alternative = 'two-sided') {
    const n1 = sample1.length;
    const n2 = sample2.length;
    if (n1 === 0 || n2 === 0) {
        return { error: 'Both groups must contain at least one value' };
    }
    const mean1 = jStat.mean(sample1);
    const mean2 = jStat.mean(sample2);
    const variance1 = jStat.variance(sample1, true);
    const variance2 = jStat.variance(sample2, true);
    
    const se1 = variance1 / n1;
    const se2 = variance2 / n2;
    const se = Math.sqrt(se1 + se2);
    
    // Welch-Satterthwaite degrees of freedom with edge case handling
    let df;
    const denominator = Math.pow(se1, 2)/(n1-1) + Math.pow(se2, 2)/(n2-1);
    
    if (denominator === 0) {
        df = 1.0;  // Degenerate case: zero variance
    } else {
        df = Math.pow(se1 + se2, 2) / denominator;
    }
    
    let tStat = (mean1 - mean2) / se;
    let pValue;

    let averageSTDV  = Math.sqrt((variance1 + variance2) / 2)
    let cohenD = (mean1 - mean2) / averageSTDV 

    if (!isFinite(tStat)) {
        pValue = 0;
    } else {
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), df));
        } else if (alternative === 'greater') {
            pValue = 1 - jStat.studentt.cdf(tStat, df);
        } else {
            pValue = jStat.studentt.cdf(tStat, df);
        }
    }
    
    const diffMean = mean1 - mean2;
    
    // Use correct critical value based on alternative hypothesis
    let criticalValue;
    if (alternative === 'two-sided') {
        criticalValue = jStat.studentt.inv(0.975, df);
    } else {
        criticalValue = jStat.studentt.inv(0.95, df);
    }
    
    const ci95 = [
        (alternative === 'less') 
            ? -Infinity 
            : diffMean - criticalValue * se,
        (alternative === 'greater') 
            ? Infinity 
            : diffMean + criticalValue * se
    ];
    
    return {
        testType: "Welch's t-test (unequal variances)",
        tStatistic: tStat,
        pValue,
        degreesOfFreedom: df,
        means: [mean1, mean2],
        meanDifference: diffMean,
        standardError: se,
        averageSTDV,
        cohenD,
        confidenceInterval: ci95,
        alternative
    };
}

/**
 * Interpret Welch's t-test results
 * @param {Object} result - Welch's t-test result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretWelchTTest(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = isSignificant ? "suggests" : "does not suggest";
  const effectSize = getEffectSizeDescription(Math.abs(result.cohenD), 'cohens_d');
  
  return `There is ${isSignificant ? "a statistically significant" : "no statistically significant"} difference between groups with unequal variances (Welch's t(${result.degreesOfFreedom.toFixed(1)})=${result.tStatistic.toFixed(2)}, p=${result.pValue.toFixed(4)}), ${direction} a ${effectSize} practical difference (d=${Math.abs(result.cohenD).toFixed(2)}).`;
}