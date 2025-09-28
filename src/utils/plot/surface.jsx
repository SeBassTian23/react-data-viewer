import { ColorGradientColorArray } from '../../components/Main/ColorGradient'
import jStat from 'jstat'

const surface = ({ input = [], mode = 'markers', colorgradient = 'Blackbody', parameters = [] } = {}) => {

  let data = []
  let layout = {
    scene: {
      xaxis: {
        title: {
          text: 'x-Axis'
        }
      },
      yaxis: {
        title: {
          text: 'y-Axis'
        }
      },
      zaxis: {
        title: {
          text: 'z-Axis'
        }
      },
      dragmode: "turntable"
    }
  }

  let scaleisVisible = true

  for (let i in input) {
    layout.scene.xaxis.title.text = parameters.find(e => e.name === input[i].xaxis)?.alias || input[i].xaxis
    layout.scene.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis
    layout.scene.zaxis.title.text = parameters.find(e => e.name === input[i].zaxis)?.alias || input[i].zaxis

    var marker = {
      "color": input[i].color,
      "line": {
        "color": input[i].color,
        "width": 1
      }
    }

    if (input[i].colorscaleaxis !== 'None') {
      marker.color = input[i].colorscale
      marker.colorscale = ColorGradientColorArray(colorgradient).map((item, idx, arr) => [(idx / (arr.length - 1)), item]) || colorgradient
      marker.showscale = scaleisVisible
      // Prevent the scale from being drawn multiple times
      if (scaleisVisible)
        scaleisVisible = false
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


    // calculate Meshgrid
    const xValues = Array(input[i].y.length).fill(input[i].x)
    const yValues = Array(input[i].x.length).fill(input[i].y)

    const zValues = [];

    data.push({
      "x": input[i].x,
      "y": input[i].y,
      "z": zValues,
      // "idx": input[i]['$loki'],
      "legendgroup": input[i].id,
      "name": input[i].name,
      // marker,
      "type": "surface",
      // "mode": mode,
      // "connectgaps": true,
      "visible": true,
      "contours": {
        "z": {
          "show": true,
          "usecolormap": true,
          "highlightcolor": "#42f462",
          "project": { z: true }
        }
      }
    })
  }

  return { data, layout }
}

export default surface
