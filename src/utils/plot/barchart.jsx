
import jStat from 'jstat'
import tinycolor from "tinycolor2"

const barchart = ({ input = [], showas = 'mean', errorbar = 'None', categoryaxis = 'None', orientation = 'v', barmode = 'group', barnorm = "", parameters = [] } = {}) => {

  const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);

  let data = []
  let layout = {
    bargap: 0.05,
    bargroupgap: 0.1,
    xaxis: {
      title: {
        text: 'x-Axis'
      },
      visible: orientation === 'v' ? false : true
    },
    yaxis: {
      title: {
        text: 'y-Axis',
      },
      visible: orientation === 'v' ? true : false
    },
    barmode,
    barnorm

  }

  for (let i in input) {

    if (orientation === 'v')
      layout.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis

    if (orientation === 'h')
      layout.xaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis


    let err = []
    let sd = jStat.stdev(input[i].y)
    let se = jStat.stdev(input[i].y) / Math.sqrt(input[i].y.length) //jStat.meansqerr(input[i].y) // Same as jStat.stdev(avg_data, true)?
    let y = [jStat.mean(input[i].y)]

    if (showas === 'median')
      y = [jStat.median(input[i].y)]
    if (showas === 'sum')
      y = [jStat.sum(input[i].y)]

    if (errorbar === 'Standard Deviation') {
      err.push(sd)
      if (orientation === 'v')
        layout.yaxis.title.text += " (±S.D.)"
      if (orientation === 'h')
        layout.xaxis.title.text += " (±S.D.)"
    }
    if (errorbar === 'Standard Error') {
      err.push(se)
      if (orientation === 'v')
        layout.yaxis.title.text += " (±S.E.)"
      if (orientation === 'h')
        layout.xaxis.title.text += " (±S.E.)"
    }

    let axis = { "y": y }

    if (orientation === 'h') {
      axis = {
        "x": y
      }
    }

    if (categoryaxis !== 'None') {

      let categories = [...new Set(input[i].category)]
      y = []

      for (let c in categories) {
        let category_data = indexOfAll(input[i].category, categories[c]).map(item => input[i].y[item])
        if (showas === 'mean')
          y.push(jStat.mean(category_data))
        if (showas === 'median')
          y.push(jStat.median(category_data))
        if (showas === 'sum')
          y.push(jStat.sum(category_data))
        if (errorbar === 'Standard Deviation')
          err.push(jStat.stdev(category_data))

        if (errorbar === 'Standard Error')
          err.push(jStat.stdev(category_data) / Math.sqrt(indexOfAll(input[i].category, categories[c]).length))
      }

      if (orientation === 'v') {
        axis = {
          "x": categories,
          "y": y
        }
        layout.xaxis.tickangle = 45
        // layout.xaxis.tickmode = 'auto'
        // layout.xaxis.showticklabels = true
        // layout.xaxis.tickvals = categories
        layout.xaxis.title.text = parameters.find(e => e.name === categoryaxis)?.alias || categoryaxis
        // layout.xaxis.showticklabels = true
        // layout.xaxis.tickmode = 'array'
        // layout.xaxis.tickwidth = 1
        layout.xaxis.type = "category"
        layout.xaxis.visible = true
      }
      if (orientation === 'h') {
        axis = {
          "x": y,
          "y": categories
        }
        layout.yaxis.tickangle = -45
        layout.yaxis.title.text = parameters.find(e => e.name === categoryaxis)?.alias || categoryaxis
        layout.yaxis.type = "category"
        layout.yaxis.visible = true
      }
    }

    let errorOptions = {
      "error_x": {
        "type": "data",
        "array": err,
        "visible": (errorbar !== 'None' && orientation === 'h') ? true : false
      },
      "error_y": {
        "type": "data",
        "array": err,
        "visible": (errorbar !== 'None' && orientation === 'v') ? true : false
      }
    }

    data.push({
      ...axis,
      "legendgroup": input[i].id,
      "name": input[i].name,
      "marker": {
        "color": tinycolor(input[i].color).setAlpha(0.75).toString(),
        "line": {
          "color": '#000000',
          "width": 1
        }
      },
      "type": "bar",
      ...errorOptions,
      "orientation": orientation,
      "visible": true
    })
  }

  // legendgroup: seriesID,
  // name: _ProcessedData[seriesID].name,
  // marker: {
  //     color: rgb2rgba(data[seriesID].color, 0.7),
  //     line: {
  //         color: data[seriesID].color, 
  //         width: 1
  //     }
  // },

  return { data, layout }
}

export default barchart
