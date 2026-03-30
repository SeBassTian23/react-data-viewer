/**
 * Get unique values from a list of objects defining
 * a specific key (column)
 * @param {Array} data dataset
 * @param {String} column Column Name
 * @returns returns unique array of values
 */
const getUnique = (data, column = '') => {
  if (typeof column !== 'string') return [];
  return [...new Set(data.map(row => row[column]))];
};

export default getUnique