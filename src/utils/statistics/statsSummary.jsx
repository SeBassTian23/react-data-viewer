import jStat from 'jstat'

/**
 * Summary for Array of data
 * @param {Array} data
 * @param {Number} confidenceLevel - Confidence Interval (default: 0.95)
 * @returns {Object} Summary results
 */
export default function statsSummary(data, confidenceLevel = 0.95) {
  if (Array.isArray(data) && data.length > 0){
    const mean = jStat.mean(data);

    const se = jStat.stdev(data, true) / Math.sqrt(data.length)

    let ci;
    if (data.length < 30) {
      // Use t-distribution for small samples
      const df = data.length - 1;
      const tCritical = jStat.studentt.inv((1 + confidenceLevel) / 2, df);
      ci = [
        mean - tCritical * se,
        mean + tCritical * se
      ];
    } else {
      // Use normal distribution for large samples
      const zCritical = jStat.normal.inv((1 + confidenceLevel) / 2, 0, 1);
      ci = [
        mean - zCritical * se,
        mean + zCritical * se
      ];
    }

    return {
      'size': data.length,
      'median': jStat.median(data),
      'average': mean,
      'ci': ci,
      'sd': jStat.stdev(data, true),
      'se': se,
      'min': jStat.min(data),
      'max': jStat.max(data),
      'sum': jStat.sum(data)
    }
  }
  else
    return null
}