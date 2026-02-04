import jStat from 'jstat'
import {getEffectSizeDescription} from './helpers'

/**
 * Kruskal-Wallis Test
 * Non-parametric test for comparing multiple groups
 * @param {Array} groups - Array of arrays, each containing data for one group
 * @returns {Object} Test results with H statistic, p-value, and degrees of freedom
 */
export default function kruskalWallisTest(groups) {
    if (groups.length < 2) {
      return{error: 'Need at least 2 groups for Kruskal-Wallis test'};
    }
    
    // Combine all data and track group membership
    const allData = [];
    const groupSizes = [];
    
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].length === 0) {
          return {error: `Group ${i} is empty`};
        }
        groupSizes.push(groups[i].length);
        for (let j = 0; j < groups[i].length; j++) {
            allData.push({ value: groups[i][j], group: i });
        }
    }
    
    const N = allData.length;
    
    // Sort combined data and assign ranks
    allData.sort((a, b) => a.value - b.value);
    const ranks = new Array(N);
    
    // Handle ties by assigning average ranks
    let i = 0;
    while (i < N) {
        let j = i;
        while (j < N && allData[j].value === allData[i].value) {
            j++;
        }
        const avgRank = (i + j + 1) / 2;
        for (let k = i; k < j; k++) {
            ranks[k] = avgRank;
        }
        i = j;
    }
    
    // Calculate rank sums for each group
    const rankSums = new Array(groups.length).fill(0);
    for (let i = 0; i < N; i++) {
        rankSums[allData[i].group] += ranks[i];
    }
    
    // Calculate H statistic
    let H = 0;
    for (let i = 0; i < groups.length; i++) {
        const ni = groupSizes[i];
        const Ri = rankSums[i];
        H += (Ri * Ri) / ni;
    }
    H = (12 / (N * (N + 1))) * H - 3 * (N + 1);
    
    // Degrees of freedom
    const df = groups.length - 1;
    
    // P-value using chi-squared distribution
    const pValue = 1 - jStat.chisquare.cdf(H, df);
    
    // Effect size (eta-squared approximation)
    const etaSquared = (H - df) / (N - 1);
    
    return {
        testType: 'Kruskal Wallis Test',
        statistic: H,
        pValue: pValue,
        degreesOfFreedom: df,
        effectSize: Math.max(0, etaSquared),
        groupSizes: groupSizes
    };
}


/**
 * Interpret Kruskal-Wallis test results
 * @param {Object} result - Kruskal-Wallis result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretKruskalWallis(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = isSignificant ? "suggests" : "does not suggest";
  const effectSize = getEffectSizeDescription(result.effectSize, 'epsilon_squared');
  
  return `The ${result.groupSizes.length} groups show ${isSignificant ? "statistically significant" : "no statistically significant"} differences in distributions (H(${result.degreesOfFreedom})=${result.statistic.toFixed(2)}, p=${result.pValue.toFixed(4)}), ${direction} a ${effectSize} practical difference (ε²=${result.effectSize.toFixed(4)}).`;
}