import { getFilteredData, getSeries } from './database'

import chroma from 'chroma-js'
import jStat from 'jstat'
import { ColorGradientColorArray } from '../components/Main/ColorGradient'
import dayjs from 'dayjs'

const buildGeoJSON = ({ datasets = [], thresholds = [], parameters = [], valueType = null, colorBy = null, colorScale = 'Viridis', colorRange = null } = {}) => {

  let data = []
  let colors = []
  let colNames = {}
  let cols = parameters.filter(item => ['latitude', 'longitude'].includes(item.specialtype)).map(item => {
    colNames[item.specialtype] = item.name
    return item.name
  });

  if (colorBy)
    cols.push(colorBy)

  cols.push('$loki')

  let thresholdsCopy = [...thresholds]

  // TODO: Check if this will consistently overwrite existing thresholds
  if (colorRange && colorBy) {
    thresholdsCopy.unshift({
      isSelected: true,
      max: colorRange[1],
      min: colorRange[0],
      name: colorBy
    });
  }

  if (datasets.length === 0) {
    data = getFilteredData('data', { thresholds: thresholdsCopy, dropna: cols }).data({ removeMeta: false })
    colors = Array(data.length).fill('#ff0000')
  }

  if (datasets.length > 0) {
    for (let series in datasets) {
      if (!datasets[series].isVisible)
        continue;
      let query = getFilteredData('data', { filters: datasets[series].filter, thresholds: thresholdsCopy, dropna: cols })
      data = [...data, ...query.data({ removeMeta: false })]
      colors = [...colors, ...Array(query.data().length).fill(datasets[series].color)]
    }
  }

  let latlng = getSeries(data, cols)

  let geoJSON = {
    "type": "FeatureCollection",
    "features": []
  }

  if (colorBy) {

    let scale = ColorGradientColorArray(colorScale)

    if(valueType === 'date-time')
      latlng[colorBy] = latlng[colorBy].map( itm => dayjs(itm).valueOf() )

    let f = chroma.scale(scale).domain([jStat(latlng[colorBy]).min(), jStat(latlng[colorBy]).max()]);
    // rerender colors
    colors = []
    latlng[colorBy].forEach(item => {
      colors.push(f(item).hex())
    });
  }

  if (Object.keys(latlng).some(i => Object.values(colNames).includes(i)))
    geoJSON.features = latlng[colNames['latitude']].map((row, idx) => {
      return {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            latlng[colNames['longitude']][idx],
            row,
          ]
        },
        "properties": {
          fillColor: colors[idx],
          color: "#000",
          $loki: latlng['$loki'][idx],
          coloredby: colorBy,
          colorValue: colorBy ? latlng[colorBy][idx] : null
        }
      }
    }) || []

  return geoJSON
}

export default buildGeoJSON
