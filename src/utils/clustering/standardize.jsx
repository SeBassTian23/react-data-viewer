import jStat from "jstat";

/**
 * Standardize features (z-score)
 * @param {*} data - matrix data
 * @returns matrix
 */
export default function standardize(data) {
  const d = data[0].length;
  const means = [];
  const stds = [];

  for (let j = 0; j < d; j++) {
    const col = data.map(r => r[j]);
    means[j] = jStat.mean(col);
    stds[j] = jStat.stdev(col, true) || 1;
  }

  return data.map(row =>
    row.map((v, j) => (v - means[j]) / stds[j])
  );
}


// function standardize(data) {
//   const matrix = new Matrix(data);
//   const mean = matrix.mean('column');
//   const std = matrix.standardDeviation('column');
  
//   const standardized = matrix.to2DArray().map((row, i) =>
//     row.map((val, j) => {
//       const stdVal = std[j] || 1;
//       return (val - mean[j]) / stdVal;
//     })
//   );
  
//   return standardized;
// }