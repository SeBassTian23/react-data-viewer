import { ColorGradientColorArray } from '../../components/Main/ColorGradient'
import chroma from 'chroma-js'
import jStat from 'jstat'

const line = ({ input = [], mode = 'line', gradient = 'Viridis', shape = 'linear', dash = 'solid', parameters = [] } = {}) => {

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
    layout.xaxis.title.text = (mode !== 'line') ? null : parameters.find(e => e.name === input[i].xaxis)?.alias || input[i].xaxis
    layout.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis

    if(mode !== 'line-array-y-only')
      data.push({
        "x": (mode === 'line-y-only') ? Array.from({ length: input[i].y.length }, (_, i) => i + 1) : input[i].x,
        "y": input[i].y,
        "legendgroup": input[i].id,
        "name": input[i].name,
        "showlegend": (input.length > 0) ? true : false,
        "line": {
          "color": input[i].color,
          "width": 1.5,
          "shape": shape,
          // "smoothing": 1,
          "dash": dash
        },
        "type": "scattergl",
        "mode": 'lines',
        "connectgaps": true,
        "visible": true
      })

    if(mode === 'line-array-y-only'){
      const f = input[i]?.colorscaleaxis == 'Row Number'? chroma.scale( ColorGradientColorArray(gradient) ).domain([0, jStat.max(input.map( itm => itm.y.length ))]) : chroma.scale( ColorGradientColorArray(gradient) ).domain([jStat.min(input[i].colorscale), jStat.max(input[i].colorscale)])|| null

      let marker = {}

      if (input[i].colorscaleaxis !== 'None') {
        marker = {
            "color": input[i].colorscale,
            "colorscale": ColorGradientColorArray(gradient).map((item, idx, arr) => [(idx / (arr.length - 1)), item]) || gradient,
            "showscale": scaleisVisible,
            "colorbar": {
              "thickness": 20,
              "title": {
                "text": parameters.find(e => e.name === input[i].colorscaleaxis)?.alias || input[i].colorscaleaxis,
                "side": "right"
              }
            },
            "size": 0.01,  // Small markers to show the colorbar
            "line": {
              "width": 0
            },
            "cauto": false,
            "cmin": input[i]?.colorscaleaxis == 'Row Number'? 0 : jStat.min(input.map((item) => item.colorscale).flat()),
            "cmax": input[i]?.colorscaleaxis == 'Row Number'? jStat.max(input.map( itm => itm.y.length )) :jStat.max(input.map((item) => item.colorscale).flat())
        }
      } 

      for(let g in input[i].y){
        marker = g > 0? {
          "size": 0.01,  // Small markers to show the colorbar
            "line": {
              "width": 0
            },
        } : marker
        data.push({
          "x": Array.from({ length: input[i].y[g].length }, (_, i) => i + 1),
          "y": input[i].y[g],
          "legendgroup": input[i].id,
          "name": input[i].name,
          "showlegend": (input.length > 0) ? true : false,
          "line": {
            "color": input[i]?.colorscaleaxis == 'None'? input[i].color : f( input[i]?.colorscaleaxis == 'Row Number'? parseInt(g) : input[i].colorscale[g] ).hex(),
            "width": 1.5,
            "shape": shape,
            // "smoothing": 1,
            "dash": dash
          },
          marker,
          "type": "scattergl",
          "mode": 'lines+markers',
          "connectgaps": true,
          "visible": true
        })
        scaleisVisible = false;
      }
    }
  }

  return { data, layout }
}

export default line
