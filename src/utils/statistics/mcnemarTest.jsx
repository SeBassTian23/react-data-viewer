
import jStat from 'jstat'

/**
 * McNemar's Test
 * Test for paired categorical data (2x2 contingency table)
 * @param {Array} contingencyTable - 2x2 array [[a,b],[c,d]]
 * @param {boolean} continuityCorrection - Apply continuity correction
 * @returns {Object} Test results with chi-squared statistic and p-value
 */
export default function mcnemarTest(contingencyTable, continuityCorrection = true) {
    if (contingencyTable.length !== 2 || contingencyTable[0].length !== 2 || contingencyTable[1].length !== 2) {
        throw new Error('Contingency table must be 2x2');
    }
    
    const a = contingencyTable[0][0];
    const b = contingencyTable[0][1];
    const c = contingencyTable[1][0];
    const d = contingencyTable[1][1];
    
    // Check that all values are non-negative integers
    if (a < 0 || b < 0 || c < 0 || d < 0) {
        throw new Error('All cell counts must be non-negative');
    }
    
    // McNemar's test focuses on the discordant pairs (b and c)
    const discordant = b + c;
    
    if (discordant === 0) {
        return {
            statistic: 0,
            pValue: 1.0,
            method: 'McNemar Test',
            discordantPairs: discordant,
            continuityCorrection: continuityCorrection
        };
    }
    
    let chiSquared;
    let method = 'McNemar Test';
    
    // For small samples (discordant < 25), exact test is preferred
    if (discordant < 25) {
        // Exact binomial test
        const pExact = 2 * Math.min(
            jStat.binomial.cdf(Math.min(b, c), discordant, 0.5),
            1 - jStat.binomial.cdf(Math.min(b, c) - 1, discordant, 0.5)
        );
        
        return {
            statistic: Math.min(b, c),
            pValue: Math.min(1, pExact),
            method: 'McNemar Exact Test',
            discordantPairs: discordant,
            continuityCorrection: false
        };
    }
    
    // For larger samples, use chi-squared approximation
    if (continuityCorrection) {
        chiSquared = Math.pow(Math.abs(b - c) - 1, 2) / (b + c);
        method = 'McNemar Test (with continuity correction)';
    } else {
        chiSquared = Math.pow(b - c, 2) / (b + c);
        method = 'McNemar Test (without continuity correction)';
    }
    
    // P-value from chi-squared distribution with 1 df
    const pValue = 1 - jStat.chisquare.cdf(chiSquared, 1);
    
    // Odds ratio for effect size
    const oddsRatio = b > 0 && c > 0 ? b / c : null;
    
    return {
        statistic: chiSquared,
        pValue: pValue,
        method: method,
        discordantPairs: discordant,
        continuityCorrection: continuityCorrection,
        oddsRatio: oddsRatio
    };
}
