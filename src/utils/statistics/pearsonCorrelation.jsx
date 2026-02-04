
import jStat from 'jstat'
import {getCorrelationStrength} from './helpers'

/**
 * Pearson correlation coefficient test
 * @param {Array} x - First variable
 * @param {Array} y - Second variable
 * @param {string} alternative - 'two-sided', 'greater', 'less' (default: 'two-sided')
 * @returns {Object} Test results
 */
export default function pearsonCorrelation(x, y, alternative = 'two-sided') {
    if (x.length !== y.length) {
        return {error: 'Groups must have equal length'};
    }   
    
    const n = x.length;
    const r = jStat.corrcoeff(x, y);
    
    // Test statistic: t = r * sqrt((n-2)/(1-r^2))
    const tStat = r * Math.sqrt((n - 2) / (1 - r * r));
    const df = n - 2;
    
    let pValue;
    if (alternative === 'two-sided') {
        pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), df));
    } else if (alternative === 'greater') {
        pValue = 1 - jStat.studentt.cdf(tStat, df);
    } else {
        pValue = jStat.studentt.cdf(tStat, df);
    }
    
    // Fisher's z-transformation for confidence interval
    const zr = 0.5 * Math.log((1 + r) / (1 - r));
    const seZ = 1 / Math.sqrt(n - 3);
    const zCritical = jStat.normal.inv(0.975, 0, 1);
    
    const zLower = zr - zCritical * seZ;
    const zUpper = zr + zCritical * seZ;
    
    const ci95 = [
        (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1),
        (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1)
    ];
    
    return {
        testType: 'Pearson correlation',
        correlationCoefficient: r,
        tStatistic: tStat,
        pValue: pValue,
        degreesOfFreedom: df,
        sampleSize: n,
        confidenceInterval95: ci95,
        alternative: alternative
    };
}

/**
 * Interpret Pearson Correlation results
 * @param {Object} result - Pearson correlation result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretPearsonCorrelation(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = result.correlationCoefficient > 0 ? "positive" : "negative";
  const strength = getCorrelationStrength(Math.abs(result.correlationCoefficient));
  
  return `There is a ${isSignificant ? "statistically significant" : "non-significant"} ${strength} ${direction} correlation between the variables (r=${result.correlationCoefficient.toFixed(3)}, p=${result.pValue.toFixed(4)}), ${isSignificant ? "indicating" : "suggesting no"} a meaningful linear relationship.`;
}