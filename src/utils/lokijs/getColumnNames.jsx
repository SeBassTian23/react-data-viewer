const getColumnNames = (dataset) => {
  let arr = []
  let data = dataset.chain().data({ removeMeta: true })
  for (var i in data) {
    arr = [...new Set([...arr, ...Object.keys(data[i])])]
  }
  return arr
}

export default getColumnNames