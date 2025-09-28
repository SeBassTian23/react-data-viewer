import { ColorGradientColorArray } from '../../components/Main/ColorGradient'

const histogram2d = ({ input = [], colorscale = 'Blackbody', parameters = [] } = {}) => {

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

  for (let i in input) {
    layout.xaxis.title.text = parameters.find(e => e.name === input[i].xaxis)?.alias || input[i].xaxis
    layout.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis
    if (i === "0") {
      data.push({
        "x": input[i].x,
        "y": input[i].y,
        "type": "histogram2d",
        "visible": true,
        "colorscale": ColorGradientColorArray(colorscale).map((item, idx, arr) => [(idx / (arr.length - 1)), item]) || colorscale,
        "colorbar": {
          "thickness": 20
        }
      })
    }
    else {
      data[0].x = [...data[0].x, ...input[i].x]
      data[0].y = [...data[0].y, ...input[i].y]
    }
  }

  return { data, layout }
}

export default histogram2d