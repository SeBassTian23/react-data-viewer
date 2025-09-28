
import jStat from 'jstat'

/**
 * One-sample or two-sample t-test (equal variances assumed)
 * @param {Array} sample1 - First sample data
 * @param {Array} sample2 - Second sample data (optional, for two-sample test)
 * @param {number} mu - Hypothesized mean for one-sample test (default: 0)
 * @param {string} alternative - 'two-sided', 'greater', 'less' (default: 'two-sided')
 * @returns {Object} Test results
 */
export default function tTest(sample1, sample2 = null, mu = 0, alternative = 'two-sided') {
  if (sample2 === null) {
      // One-sample t-test
      const n = sample1.length;
      const mean1 = jStat.mean(sample1);
      const std1 = jStat.stdev(sample1, true); // sample standard deviation
      const se = std1 / Math.sqrt(n);
      const tStat = (mean1 - mu) / se;
      const df = n - 1;
      
      let pValue;
      if (alternative === 'two-sided') {
          pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), df));
      } else if (alternative === 'greater') {
          pValue = 1 - jStat.studentt.cdf(tStat, df);
      } else {
          pValue = jStat.studentt.cdf(tStat, df);
      }
      
      const ci95 = [
          mean1 - jStat.studentt.inv(0.975, df) * se,
          mean1 + jStat.studentt.inv(0.975, df) * se
      ];
      
      return {
          testType: 'One-sample t-test',
          tStatistic: tStat,
          pValue: pValue,
          degreesOfFreedom: df,
          sampleMean: mean1,
          standardError: se,
          confidenceInterval95: ci95,
          alternative: alternative
      };
  } else {
      // Two-sample t-test (equal variances)
      const n1 = sample1.length;
      const n2 = sample2.length;
      const mean1 = jStat.mean(sample1);
      const mean2 = jStat.mean(sample2);
      const var1 = jStat.variance(sample1, true);
      const var2 = jStat.variance(sample2, true);
      
      // Pooled variance
      const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
      const se = Math.sqrt(pooledVar * (1/n1 + 1/n2));
      const tStat = (mean1 - mean2) / se;
      const df = n1 + n2 - 2;
      
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
          testType: 'Two-sample t-test (equal variances)',
          tStatistic: tStat,
          pValue: pValue,
          degreesOfFreedom: df,
          mean1: mean1,
          mean2: mean2,
          meanDifference: diffMean,
          standardError: se,
          pooledVariance: pooledVar,
          confidenceInterval95: ci95,
          alternative: alternative
      };
  }
}