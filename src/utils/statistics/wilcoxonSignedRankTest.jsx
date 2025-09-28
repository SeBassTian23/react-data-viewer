
import jStat from 'jstat'
import getRanks from '../../helpers/getRanks'

/**
 * Wilcoxon Signed-Rank Test
 * Non-parametric test for paired samples
 * @param {Array} x - First sample (paired data)
 * @param {Array} y - Second sample (paired data) 
 * @param {string} alternative - 'two-sided', 'less', or 'greater'
 * @returns {Object} Test results with statistic, p-value, and effect size
 */
export default function wilcoxonSignedRankTest(x, y, alternative = 'two-sided') {
    if (x.length !== y.length) {
      return {error: 'Samples must have equal length for paired test'};
    }
    
    // Calculate differences and remove zeros
    const differences = [];
    for (let i = 0; i < x.length; i++) {
        const diff = x[i] - y[i];
        if (diff !== 0) {
            differences.push(diff);
        }
    }
    
    if (differences.length === 0) {
        return { statistic: 0, pValue: 1.0, effectSize: 0, n: 0 };
    }
    
    const n = differences.length;
    
    // Get absolute values and ranks
    const absDiffs = differences.map(Math.abs);
    const ranks = getRanks(absDiffs);
    
    // Calculate W+ (sum of ranks for positive differences)
    let wPlus = 0;
    for (let i = 0; i < differences.length; i++) {
        if (differences[i] > 0) {
            wPlus += ranks[i];
        }
    }
    
    // For large samples (n > 20), use normal approximation
    let pValue;
    if (n > 20) {
        const expectedW = n * (n + 1) / 4;
        const varianceW = n * (n + 1) * (2 * n + 1) / 24;
        const z = (wPlus - expectedW) / Math.sqrt(varianceW);
        
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
        } else if (alternative === 'greater') {
            pValue = 1 - jStat.normal.cdf(z, 0, 1);
        } else {
            pValue = jStat.normal.cdf(z, 0, 1);
        }
    } else {
        // For small samples, use exact distribution (approximated)
        const expectedW = n * (n + 1) / 4;
        const varianceW = n * (n + 1) * (2 * n + 1) / 24;
        const z = (wPlus - expectedW) / Math.sqrt(varianceW);
        
        if (alternative === 'two-sided') {
            pValue = 2 * Math.min(0.5, 1 - jStat.normal.cdf(Math.abs(z), 0, 1));
        } else if (alternative === 'greater') {
            pValue = 1 - jStat.normal.cdf(z, 0, 1);
        } else {
            pValue = jStat.normal.cdf(z, 0, 1);
        }
    }
    
    // Effect size (r = Z / sqrt(N))
    const z = (wPlus - n * (n + 1) / 4) / Math.sqrt(n * (n + 1) * (2 * n + 1) / 24);
    const effectSize = Math.abs(z) / Math.sqrt(n);
    
    return {
        statistic: wPlus,
        pValue: Math.max(0, Math.min(1, pValue)),
        effectSize: effectSize,
        n: n,
        alternative: alternative
    };
}
