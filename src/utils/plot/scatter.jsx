import { ColorGradientColorArray } from '../../components/Main/ColorGradient'
import jStat from 'jstat'

const scatter = ({ input = [], mode = 'markers', gradient = 'Blackbody', shape = 'linear', dash = 'solid', parameters = [] } = {}) => {

  let data = []
  let layout = {
    xaxis: {
      title: {
        text: 'x-Axis'
      }
    },
    yaxis: {
      title: {
        text: 'y-Axis'
      }
    }
  }

  let scaleisVisible = true

  for (let i in input) {
    layout.xaxis.title.text = parameters.find(e => e.name === input[i].xaxis)?.alias || input[i].xaxis
    layout.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis

    var marker = {
      "color": input[i].color,
      "line": {
        "color": input[i].color,
        "width": 0.75
      }
    }

    if (input[i].sizeaxis !== 'None') {
      marker.size = input[i].size
      marker.sizeref = (jStat.max(input.map((item) => item.size).flat()) / 50) || 1
      marker.min = 3
      marker.sizemode = "diameter"
    }

    if (input[i].colorscaleaxis !== 'None') {
      marker.color = input[i].colorscale
      marker.colorscale = ColorGradientColorArray(gradient).map((item, idx, arr) => [(idx / (arr.length - 1)), item]) || gradient
      marker.showscale = scaleisVisible
      // Prevent the scale from being drawn multiple times
      // if(scaleisVisible)
      //   scaleisVisible = false
      marker.colorbar = {
        "thickness": 20,
        "title": {
          "text": parameters.find(e => e.name === input[i].colorscaleaxis)?.alias || input[i].colorscaleaxis,
          "font": {
            "size": 14
          },
          "side": "right"
        }
      }
      marker.cmax = jStat.max(input.map((item) => item.colorscale).flat())
      marker.cmin = jStat.min(input.map((item) => item.colorscale).flat())
      marker.cauto = false
    }

    data.push({
      "x": input[i].x,
      "y": input[i].y,
      "idx": input[i]['$loki'],
      "legendgroup": input[i].id,
      "name": input[i].name,
      marker,
      "type": "scattergl",
      "mode": mode,
      "line": {
        "color": input[i].color,
        "width": 1.5,
        "shape": shape,
        // "smoothing": 1,
        "dash": dash
      },
      "connectgaps": true,
      "visible": true
    })
  }

  return { data, layout }
}

export default scatter
