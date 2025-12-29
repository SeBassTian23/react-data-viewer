const getUnique = (data, column = '') => {
  if (typeof column !== 'string') return [];
  return [...new Set(data.map(row => row[column]))];
};

export default getUnique