/**
 * Generate id for jupyter notebook cells
 */
export default function cellId() {
  return Math.random().toString(16).slice(2, 10);
}