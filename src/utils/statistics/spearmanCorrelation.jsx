
import jStat from 'jstat'
import getRanks from '../../helpers/getRanks'

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
    
    const ciLower = (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1);
    const ciUpper = (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1);
    
    return {
        correlation: rho,
        pValue: pValue,
        confidenceInterval: [ciLower, ciUpper],
        n: n,
        testStatistic: t
    };
}