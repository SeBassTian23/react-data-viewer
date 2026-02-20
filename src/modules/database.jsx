import loki from 'lokijs'
import isNumber from 'is-number'

import getSeries from '../utils/lokijs/getSeries'
import getFilteredDataExt from '../utils/lokijs/getFilteredData'
import getUnique from '../utils/lokijs/getUnique'
import getColumnNames from '../utils/lokijs/getColumnNames'

import initParameter from '../utils/data/parameter'

import opfsLokiAdapter from '../utils/lokijs/opfsLokiAdapter'

const db = new loki('loki.db', {
  autosave: false,
  autoload: false,
  adapter: new opfsLokiAdapter(),
  autosaveInterval: 5000
});

window.db = db;

export const addCollection = (collection = null) => {
  if (collection)
    return db.addCollection(collection);
  return null;
}

export const hasCollection = (collection = null) => {
  if (collection)
    return db.getCollection(collection)? true : false;
  return false;
}

export const removeAllData = (collection = 'data') => {
  let dataset = db.getCollection(collection)
  dataset.removeDataOnly()
}

export const addDataJSON = async (data, append = false, collection = 'data') => {
  if (!Array.isArray(data))
    return { success: false, message: 'Import failed, the given JSON needs to be an array of Objects' }

  data = data.map(el => {
    for (var i in el) {
      if (isNumber(el[i]))
        el[i] = Number(el[i])
      else if (el[i] === '' || el[i] === 'null')
        el[i] = null
    }
    return el
  })

  try {
    let dataset = db.getCollection(collection);

    if (!append)
      resetCollection();
    dataset.insert(data);
  }
  catch (err) {
    return { success: false, message: `Import failed, ${err.message}` }
  }
  return { success: true, message: 'Import successfull' }
}

export const addDocument = async (document = null, collection = 'data') => {

  if (!document)
    return { success: false, message: 'No doc provided' }

  db.getCollection(collection).insert(document);
  return { success: true, message: 'Doc added successfully' }
}

export const removeDocByID = async (id = null, collection = 'data') => {

  if (!id)
    return { success: false, message: 'No id provided' }

  db.getCollection(collection).findAndRemove({ '$loki': { '$eq': id } })
  return { success: true, message: 'Doc removed successfully' }
}

export const removeDocByField = async (field, search, collection = 'data') => {

  if (!search || !field)
    return { success: false, message: 'No search of field provided' }

  let q = {}
  q[field] = search

  db.getCollection(collection).findAndRemove(q)
  return { success: true, message: 'Doc removed successfully' }
}

export const updateDocByField = async (field, search, payload, collection = 'data') => {

  if (!search || !field)
    return { success: false, message: 'No search of field provided' }

  if (!payload)
    return { success: false, message: 'No payload provided' }

  let q = {}
  q[field] = search

  db.getCollection(collection).findAndUpdate(q, (obj) => {
    for (let key in payload)
      obj[key] = payload[key]
    return obj
  })

  return { success: true, message: 'Doc removed successfully' }
}

export const resetCollection = (collection = 'data') => {
  let dataset = db.getCollection(collection)
  dataset.removeDataOnly()
}

export const parameters = (collection = 'data') => {

  let dataset = db.getCollection(collection)

  return getColumnNames(dataset).sort((a, b) => a.localeCompare(b)).map((el) => {
    return initParameter(dataset.data, el)
  })
}

/**
 * Count number of elements in a collection
 * 
 * @param {string} collection collection name
 */
export const getDatasetCount = (collection = 'data') => {
  return db.getCollection(collection).chain().count();
}

/**
 * Import Database from JSON
 * 
 * @param {string} data database JSON
 */
export const importJSON = (data = []) => {
  return db.loadJSON(data);
}

/**
 * Add collections to database
 */
export const dbInit = () => {
  const collections = ['data', 'bookmarks'];
  collections.forEach(itm => {
    if (!db.getCollection(itm))
      addCollection(itm);
  });
}

/**
 * Export database to JSON
 */
export const exportJSON = () => {
  return db.toJson() || null;
}

export const getSingleDatumByID = (datumID, collection = 'data', removeMeta = true) => {
  let query = db.getCollection(collection).chain()
    .find({ '$loki': { '$eq': datumID } }).data({ removeMeta })
  if (query.length == 1)
    return query[0];
  return null;
}

export const getSingleDatumByField = (search = null, field = null, collection = 'data', removeMeta = true) => {

  if (!search || !field)
    return null;

  let q = {}
  q[field] = { '$eq': search }
  let query = db.getCollection(collection).chain()
    .find(q).data({ removeMeta })
  if (query.length == 1)
    return query[0];
  return null
}

const getFilteredData = (collection = 'data', { filters = [], thresholds = [], sortby = '', dropna = [] } = {}) => {
  return getFilteredDataExt(db.getCollection(collection), { filters, thresholds, sortby, dropna })
}

const isDirty = () => {
  const collectionNames = db.listCollections().map(c => c.name);
  return collectionNames.filter(name => db.getCollection(name).dirty).length > 0
}

const getFilename = () => {
  return db.filename;
}

const setFilename = (filename) => {
  db.filename = filename;
}

const resetFilename = () => {
  db.filename = 'loki.db';
}

const saveDatabase = () => {
  if(db.filename !== 'loki.db')
    db.saveDatabase()
}
const loadDatabase = () => db.loadDatabase()
const deleteDatabase = () => db.deleteDatabase()

// Export functions, so they are all available through database
export { getSeries }
export { getFilteredData }
export { getUnique }
export { getColumnNames }
export { isDirty }
export { setFilename }
export { resetFilename }
export { saveDatabase }
export { getFilename }
