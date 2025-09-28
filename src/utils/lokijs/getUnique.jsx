const getUnique = (data, column = '') => {
  let obj = []

  if (typeof column == 'string') {
    obj = [...new Set(data.map((row) => row[column]))]
  }

  return obj
}

export default getUnique