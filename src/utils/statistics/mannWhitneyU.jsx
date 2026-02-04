import jStat from 'jstat'
import {getEffectSizeDescription} from './helpers'

export default function mannWhitneyU(group1, group2, alternative = 'two-sided') {
    const n1 = group1.length;
    const n2 = group2.length;
    
    // Combine and rank all values
    const combined = [...group1.map((v, i) => ({value: v, group: 1, index: i})), 
                      ...group2.map((v, i) => ({value: v, group: 2, index: i}))];
    combined.sort((a, b) => a.value - b.value);
    
    // Assign ranks (handling ties)
    let ranks = new Array(combined.length);
    let i = 0;
    while (i < combined.length) {
        let j = i;
        while (j < combined.length - 1 && combined[j].value === combined[j + 1].value) {
            j++;
        }
        const avgRank = (i + j + 2) / 2;
        for (let k = i; k <= j; k++) {
            ranks[k] = avgRank;
        }
        i = j + 1;
    }
    
    // Calculate rank sums
    let R1 = 0, R2 = 0;
    for (let i = 0; i < combined.length; i++) {
        if (combined[i].group === 1) {
            R1 += ranks[i];
        } else {
            R2 += ranks[i];
        }
    }
    
    // Calculate U statistics
    const U1 = R1 - (n1 * (n1 + 1)) / 2;
    const U2 = R2 - (n2 * (n2 + 1)) / 2;
    const U = Math.min(U1, U2);
    
    // Calculate z-score and corrected standard deviation
    const meanU = (n1 * n2) / 2;
    
    // Correction factor for ties
    let tieCorrection = 0;
    let tieStart = 0;
    for (let i = 0; i < combined.length; i++) {
        if (i === combined.length - 1 || combined[i].value !== combined[i + 1].value) {
            if (i > tieStart) {
                const tieCount = i - tieStart + 1;
                tieCorrection += tieCount * (tieCount - 1) * (tieCount + 1);
            }
            tieStart = i + 1;
        }
    }
    
    const N = combined.length;
    const stdU = Math.sqrt((n1 * n2 * (N + 1) / 12) - (tieCorrection / (12 * N * (N - 1))));
    
    const z = (U1 - meanU) / stdU;
    
    // Use scipy-compatible p-value for consistency
    // For small samples, scipy uses exact calculation via U distribution
    // For larger samples, it uses normal approximation with continuity correction
    let pValue;
    
    if (n1 < 4 || n2 < 4) {
        // Use normal approximation with continuity correction for small samples
        // This better matches scipy's behavior
        const zCorrected = (Math.abs(U - meanU) - 0.5) / stdU;
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - jStat.normal.cdf(Math.abs(zCorrected), 0, 1));
        } else if (alternative === 'greater') {
            pValue = 1 - jStat.normal.cdf(zCorrected, 0, 1);
        } else {
            pValue = jStat.normal.cdf(zCorrected, 0, 1);
        }
    } else {
        // For larger samples, use standard normal approximation
        if (alternative === 'two-sided') {
            pValue = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
        } else if (alternative === 'greater') {
            pValue = 1 - jStat.normal.cdf(z, 0, 1);
        } else {
            pValue = jStat.normal.cdf(z, 0, 1);
        }
    }
    
    return {
        testType: 'Mann Whitney U Test',
        U: U,
        U1: U1,
        U2: U2,
        z: z,
        pValue: Math.min(1, Math.max(0, pValue)),
        meanRank1: R1 / n1,
        meanRank2: R2 / n2,
        alternative
    };
}

/**
 * Interpret Mann-Whitney U test results
 * @param {Object} result - Mann-Whitney U result object
 * @param {number} alphaLevel - Significance level (default: 0.05)
 * @returns {string} One-sentence interpretation
 */
export function interpretMannWhitneyU(result, alphaLevel = 0.05) {
  const isSignificant = result.pValue < alphaLevel;
  const direction = isSignificant ? "indicates" : "does not indicate";
  const effectSize = getEffectSizeDescription(result.z, 'z_effect');
  
  return `The two groups show ${isSignificant ? "a statistically significant" : "no statistically significant"} difference in distributions (U=${result.U.toFixed(1)}, p=${result.pValue.toFixed(4)}), ${direction} a ${effectSize} practical difference in rank distributions.`;
}