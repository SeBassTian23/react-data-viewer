
import jStat from 'jstat'

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
