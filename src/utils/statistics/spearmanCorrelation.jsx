
import jStat from 'jstat'
import getRanks from '../../helpers/getRanks'
import {getCorrelationStrength} from './helpers'

/**
 * Spearman Rank Correlation
 * Non-parametric correlation coefficient
 * @param {Array} x - First variable
 * @param {Array} y - Second variable
 * @returns {Object} Correlation coefficient, p-value, and confidence interval
 */
export default function spearmanCorrelation(x, y) {
    if (x.length !== y.length) {
      return {error: 'Groups must have equal length'};
    }
    
    const n = x.length;
    if (n < 3) {
      return {error: 'Need at least 3 data points for correlation'};
    }
    
    // Convert to ranks
    const xRanks = getRanks(x);
    const yRanks = getRanks(y);
    
    // Calculate Pearson correlation on ranks
    const rho = jStat.corrcoeff(xRanks, yRanks);
    
    // Test statistic for significance
    const t = rho * Math.sqrt((n - 2) / (1 - rho * rho));
    
    // P-value (two-tailed test)
    const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(t), n - 2));
    
    // 95% Confidence interval using Fisher's Z transformation
    const z = 0.5 * Math.log((1 + rho) / (1 - rho));
    const zSE = 1 / Math.sqrt(n - 3);
    const zLower = z - 1.96 * zSE;
    const zUpper = z + 1.96 * zSE;
    
    let ciLower = (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1);
    let ciUpper = (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1);

    if(rho >= 1){
      ciLower = 1;
      ciUpper = 1;
    }
    if(rho <= -1){
      ciLower = -1;
      ciUpper = -1;
    }
    
    return {
      testType: 'Spearman Correlation',
      correlation: rho,
      pValue: isNaN(pValue)? 0 : pValue,
      confidenceInterval: [ciLower, ciUpper],
      n: n,
      testStatistic: t
    };
}

/**
 * Interpret Spearman Correlation results
 * @param {Object} result - Spearman correlation result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretSpearmanCorrelation(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = result.correlation > 0 ? "positive" : "negative";
  const strength = getCorrelationStrength(Math.abs(result.correlation));
  
  return `There is a ${isSignificant ? "statistically significant" : "non-significant"} ${strength} ${direction} monotonic relationship between the variables (ρ=${result.correlation.toFixed(3)}, p=${result.pValue.toFixed(4)}), ${isSignificant ? "indicating" : "suggesting no"} a meaningful rank-based association.`;
}