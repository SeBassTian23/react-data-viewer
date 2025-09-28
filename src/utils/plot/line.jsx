
const line = ({ input = [], mode = 'line', colorgradient = 'Blackbody', shape = 'linear', dash = 'solid', parameters = [] } = {}) => {

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
    layout.xaxis.title.text = (mode === 'line-y-only') ? null : parameters.find(e => e.name === input[i].xaxis)?.alias || input[i].xaxis
    layout.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis

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

  }

  return { data, layout }
}

export default line
