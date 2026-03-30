/**
 * Get data for selected fields from a lokijs
 * data call.
 * @param {Array} data data as returned from the lokijs data() function
 * @param {String,Array} columns fields to get values for
 * @returns object with {field: [data,..]}
 */
const getSeries = (data = [], columns = '') => {
  let obj = {}

  if (typeof columns == 'string' && columns !== '') {
    obj[columns] = data.map((row) => row[columns])
  }

  else if (Array.isArray(columns)) {
    for (let i in columns)
      obj[columns[i]] = data.map((row) => row[columns[i]])
  }

  return obj
}

export default getSeries