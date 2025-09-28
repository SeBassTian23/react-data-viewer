
import jStat from 'jstat'

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
    const mean1 = jStat.mean(sample1);
    const mean2 = jStat.mean(sample2);
    const var1 = jStat.variance(sample1, true);
    const var2 = jStat.variance(sample2, true);
    
    const se1 = var1 / n1;
    const se2 = var2 / n2;
    const se = Math.sqrt(se1 + se2);
    
    const tStat = (mean1 - mean2) / se;
    
    // Welch-Satterthwaite degrees of freedom
    const df = Math.pow(se1 + se2, 2) / (Math.pow(se1, 2)/(n1-1) + Math.pow(se2, 2)/(n2-1));
    
    let pValue;
    if (alternative === 'two-sided') {
        pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), df));
    } else if (alternative === 'greater') {
        pValue = 1 - jStat.studentt.cdf(tStat, df);
    } else {
        pValue = jStat.studentt.cdf(tStat, df);
    }
    
    const diffMean = mean1 - mean2;
    const ci95 = [
        diffMean - jStat.studentt.inv(0.975, df) * se,
        diffMean + jStat.studentt.inv(0.975, df) * se
    ];
    
    return {
        testType: "Welch's t-test (unequal variances)",
        tStatistic: tStat,
        pValue: pValue,
        degreesOfFreedom: df,
        mean1: mean1,
        mean2: mean2,
        meanDifference: diffMean,
        standardError: se,
        variance1: var1,
        variance2: var2,
        confidenceInterval95: ci95,
        alternative: alternative
    };
}
