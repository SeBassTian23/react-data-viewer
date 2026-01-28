import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { getColumnNames } from "../../modules/database";

dayjs.extend(isBetween);

function isTimeBetween(timeToCheck, startTime, endTime) {
  // Create dayjs objects for comparison
  const checkTime = dayjs(`2000-01-01T${timeToCheck}`);
  const start = dayjs(`2000-01-01T${startTime}`);
  const end = dayjs(`2000-01-01T${endTime}`);

  // Handle cases that cross midnight
  if (end.isBefore(start)) {
    return checkTime.isAfter(start) || checkTime.isBefore(end);
  }

  // Standard between check
  return checkTime.isAfter(start) && checkTime.isBefore(end);
}

const getFilteredData = (collection, { filters = [], thresholds = [], sortby = '', dropna = [] } = {}) => {

  // Parse filters
  let parsedFilters = {}
  let timeFilter = [];
  if (Array.isArray(filters)) {
    for (let i in filters) {
      let f = {}
      if (filters[i]?.type == 'date-time' && filters[i].values.length > 0) {
        // Find Time Format
        let t = {}
        if( filters[i].values[0].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/) )
          t.format = 'YYYY-MM-DDTHH:mm';
        else if( filters[i].values[0].match(/^\d{4}-\d{2}-\d{2}$/) )
          t.format = 'YYYY-MM-DD';
        else if( filters[i].values[0].match(/^\d{2}:\d{2}$/) )
          t.format = 'HH:mm';
        t.name = filters[i].name
        t.mode = filters[i].values.length == 1? '$in' : '$between'
        t.values = filters[i].values
        timeFilter.push(t);
        continue;
      }
      else if (filters[i].values.length > 0) {
        f = { '$in': filters[i].values }
      }
      if (parsedFilters[filters[i].name])
        parsedFilters[filters[i].name] = { ...parsedFilters[filters[i].name], ...f }
      else
        parsedFilters[filters[i].name] = f
    }
  }

  // Parse thresholds allowing for min, max and min-max
  let parsedThresholds = {}
  if (Array.isArray(thresholds)) {
    for (let j in thresholds) {
      if (!thresholds[j].isSelected)
        continue;
      let t = {}
      if (thresholds[j].min && thresholds[j].max) {
        t = { '$between': [thresholds[j].min, thresholds[j].max] }
      }
      else if (thresholds[j].min) {
        t = { '$gte': thresholds[j].min }
      }
      else if (thresholds[j].max) {
        t = { '$lte': thresholds[j].max }
      }
      if (parsedThresholds[thresholds[j].name])
        parsedThresholds[thresholds[j].name] = { ...parsedThresholds[thresholds[j].name], ...t }
      else
        parsedThresholds[thresholds[j].name] = t
    }
  }

  // Drop rows defined by null cells from selected columns
  let parsedDropna = {}

  if(typeof(dropna) === 'string'){
    dropna = [dropna]
  }

  if (Array.isArray(dropna) && dropna.length > 0) {
    parsedDropna['$and'] = []
    // Make unique list of dropna elements and remove None,
    const fields = getColumnNames(collection);
    dropna = [...new Set(dropna.filter(itm => fields.includes(itm)).filter(itm => !['$loki'].includes(itm)) )];

    for (const field of dropna) {
      parsedDropna['$and'].push({ [field]: { '$ne': null }})
      parsedDropna['$and'].push({ [field]: { '$ne': undefined }})
      parsedDropna['$and'].push({ [field]: { '$ne': NaN }})
    }
  }

  // Make sure sort has the correct type
  if (!Array.isArray(sortby) || typeof sortby != 'string')
    sortby = ''

  let query = collection.chain()
  .find(parsedFilters)
  .find(parsedThresholds)
  .find(parsedDropna)

  if(timeFilter.length > 0){
    query.where( function(obj) {
      let matching = []
      for(let i in timeFilter){
        
        let format = timeFilter[i].format
        let value = dayjs( obj[timeFilter[i].name] ).format( format );

        let start = format === 'HH:mm'? timeFilter[i].values[0] : dayjs(timeFilter[i].values[0]).format( format )
        let end = timeFilter[i].values[1] !== undefined? format === 'HH:mm'? timeFilter[i].values[1] : dayjs(timeFilter[i].values[1]).format( format ) : null

        if(timeFilter[i].mode === '$in' )
          matching.push( value === start );

        else if(timeFilter[i].mode === '$between' && format !== 'HH:mm')
          matching.push( dayjs( value ).isBetween( start , end, "days", "[]") );

        else if(timeFilter[i].mode === '$between' && format === 'HH:mm')
          matching.push( isTimeBetween( value , start, end) );

        else
          matching.push(false);
      }
      return matching.length > 0 && !matching.includes(false)
    })
  }

  return query.simplesort(sortby)
}

export default getFilteredData