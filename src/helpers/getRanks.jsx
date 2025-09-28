/**
 * Helper function to calculate ranks with tie handling
 * @param {Array} data - Array of numbers
 * @returns {Array} Array of ranks
 */
export default function getRanks(data) {
    const indexed = data.map((value, index) => ({ value, index }));
    indexed.sort((a, b) => a.value - b.value);
    
    const ranks = new Array(data.length);
    let i = 0;
    
    while (i < indexed.length) {
        let j = i;
        while (j < indexed.length && indexed[j].value === indexed[i].value) {
            j++;
        }
        
        // Average rank for ties
        const avgRank = (i + j + 1) / 2;
        for (let k = i; k < j; k++) {
            ranks[indexed[k].index] = avgRank;
        }
        i = j;
    }
    
    return ranks;
}