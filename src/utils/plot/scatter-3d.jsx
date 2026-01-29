import { ColorGradientColorArray } from '../../components/Main/ColorGradient'
import jStat from 'jstat'

const scatter3d = ({ input = [], mode = 'markers', gradient = 'Viridis', camera = null, parameters = [] } = {}) => {

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
      dragmode: "turntable",
      camera: {
        "up": {
            "x": 0,
            "y": 0,
            "z": 1
        },
        "center": {
            "x": 0.02403915366009736,
            "y": 0.05229099136403341,
            "z": -0.14839975251373883
        },
        "eye": {
            "x": 0.5400601603427597,
            "y": 1.8085400211512366,
            "z": 0.5540320868623193
        },
        "projection": {
            "type": "perspective"
        }
      }
    }
  }

  if(camera)
    layout.scene.camera = camera

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
      if (scaleisVisible)
        scaleisVisible = false
      marker.colorbar = {
        "thickness": 20,
        "title": {
          "text": parameters.find(e => e.name === input[i].colorscaleaxis)?.alias || input[i].colorscaleaxis,
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
      "z": input[i].z,
      "idx": input[i]['$loki'],
      "legendgroup": input[i].id,
      "name": input[i].name,
      marker,
      "type": "scatter3d",
      "mode": mode,
      "connectgaps": true,
      "visible": true
    })
  }

  return { data, layout }
}

export default scatter3d
