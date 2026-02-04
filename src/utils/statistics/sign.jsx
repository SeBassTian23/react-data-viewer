import jStat from 'jstat'

/**
 * Sign test
 * @param {Array} x - Before
 * @param {Array} y - After
 * @param {string} alternative - 'two-sided', 'greater', 'less' (default: 'two-sided')
 * @returns {Object} Test results
 */
export default function sign(before, after, alternative = 'two-sided' ) {
  if (before.length !== after.length || before.length === 0)
    return {error: "Before and after groups must have equal length and contain at least one value."}
  
  const differences = before.map((b, i) => after[i] - b);
  const nonZeroDiffs = differences.filter(d => d !== 0);
  const n = nonZeroDiffs.length;

  if (n === 0)
    return {error: "All differences are zero. Cannot perform sign test."}

  const positive = nonZeroDiffs.filter(d => d > 0).length;
  const negative = nonZeroDiffs.filter(d => d < 0).length;

  // Sign test uses binomial distribution with p = 0.5
  let pValue;
  
  if (alternative === 'two-sided') {
    const smaller = Math.min(positive, negative);
    pValue = 2 * jStat.binomial.cdf(smaller, n, 0.5);
    pValue = Math.min(pValue, 1);
  } else if (alternative === 'greater') {
    pValue = 1 - jStat.binomial.cdf(positive - 1, n, 0.5);
    pValue = Math.min(pValue, 1);
  } else {
    pValue = jStat.binomial.cdf(positive, n, 0.5);
    pValue = Math.min(pValue, 1);
  }
  
  return {
    testType: 'Sign Test',
    pairs: before.length,
    non_zero_diff: n,
    sample_diff: `${differences.slice(0, 10).map(d => d.toFixed(2)).join(', ')}${differences.length > 10 ? '...' : ''}`,
    positive,
    negative,
    ignored: before.length - n,
    pValue,
    alternative
  }
}


/**
 * Interpret Sign test results
 * @param {Object} result - Sign test result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretSignTest(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = isSignificant ? "indicates" : "does not indicate";
  const ratio = result.positive > result.negative ? `more positive (${result.positive}:${result.negative})` : `more negative (${result.negative}:${result.positive})`;
  
  return `The paired samples show ${isSignificant ? "a statistically significant" : "no statistically significant"} difference in direction (p=${result.pValue.toFixed(4)}), ${direction} a consistent ${ratio} trend across the ${result.non_zero_diff} pairs.`;
}