import { ColorGradientColorArray } from '../../components/Main/ColorGradient'


const histogram2dcontour = ({ input = [], colorscale = 'Viridis', coloring = 'lines', showlabels = false, showHistograms = true, showMarkers = true, parameters = [] } = {}) => {

  if (showlabels === true || showlabels === "true")
    showlabels = true

  if (showlabels === false || showlabels === "false")
    showlabels = false

  if (showHistograms === true || showHistograms === "true")
    showHistograms = true

  if (showHistograms === false || showHistograms === "false")
    showHistograms = false

  if (showMarkers === true || showMarkers === "true")
    showMarkers = true

  if (showMarkers === false || showMarkers === "false")
    showMarkers = false

  let data = []
  let histogram = {}
  let layout = {
    xaxis: {
      title: {
        text: 'x-Axis'
      },
      domain: showHistograms ? [0, 0.85] : [0, 1]
    },
    yaxis: {
      title: {
        text: 'y-Axis'
      },
      domain: showHistograms ? [0, 0.85] : [0, 1]
    },
    xaxis2: {
      autorange: true,
      domain: [0.85, 1],
      showgrid: false,
      title: { text: 'Count' },
      zeroline: false,
    },
    yaxis2: {
      autorange: true,
      domain: [0.85, 1],
      showgrid: false,
      title: { text: 'Count' },
      zeroline: false,
    }

  }

  for (let i in input) {
    layout.xaxis.title.text = parameters.find(e => e.name === input[i].xaxis)?.alias || input[i].xaxis
    layout.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis

    data.push({
      "x": input[i].x,
      "y": input[i].y,
      "legendgroup": input[i].id,
      "name": input[i].name,
      "marker": {
        "size": 3.5,
        "color": showMarkers ? input[i].color : 'rgba(0,0,0,0)'
      },
      "mode": "markers",
      "type": "scatter",
      "connectgaps": true,
      "showscale": false,
      "visible": true
    })

    if (i === "0") {
      histogram.x = input[i].x
      histogram.y = input[i].y
    }
    else {
      histogram.x = [...histogram.x, ...input[i].x]
      histogram.y = [...histogram.y, ...input[i].y]
    }
  }

  data.push({
    "x": histogram.x,
    "y": histogram.y,
    "name": "density",
    "hoverinfo": "none",
    "autocontour": false,
    "ncontours": 20,
    "contours": {
      "coloring": coloring,
      "showlines": false,
      "showlabels": showlabels,
      "start": 5,
      "end": 75,
      "size": 5
    },
    "line": {
      "opacity": 1,
      "width": 1.5
    },
    "opacity": showMarkers? .5 : 1,
    "colorscale": ColorGradientColorArray(colorscale).map((item, idx, arr) => [(idx / (arr.length - 1)), item]) || colorscale,
    "reversescale": false,
    "showscale": true,
    "type": "histogram2dcontour",
    "colorbar": {
      "thickness": 20
    }
  })

  if (showHistograms) {

    data.push({
      "x": histogram.x,
      "name": layout.xaxis.title.text,
      "hoverinfo": "y+name",
      "marker": {
        "color": "rgba(153, 153, 153, .7)",
        "line": {
          "color": "rgba(153, 153, 153, 1)",
          "width": 1
        }
      },
      "yaxis": "y2",
      "type": "histogram"
    })

    data.push({
      "y": histogram.y,
      "name": layout.yaxis.title.text,
      "hoverinfo": "x+name",
      "marker": {
        "color": "rgba(153, 153, 153, .7)",
        "line": {
          "color": "rgba(153, 153, 153, 1)",
          "width": 1
        }
      },
      "xaxis": "x2",
      "type": "histogram"
    })
  }

  return { data, layout }
}

export default histogram2dcontour