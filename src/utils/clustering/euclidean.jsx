/**
 * Euclidean distance
 * @param {*} p - first vector
 * @param {*} q - second vector
 * @returns euclidean distance
 */
export default function euclidean(p, q) {
  let sum = 0;
  for (let i = 0; i < p.length; i++) {
    const d = p[i] - q[i];
    sum += d**2;
  }
  return Math.sqrt(sum);
}