import jStat from 'jstat'
import {getEffectSizeDescription} from './helpers'

/**
 * One-sample or two-sample t-test (equal variances assumed)
 * @param {Array} sample1 - First sample data
 * @param {Array} sample2 - Second sample data
 * @param {string} alternative - 'two-sided', 'greater', 'less' (default: 'two-sided')
 * @returns {Object} Test results
 */
export default function tTest(sample1=[], sample2=[], alternative = 'two-sided') {
        const n1 = sample1.length;
        const n2 = sample2.length;
        if (n1 === 0 || n2 === 0) {
            return { error: 'Both groups must contain at least one value' };
        }
      const mean1 = jStat.mean(sample1);
      const mean2 = jStat.mean(sample2);
      const variance1 = jStat.variance(sample1, true);
      const variance2 = jStat.variance(sample2, true);
      
      // Pooled variance
      const df = n1 + n2 - 2;
      const pooledVar = ((n1 - 1) * variance1 + (n2 - 1) * variance2) / df;
      const pooledStdDev = Math.sqrt(pooledVar);
      const se = Math.sqrt(pooledVar * (1/n1 + 1/n2));
      const tStat = (mean1 - mean2) / se;

      const cohenD = (mean1 - mean2) / pooledStdDev;
      
      let pValue;
      if (alternative === 'two-sided') {
          pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), df));
      } else if (alternative === 'greater') {
          pValue = 1 - jStat.studentt.cdf(tStat, df);
      } else {
          pValue = jStat.studentt.cdf(tStat, df);
      }

      if(!isFinite(tStat))
        pValue = 0;
      
      const diffMean = mean1 - mean2;

        // Determine the critical value based on alternative hypothesis
        let criticalValue;
        if (alternative === 'two-sided') {
            criticalValue = jStat.studentt.inv(0.975, df);
        } else {
            // One-sided test: all 5% in one tail
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
          testType: 'Independent Samples t-test',
          tStatistic: tStat,
          pValue,
          degreesOfFreedom: df,
          means: [mean1, mean2],
          meanDifference: diffMean,
          standardError: se,
          pooledVariance: pooledVar,
          cohenD,
          pooledStandardDeviation: pooledStdDev,
          confidenceInterval: ci95,
          alternative: alternative
      };
}

/**
 * Interpret t-test results
 * @param {Object} result - t-test result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretTTest(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = isSignificant ? "suggests" : "does not suggest";
  const effectSize = getEffectSizeDescription(Math.abs(result.cohenD), 'cohens_d');
  
  return `There is ${isSignificant ? "a statistically significant" : "no statistically significant"} difference between the two groups (t(${result.degreesOfFreedom})=${result.tStatistic.toFixed(2)}, p=${result.pValue.toFixed(4)}), ${direction} a ${effectSize} practical difference (d=${Math.abs(result.cohenD).toFixed(2)}).`;
}
