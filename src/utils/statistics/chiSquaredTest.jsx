import jStat from 'jstat'
import {getEffectSizeDescription} from './helpers'

/**
 * Chi-Squared Test of Independence
 * Tests association between two categorical variables
 * @param {Array} contingencyTable - 2D array where rows are categories and columns are classes
 * @param {string} alternative - Alternative hypothesis (not used, chi-squared is always two-tailed)
 * @returns {Object} Test results with chi-squared statistic and p-value
 */
export default function chiSquaredTest(contingencyTable) {
  // Validate input
  if (!Array.isArray(contingencyTable) || contingencyTable.length < 2) {
    return { error: 'Contingency table must have at least 2 rows' };
  }

  // Check all rows have same length
  const colCount = contingencyTable[0].length;
  for (let i = 0; i < contingencyTable.length; i++) {
    if (!Array.isArray(contingencyTable[i]) || contingencyTable[i].length !== colCount) {
      return { error: 'All rows in contingency table must have the same length' };
    }
    for (let j = 0; j < contingencyTable[i].length; j++) {
      if (contingencyTable[i][j] < 0) {
        return { error: 'All contingency table values must be non-negative' };
      }
    }
  }

  const rowCount = contingencyTable.length;

  // Calculate row totals
  const rowTotals = contingencyTable.map(row => jStat.sum(row));

  // Calculate column totals
  const columnTotals = [];
  for (let j = 0; j < colCount; j++) {
    let colSum = 0;
    for (let i = 0; i < rowCount; i++) {
      colSum += contingencyTable[i][j];
    }
    columnTotals.push(colSum);
  }

  // Total sample size
  const n = jStat.sum(rowTotals);

  // Calculate chi-squared statistic
  let chiSquared = 0;
  const details = []; // For detailed breakdown

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < colCount; j++) {
      const observed = contingencyTable[i][j];
      const expected = (rowTotals[i] * columnTotals[j]) / n;

      // Skip cells with expected frequency < 5 (chi-squared assumption)
      // But still include in calculation
      if (expected > 0) {
        const cellChiSquared = Math.pow(observed - expected, 2) / expected;
        chiSquared += cellChiSquared;

        details.push({
          row: i,
          column: j,
          observed: observed,
          expected: expected,
          chiSquared: cellChiSquared,
          expectedWarning: expected < 5 // Flag low expected frequencies
        });
      }
    }
  }

  // Degrees of freedom
  const df = (rowCount - 1) * (colCount - 1);

  // Calculate p-value
  const pValue = 1 - jStat.chisquare.cdf(chiSquared, df);

  // Calculate Cramér's V (effect size)
  const cramersV = Math.sqrt(chiSquared / (n * (Math.min(rowCount, colCount) - 1)));

  return {
    testType: 'Chi-Squared Test',
    statistic: chiSquared,
    pValue: pValue,
    degreesOfFreedom: df,
    sampleSize: n,
    rowCount: rowCount,
    colCount: colCount,
    rowTotals: rowTotals,
    columnTotals: columnTotals,
    effectSize: cramersV,
    details: details
  };
}

/**
 * Helper function: Format raw data into contingency table
 * Converts array of categorical values into a contingency table
 * @param {Object} data - Object where keys are row names and values are arrays of category counts
 *                        Example: { 'group1': [5, 3, 2], 'group2': [2, 4, 4] }
 * @param {Array} columns - Array of column names
 * @returns {Array} 2D contingency table
 */
export function buildContingencyTable(data, columns) {
  const contingencyTable = [];

  for (const rowKey in data) {
    const row = columns.map(col => data[rowKey][col] || 0);
    contingencyTable.push(row);
  }

  return contingencyTable;
}

/**
 * Helper function: Count occurrences from raw data
 * Converts array of values into frequency counts
 * @param {Array} values - Array of categorical values
 * @param {Array} categories - Array of possible categories
 * @returns {Object} Object with counts for each category
 */
export function countFrequencies(values, categories) {
  const counts = {};

  // Initialize all categories with 0
  categories.forEach(cat => {
    counts[cat] = 0;
  });

  // Count occurrences
  values.forEach(value => {
    if (counts.hasOwnProperty(value)) {
      counts[value]++;
    }
  });

  return counts;
}

/**
 * Interpret Chi-Squared test results
 * @param {Object} result - Chi-squared result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretChiSquaredTest(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = isSignificant ? "indicates" : "does not indicate";
  const effectSize = getEffectSizeDescription(result.effectSize, 'cramers_v');
  const warningCount = result.details.filter(d => d.expectedWarning).length;
  const warning = warningCount > 0 ? ` (Note: ${warningCount} cells have expected frequency < 5, results may be unreliable)` : '';
  
  return `The categorical variables show ${isSignificant ? "a statistically significant" : "no statistically significant"} association (χ²(${result.degreesOfFreedom})=${result.statistic.toFixed(2)}, p=${result.pValue.toFixed(4)}), ${direction} independence with a ${effectSize} effect size (V=${result.effectSize.toFixed(3)}).${warning}`;
}