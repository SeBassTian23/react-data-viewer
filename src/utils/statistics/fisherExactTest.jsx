import jStat from 'jstat'

/**
 * Fisher's Exact Test (using jStat)
 * Tests association in 2x2 contingency tables
 * @param {Array} data - 2x2 contingency table [[a,b],[c,d]]
 * @param {string} alternative - 'two-sided', 'greater', 'less' (default: 'two-sided')
 * @returns {Object} Test results with p-values
 */
export default function fisherExactTest(data, alternative = 'two-sided') {
  // Validate input
  if (!Array.isArray(data) || data.length !== 2 || 
      data[0].length !== 2 || data[1].length !== 2) {
    return { error: 'Data must be a 2x2 contingency table [[a,b],[c,d]]' };
  }

  // Extract contingency table values
  const a = data[0][0];
  const b = data[0][1];
  const c = data[1][0];
  const d = data[1][1];

  // Check for non-negative integers
  if (a < 0 || b < 0 || c < 0 || d < 0) {
    return { error: 'All contingency table values must be non-negative' };
  }

  const n = a + b + c + d;
  const rowSum1 = a + b;
  const rowSum2 = c + d;
  const colSum1 = a + c;
  const colSum2 = b + d;

  // Calculate probability using hypergeometric distribution
  // P(X = a) where X ~ Hypergeometric(N, K, n)
  // N = total population, K = success states in population, n = number of draws
  const obsProb = jStat.hypgeom.pdf(a, n, colSum1, rowSum1);

  let pValue;

  if (alternative === 'two-sided') {
    // Two-tailed: sum probabilities of tables as extreme or more extreme than observed
    let pValueSum = 0;

    // Find min and max possible values for cell a
    const minA = Math.max(0, rowSum1 + colSum1 - n);
    const maxA = Math.min(rowSum1, colSum1);

    // Calculate all hypergeometric probabilities
    for (let i = minA; i <= maxA; i++) {
      const prob = jStat.hypgeom.pdf(i, n, colSum1, rowSum1);
      // Sum probabilities less than or equal to observed (two-tailed)
      if (prob <= obsProb + 1e-10) { // Add epsilon for numerical precision
        pValueSum += prob;
      }
    }
    pValue = Math.min(pValueSum, 1.0);
  } else if (alternative === 'greater') {
    // One-tailed greater: P(X >= observed)
    // This tests if cell a is larger than expected
    const minA = Math.max(0, rowSum1 + colSum1 - n);
    const maxA = Math.min(rowSum1, colSum1);

    let pValueSum = 0;
    for (let i = a; i <= maxA; i++) {
      pValueSum += jStat.hypgeom.pdf(i, n, colSum1, rowSum1);
    }
    pValue = Math.min(pValueSum, 1.0);
  } else {
    // One-tailed less: P(X <= observed)
    // This tests if cell a is smaller than expected
    const minA = Math.max(0, rowSum1 + colSum1 - n);
    
    let pValueSum = 0;
    for (let i = minA; i <= a; i++) {
      pValueSum += jStat.hypgeom.pdf(i, n, colSum1, rowSum1);
    }
    pValue = Math.min(pValueSum, 1.0);
  }

  // Calculate odds ratio for effect size
  const oddsRatio = (b === 0 || c === 0) ? null : (a * d) / (b * c);

  return {
    testType: 'Fisher\'s Exact Test',
    statistic: obsProb,
    pValue: pValue,
    oddsRatio: oddsRatio,
    alternative: alternative,
    n: n,
    a: a,
    b: b,
    c: c,
    d: d,
    rowSums: [rowSum1, rowSum2],
    colSums: [colSum1, colSum2]
  };
}

/**
 * Interpret Fisher's Exact test results
 * @param {Object} result - Fisher's Exact result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretFisherExactTest(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = isSignificant ? "indicates" : "does not indicate";
  const oddsRatioText = result.oddsRatio ? `(OR=${result.oddsRatio.toFixed(2)})` : '(OR=infinite)';
  
  return `The 2×2 contingency table shows ${isSignificant ? "a statistically significant" : "no statistically significant"} association (p=${result.pValue.toFixed(4)}), ${direction} an association between the categorical variables ${oddsRatioText}.`;
}