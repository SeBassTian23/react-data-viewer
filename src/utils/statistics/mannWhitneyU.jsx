
import jStat from 'jstat'

/**
 * Mann-Whitney U test
 * @param {Array} x - First variable
 * @param {Array} y - Second variable
 * @param {string} alternative - 'two-sided', 'greater', 'less' (default: 'two-sided')
 * @returns {Object} Test results
 */
export default function mannWhitneyU(group1, group2, alternative) {
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
        // Find end of tied group
        while (j < combined.length - 1 && combined[j].value === combined[j + 1].value) {
            j++;
        }
        // Assign average rank to tied values
        const avgRank = (i + j + 2) / 2; // +2 because ranks start at 1
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
    
    // Calculate z-score for large samples
    const meanU = (n1 * n2) / 2;
    const stdU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
    const z = (U1 - meanU) / stdU;
    
    // Calculate p-value
    let pValue;
    if (alternative === 'two-sided') {
        pValue = 2 * (1 - jStat.normal.cdf(Math.abs(z), 0, 1));
    } else if (alternative === 'greater') {
        pValue = 1 - jStat.normal.cdf(z, 0, 1);
    } else {
        pValue = jStat.normal.cdf(z, 0, 1);
    }
    
    return {
        testType: 'Mann Whitney U Test',
        U: U,
        z: z,
        pValue: pValue,
        meanRank1: R1 / n1,
        meanRank2: R2 / n2,
        alternative
    };
}
