import { getFilteredData, getSeries } from './database'

import histogram from '../utils/plot/histogram'
import boxplot from '../utils/plot/boxplot'
import barchart from '../utils/plot/barchart'
import violinplot from '../utils/plot/violinplot'
import histogram2d from '../utils/plot/histogram2d'
import histogram2dcontour from '../utils/plot/histogram2dcontour'
import splom from '../utils/plot/splom'
import scatter from '../utils/plot/scatter'
import scatter3d from '../utils/plot/scatter-3d'
// import surface from '../utils/plot/surface'
import line from '../utils/plot/line'
import dayjs from 'dayjs'
import plotLayout, { plotLayoutDarkmode, plotLayoutLightmode } from '../constants/plot-layout'

import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'

const buildPlot = ({ datasets = [], settings = {}, thresholds = [], parameters = [], darkmode = false } = {}) => {

  // Data Keys
  const querykeys = ['xaxis', 'yaxis', 'zaxis', 'dimensionsaxis', 'sizeaxis', 'colorscaleaxis', 'categoryaxis']
  let queryparams = []
  let queryseries = {}
  let querylabels = {}

  Object.keys(settings).forEach(item => {
    if (querykeys.includes(item)) {
      queryparams.push(settings[item])
      queryseries[item.replace('axis', '')] = settings[item]
      querylabels[item] = settings[item]
    }
  })

  // Clone datasets to make sure it is not altered
  let subsets = datasets.slice(0)
  let data = []

  if (datasets.length === 0) {
    subsets.push({
      id: 'all_data',
      name: 'All Data',
      color: '#0d6efd',
      filter: [],
      isVisible: true
    })
  }

  // Determine if meta data is needed
  let removeMeta = true
  if (['scatter', 'scatter-lines', 'splom', 'scatter3d','boxplot','violinplot'].includes(settings.plottype)) {
    removeMeta = false
  }
  for (let series in subsets) {
    // Skip series if it is invisible
    if (!subsets[series].isVisible)
      continue;

    // Query the database
    let query = getFilteredData('data', {
      filters: subsets[series].filter,
      dropna: queryparams.flat(),
      thresholds: thresholds
    }).data({ removeMeta })

    if (!removeMeta)
      queryparams.push('$loki')

    let df = getSeries(query, queryparams.flat())
    let seriesData = { ...queryseries }

    for (var i in seriesData) {
      if (Array.isArray(seriesData[i])) {
        seriesData[i] = seriesData[i].slice(0)
        for (var j in seriesData[i])
          seriesData[i][j] = df[seriesData[i][j]]
      }
      else {
        seriesData[i] = df[seriesData[i]]
      }
    }

    if (!removeMeta)
      seriesData['$loki'] = df['$loki']

    // Add data to plot
    data.push({
      ...seriesData,
      ...querylabels,
      ...{
        name: subsets[series].name,
        id: subsets[series].id,
        color: subsets[series].color
      }
    })
  }

  // Now build the data for the type of plot
  var output = { data: [], layout: {} }

  switch (settings.plottype) {
    case 'histogram':
      output = histogram({ input: data, ...settings, autobinx: true, parameters })
      break;
    case 'barchart':
      output = barchart({ input: data, ...settings, orientation: 'v', parameters })
      break;
    case 'barchart-horizontal':
      output = barchart({ input: data, ...settings, orientation: 'h', parameters })
      break;
    case 'boxplot':
      output = boxplot({ input: data, ...settings, parameters })
      break;
    case 'violinplot':
      output = violinplot({ input: data, ...settings, parameters })
      break;
    case 'histogram2d':
      output = histogram2d({ input: data, ...settings, parameters })
      break;
    case 'histogram2dcontour':
      output = histogram2dcontour({ input: data, ...settings, parameters })
      break;
    case 'splom':
      output = splom({ input: data, ...settings, parameters })
      break;
    case 'scatter':
      output = scatter({ input: data, mode: 'markers', ...settings, parameters })
      break;
    case 'scatter-lines':
      output = scatter({ input: data, mode: 'lines+markers', ...settings, parameters })
      break;
    case 'line':
      output = line({ input: data, mode: 'line', ...settings, parameters })
      break;
    case 'line-y-only':
      output = line({ input: data, mode: 'line-y-only', ...settings, parameters })
      break;
    case 'contour':
      output = scatter({ input: data, mode: 'contour', ...settings, parameters })
      break;
    // case 'surface':
    //   output = surface({ input: data, mode: 'markers', ...settings, parameters })
    //   break;
    case 'scatter3d':
      output = scatter3d({ input: data, mode: 'markers', ...settings, parameters })
      break;
    default:
      output = { data: [], layout: {} }
  }

  // Show or hide title
  if (settings?.title && settings.title !== ""){
    output.layout.title = {text: settings.title}
  }

  // Show or hide legend
  if(settings?.legend && settings.legend === "show"){
    output.layout.showlegend = true
    output.layout.legend = {
      font: {
        color: darkmode? plotLayoutDarkmode.xaxis.color : plotLayoutLightmode.xaxis.color
      }
    }
  }
  else
    output.layout.showlegend = false

  // Modebar
  output.layout.modebar = {
    bgcolor: darkmode? plotLayoutDarkmode.modebar.bgcolor : plotLayoutLightmode.modebar.bgcolor
  }

  // See if axis type needs to be modified
  parameters.forEach(e => {
    if (output.layout.xaxis && output.layout.xaxis.title && e.name === output.layout.xaxis.title.text && e.specialtype === 'date-time') {
      output.layout.xaxis.type = 'date'
      if (output.data)
        output.data = output.data.map(s => { s.x = s.x.map(v => dayjs(v).toISOString()); return s })
    }
    if (output.layout.yaxis && output.layout.yaxis.title && e.name === output.layout.yaxis.title.text && e.specialtype === 'date-time') {
      output.layout.yaxis.type = 'date'
      if (output.data)
        output.data = output.data.map(s => { s.y = s.y.map(v => dayjs(v).toISOString()); return s })
    }
  });

  // Adjust Colorbar for Colormode
  output.data = output.data.map( itm => {
    if(itm?.marker?.colorbar){
      itm.marker.colorbar.tickfont = {
        color: darkmode? plotLayoutDarkmode.xaxis.color : plotLayoutLightmode.xaxis.color
      }
      if(itm.marker.colorbar?.title.font){
        itm.marker.colorbar.title.font.color = darkmode? plotLayoutDarkmode.xaxis.color : plotLayoutLightmode.xaxis.color
      }
    }
    if(itm?.colorbar){
      itm.colorbar.tickfont = {
        color: darkmode? plotLayoutDarkmode.xaxis.color : plotLayoutLightmode.xaxis.color
      }
    }
    if(itm?.marker?.line?.color && ['barchart-horizontal', 'barchart'].indexOf(settings.plottype) > -1)
      itm.marker.line.color = darkmode? plotLayoutDarkmode.xaxis.color : plotLayoutLightmode.xaxis.color
    return itm
  });

  // Generate layout for extra axis
  output.layout.xaxis = merge(output.layout.xaxis, darkmode? plotLayoutDarkmode.xaxis : plotLayoutLightmode.xaxis);
  output.layout.yaxis = merge(output.layout.yaxis, darkmode? plotLayoutDarkmode.yaxis : plotLayoutLightmode.yaxis);

  if(settings.plottype === 'histogram2dcontour'){
    output.layout.xaxis2 = {...output.layout.xaxis2, ...darkmode? plotLayoutDarkmode.xaxis : plotLayoutLightmode.xaxis };
    output.layout.yaxis2 = {...output.layout.yaxis2, ...darkmode? plotLayoutDarkmode.yaxis : plotLayoutLightmode.yaxis };
  }
  if(settings.plottype === 'splom'){
    let axes = settings.dimensionsaxis.length + 1 || 0
    for(let i=2; i<axes; i++ ){
      output.layout[`xaxis${i}`] = darkmode? plotLayoutDarkmode.xaxis : plotLayoutLightmode.xaxis;
      output.layout[`yaxis${i}`] = darkmode? plotLayoutDarkmode.yaxis : plotLayoutLightmode.yaxis;
    }
  }
  if(settings.plottype === 'scatter3d'){
    output.layout.scene.xaxis = merge(output.layout.scene.xaxis, darkmode? plotLayoutDarkmode.xaxis : plotLayoutLightmode.xaxis);
    output.layout.scene.yaxis = merge(output.layout.scene.yaxis, darkmode? plotLayoutDarkmode.yaxis : plotLayoutLightmode.yaxis);
    output.layout.scene.zaxis = merge(output.layout.scene.zaxis, darkmode? plotLayoutDarkmode.yaxis : plotLayoutLightmode.yaxis);
  }

  return { data: output.data, layout: merge(cloneDeep(plotLayout), output.layout) }

}

export default buildPlot