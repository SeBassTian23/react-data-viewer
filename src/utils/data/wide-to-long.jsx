const wideToLong = (wideData) => {
  // Initialize array for long format data
  const longData = [];
  
  // Get headers (first row of data)
  const headers = Object.keys(wideData[0]);
  
  // First column is usually the independent variable
  const independentVar = headers[0];
  
  // Remaining columns
  const columns = headers.slice(1);
  
  // Convert each row
  wideData.forEach(row => {
      // For each column
      columns.forEach(column => {
          longData.push({
              [independentVar]: row[independentVar],
              column: column,
              values: row[column]
          });
      });
  });
  
  return longData;
}

export default wideToLong;