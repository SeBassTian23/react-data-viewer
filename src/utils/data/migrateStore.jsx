import { parameters, getFilteredData } from "../../modules/database"
import { getFilterData } from "./parameter";
import getUnique from '../lokijs/getUnique';

/**
 * When importing an analysis, run this migration
 * function on the Redux state, to make sure all
 * states are matching the latest version
 * @param {*} store Redux state object
 */
export default function migrateStore(store) {
  
  // If not parameters exist, new ones are generated
  if(!Object.hasOwn(store, 'parameters') || 
    !Array.isArray(store.parameters) || 
    store.parameters.length === 0 ||
    store.parameters.some( obj => !Object.hasOwn(obj, 'id') || !Object.hasOwn(obj, 'name') ) || 
    store.parameters.some( obj => !String(obj.id).match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) ||
    store.parameters.some( obj => typeof(obj.name) !== 'string' )
  ){
    console.log('New Parameters definitions need to be build.')
    store.parameters = parameters();
    return store;
  }

  // Now check the Parameters
  for(let p in store.parameters){
    
    let obj = store.parameters[p];

    // If no alias key exists or it's value is not a string
    if(!Object.hasOwn(obj, 'alias') || typeof(obj.alias) !== 'string')
      obj.alias = null

    if(!Object.hasOwn(obj, 'type'))
      obj.type = null

    if(!Object.hasOwn(obj, 'specialtype'))
      obj.specialtype = null

    if(!Object.hasOwn(obj, 'isFilter'))
      obj.isFilter = null

    // By default set the isSelected to true
    if(!Object.hasOwn(obj, 'isSelected'))
      obj.isSelected = true

    if(!Object.hasOwn(obj, 'filterData')){
      // Get data to check parameters
      const query = getFilteredData('data', { filters: [], dropna: [obj.name], sortby: obj.name })
      const col = getUnique(query.data({ removeMeta: true }), obj.name)
      obj.filterData = getFilterData(col, obj.specialtype || obj.type)
    }
  }

  return store
}
