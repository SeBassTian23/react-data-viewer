
import jStat from 'jstat'

/**
 * Bernard's Exact test
 * @param {Array} a - Total in group 1
 * @param {Array} b - Total in group 2
 * @param {Array} c - Successes in group 1
 * @param {Array} d - Successes in group 2
 * @param {boolean} fastMode - (default: 'false')
 * @returns {Object} Test results
 */
export default function barnardsExact(a, b, c, d, fastMode = false) {
  const n1 = a + c; // Total in group 1
  const n2 = b + d; // Total in group 2
  const x1 = a;     // Successes in group 1
  const x2 = b;     // Successes in group 2

  if (n1 === 0 || n2 === 0) {
    throw new Error('Both groups must have at least one observation');
  }

  const p1 = x1 / n1; // Sample proportion 1
  const p2 = x2 / n2; // Sample proportion 2

  // Test statistic (difference in proportions)
  const testStat = Math.abs(p1 - p2);

  // Choose optimization level based on sample size and mode
  const totalN = n1 + n2;
  let steps, useApproximation = false, useChiSquareApprox = false;
  let methodUsed = 'Exact';

  if (totalN > 200) {
    // Very large datasets: use chi-square approximation
    steps = 10;
    useApproximation = true;
    useChiSquareApprox = true;
    methodUsed = `Chi-square approximation (n=${totalN})`;
  } else if (fastMode || totalN > 100) {
    // Large datasets: aggressive optimization
    steps = Math.min(30, Math.max(15, Math.floor(totalN / 10)));
    useApproximation = true;
    methodUsed = fastMode ? 'Fast Mode (user selected)' : `Auto-optimized (n=${totalN}, normal approximation)`;
  } else if (totalN > 50) {
    // Medium datasets: moderate optimization
    steps = Math.min(50, Math.max(20, Math.floor(totalN / 5)));
    useApproximation = totalN > 80;
    methodUsed = useApproximation ? `Optimized (n=${totalN}, with approximation)` : `Optimized (n=${totalN}, reduced steps)`;
  } else {
    // Small datasets: full precision
    steps = 100;
    methodUsed = 'Exact';
  }

  // Barnard's test: maximize over all possible values of nuisance parameter
  let minPValue = 1;
  const pooledP = (x1 + x2) / (n1 + n2); // Start search near pooled proportion

  // For very large datasets, use chi-square approximation
  if (useChiSquareApprox) {
    // Chi-square test for independence (much faster approximation)
    const expected_a = (n1 * (x1 + x2)) / (n1 + n2);
    const expected_b = (n2 * (x1 + x2)) / (n1 + n2);
    const expected_c = (n1 * (c + d)) / (n1 + n2);
    const expected_d = (n2 * (c + d)) / (n1 + n2);

    const chiSquare = Math.pow(a - expected_a, 2) / expected_a +
      Math.pow(b - expected_b, 2) / expected_b +
      Math.pow(c - expected_c, 2) / expected_c +
      Math.pow(d - expected_d, 2) / expected_d;

    minPValue = 1 - jStat.chisquare.cdf(chiSquare, 1);
  } else {
    // Standard Barnard's test with optimizations
    const searchRanges = [
      { start: Math.max(0.01, pooledP - 0.2), end: Math.min(0.99, pooledP + 0.2), steps: Math.floor(steps * 0.8) },
      { start: 0.01, end: 0.99, steps: Math.floor(steps * 0.2) }
    ];

    for (const range of searchRanges) {
      const stepSize = (range.end - range.start) / range.steps;

      for (let i = 0; i <= range.steps; i++) {
        const p = range.start + i * stepSize;

        if (p <= 0 || p >= 1) continue;

        let pValue = 0;

        if (useApproximation && (n1 > 20 && n2 > 20)) {
          // Normal approximation for large samples
          pValue = calculatePValueApprox(n1, n2, x1, x2, p, testStat);
        } else {
          // Exact calculation with optimizations
          pValue = calculatePValueExact(n1, n2, x1, x2, p, testStat);
        }

        minPValue = Math.min(minPValue, pValue);

        // Early termination if p-value is very small
        if (minPValue < 1e-10) break;
      }

      if (minPValue < 1e-10) break;
    }
  }

  // Additional statistics
  const pooledProp = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(pooledProp * (1 - pooledProp) * (1 / n1 + 1 / n2));
  const z = (p1 - p2) / se;

  return {
    pValue: minPValue,
    testStatistic: testStat,
    p1: p1,
    p2: p2,
    difference: p1 - p2,
    zScore: z,
    pooledProportion: pooledProp,
    standardError: se,
    calculationMethod: methodUsed
  };
}

function calculatePValueExact(n1, n2, x1, x2, p, testStat) {
  let pValue = 0;

  // Pre-calculate some values to avoid repeated computation
  const logP = Math.log(p);
  const log1MinusP = Math.log(1 - p);

  // Cache for binomial coefficients and probabilities
  const binomCache = new Map();

  function getCachedBinomProb(k, n, prob) {
    const key = `${k},${n},${prob}`;
    if (!binomCache.has(key)) {
      binomCache.set(key, jStat.binomial.pdf(k, n, prob));
    }
    return binomCache.get(key);
  }

  for (let k1 = 0; k1 <= n1; k1++) {
    const prop1 = k1 / n1;

    for (let k2 = 0; k2 <= n2; k2++) {
      const prop2 = k2 / n2;
      const currentStat = Math.abs(prop1 - prop2);

      // If current statistic is at least as extreme
      if (currentStat >= testStat - 1e-10) {
        // Use cached probabilities
        const prob1 = getCachedBinomProb(k1, n1, p);
        const prob2 = getCachedBinomProb(k2, n2, p);
        pValue += prob1 * prob2;
      }
    }
  }

  return pValue;
}

function calculatePValueApprox(n1, n2, x1, x2, p, testStat) {
  // Normal approximation for large samples
  // Under null hypothesis with common probability p:
  // Difference in proportions ~ N(0, sqrt(p(1-p)(1/n1 + 1/n2)))

  const variance = p * (1 - p) * (1 / n1 + 1 / n2);
  const sd = Math.sqrt(variance);

  if (sd === 0) return 0;

  // Standardized test statistic
  const z = testStat / sd;

  // Two-tailed p-value using normal approximation
  return 2 * (1 - jStat.normal.cdf(z, 0, 1));
}