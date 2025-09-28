

const histogram = ({ input = [], autobinx = true, barmode = 'overlay', parameters = [] } = {}) => {

  let data = []
  let layout = {
    barmode,
    xaxis: {
      title: {
        text: 'x-Axis'
      }
    },
    yaxis: {
      title: {
        text: 'Frequencey'
      }
    }
  }

  for (let i in input) {
    layout.xaxis.title.text = parameters.find(e => e.name === input[i].xaxis)?.alias || input[i].xaxis
    data.push({
      "x": input[i].x,
      "legendgroup": input[i].id,
      "name": input[i].name,
      "marker": {
        "color": input[i].color,
        "line": {
          "color": input[i].color,
          "width": 1
        }
      },
      "type": "histogram",
      "visible": true,
      "autobinx": autobinx,
      "xbins": autobinx ? null : calculateBins(input[i].x)
    })
  }

  return { data, layout }
}


export const calculateBins = (arr) => {
  let n = arr.length
  let bins = 4

  if (n < 30)
    bins = Math.round(Math.log(n)) + 1;

  else if (n >= 30)
    bins = Math.round(Math.sqrt(n));

  if (bins > 30)
    bins = 30

  return {
    "start": Math.min(...arr),
    "end": Math.max(...arr),
    "size": (Math.max(...arr) - Math.min(...arr)) / bins
  }
}

export const calculateBinCount = (arr) => {
  let n = arr.length
  let bins = 4

  if (n < 30)
    bins = Math.round(Math.log(n)) + 1;

  else if (n >= 30)
    bins = Math.round(Math.sqrt(n));

  if (bins > 30)
    bins = 30

  return bins
}

export default histogram