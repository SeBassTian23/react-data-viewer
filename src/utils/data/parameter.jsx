import countTypes from '../../utils/data/countTypes'
import getSpecialStringType from '../../utils/data/getSpecialStringType'
import getUnique from '../lokijs/getUnique';

import {parameterObject} from '../../constants/parameter-object'

import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'

dayjs.extend(minMax)

/**
 * Initalize Paramter Object for redux state
 * @param {object} data - Loki collection
 * @param {string} name - parameter name (object key)
 * @returns Paramter object descibing parameter
 */
export default function initParameter(data, name) {

  let col = getUnique(data, name).filter(el => (el !== null && el !== undefined)) || [];

  let typesMap = countTypes(col)
  let typesObj = Object.fromEntries(typesMap)

  let parameter = {...parameterObject, ...{ 'id': crypto.randomUUID(), 'name': name } }

  if (typesMap.size === 1) {
    parameter.type = Object.keys(typesObj)[0]

    parameter.isFilter = (parameter.type === 'string')

    // Now check again, if it might be a special type
    if (parameter.type === 'string') {
      let specialType = getSpecialStringType(col)
      if (specialType.length === 1 && specialType[0] !== parameter.type) {
        parameter.specialtype = specialType[0]
      }
    }
    if (parameter.type === 'number' && parameter.name.match(/^\s?(latitude|lat)\s?/i))
      parameter.specialtype = 'latitude'
    if (parameter.type === 'number' && parameter.name.match(/^\s?(longitude|lng)\s?/i))
      parameter.specialtype = 'longitude'
    if (parameter.type === 'number' && parameter.name.match(/^\s?(time)\s?$/i)) {
      parameter.specialtype = 'date-time'
      parameter.isFilter = true
    }

    // Now add the filter data
    parameter.filterData = getFilterData(col, parameter.specialtype || parameter.type );
  }

  return parameter
}

/**
 * Update the parameter object. It also sanitizes the parameter description
 * using the initial object to ensure the parameter has the currently
 * required fields
 * @param {object} parameter - the current parameter object
 * @param {*} payload - the payload with object changes
 * @returns new parameter object
 */
export function updateParameter(parameter, payload) {
  return {...parameterObject, ...parameter, ...payload};
}

/**
 * 
 * @param {Array} data - Unique set of data
 * @param {*} type - data-type 
 * @returns object describing the filter
 */
export function getFilterData(data, type) {

  if (type === 'string')
    return {
      unique: data || []
    }
  
  if(type === 'date-time')
    return {
      min: dayjs.min(data.map(e => dayjs(e))).toISOString() || null,
      max: dayjs.max(data.map(e => dayjs(e))).toISOString() || null,
    }

  if(type === 'number')
    return {
      min: Math.min(...data) || null,
      max: Math.max(...data) || null
    }

  return null
}