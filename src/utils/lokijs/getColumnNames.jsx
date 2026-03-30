/**
 * Function generates a list of unique field names from
 * loki.js collection like db.getColection('data')
 * @param {object} dataset loki.js collection
 * @returns array with unique field names
 */
const getColumnNames = (dataset) => {
  const fields = new Set();
  const data = dataset.chain().data({ removeMeta: true })
  for (const doc of data) {
    for (const key of Object.keys(doc)) {
      fields.add(key);
    }
  }
  return [...fields];
}

export default getColumnNames