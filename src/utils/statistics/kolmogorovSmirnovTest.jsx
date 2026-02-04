
import jStat from 'jstat'

/**
 * Kolmogorov-Smirnov test
 * @param {Array} sample1 - First sample
 * @param {Array} sample2 - Second sample (optional, for two-sample test)
 * @param {Function} cdf - Theoretical CDF for one-sample test (optional)
 * @param {string} alternative - 'two-sided', 'greater', 'less' (default: 'two-sided')
 * @returns {Object} Test results
 */
export default function kolmogorovSmirnovTest(sample1, sample2 = null, cdf = null, alternative = 'two-sided') {
    if (sample2 === null && cdf === null) {
        throw new Error('For one-sample test, provide a CDF function');
    }
    
    if (sample2 === null) {
        // One-sample KS test
        const n = sample1.length;
        const sortedSample = [...sample1].sort((a, b) => a - b);
        
        let dPlus = 0; // max(F_n(x) - F_0(x))
        let dMinus = 0; // max(F_0(x) - F_n(x))
        
        for (let i = 0; i < n; i++) {
            const empiricalCDF = (i + 1) / n;
            const theoreticalCDF = cdf(sortedSample[i]);
            const empiricalCDFPrev = i / n;
            
            dPlus = Math.max(dPlus, empiricalCDF - theoreticalCDF);
            dMinus = Math.max(dMinus, theoreticalCDF - empiricalCDFPrev);
        }
        
        let dStat;
        if (alternative === 'two-sided') {
            dStat = Math.max(dPlus, dMinus);
        } else if (alternative === 'greater') {
            dStat = dPlus;
        } else {
            dStat = dMinus;
        }
        
        // Approximate p-value using Kolmogorov distribution
        const lambda = dStat * Math.sqrt(n);
        let pValue;
        
        if (alternative === 'two-sided') {
            pValue = 2 * Math.exp(-2 * lambda * lambda);
        } else {
            pValue = Math.exp(-2 * lambda * lambda);
        }
        
        // More accurate approximation for small p-values
        if (pValue < 0.1) {
            pValue = 1 - jStat.kolmogorovsmirnov.cdf(dStat, n);
        }
        
        return {
            testType: 'One-sample Kolmogorov-Smirnov test',
            dStatistic: dStat,
            pValue: Math.min(pValue, 1),
            sampleSize: n,
            alternative: alternative
        };
    } else {
        // Two-sample KS test
        const n1 = sample1.length;
        const n2 = sample2.length;
        const sortedSample1 = [...sample1].sort((a, b) => a - b);
        const sortedSample2 = [...sample2].sort((a, b) => a - b);
        
        // Combine and sort all unique values
        const combined = [...new Set([...sortedSample1, ...sortedSample2])].sort((a, b) => a - b);
        
        let dPlus = 0;
        let dMinus = 0;
        
        for (const value of combined) {
            const cdf1 = sortedSample1.filter(x => x <= value).length / n1;
            const cdf2 = sortedSample2.filter(x => x <= value).length / n2;
            
            dPlus = Math.max(dPlus, cdf1 - cdf2);
            dMinus = Math.max(dMinus, cdf2 - cdf1);
        }
        
        let dStat;
        if (alternative === 'two-sided') {
            dStat = Math.max(dPlus, dMinus);
        } else if (alternative === 'greater') {
            dStat = dPlus;
        } else {
            dStat = dMinus;
        }
        
        // Approximate p-value for two-sample test
        const lambda = dStat * Math.sqrt((n1 * n2) / (n1 + n2));
        let pValue;
        
        if (alternative === 'two-sided') {
            pValue = 2 * Math.exp(-2 * lambda * lambda);
        } else {
            pValue = Math.exp(-2 * lambda * lambda);
        }
        
        return {
            testType: 'Kolmogorov-Smirnov Test',
            dStatistic: dStat,
            pValue: Math.min(pValue, 1),
            sampleSize1: n1,
            sampleSize2: n2,
            alternative: alternative
        };
    }
}

/**
 * Interpret Kolmogorov-Smirnov test results
 * @param {Object} result - KS test result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretKolmogorovSmirnovTest(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = isSignificant ? "indicates" : "does not indicate";
  
  return `The distributions show ${isSignificant ? "a statistically significant" : "no statistically significant"} difference (D=${result.dStatistic.toFixed(3)}, p=${result.pValue.toFixed(4)}), ${direction} that the two samples come from different distributions.`;
}