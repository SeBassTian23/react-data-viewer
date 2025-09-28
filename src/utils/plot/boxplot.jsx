

// all, outliers, suspectedoutliers, false

const boxplot = ({ input = [], boxpoints = 'outliers', parameters = [] } = {}) => {

  let data = []
  let layout = {
    barmode: "stack",
    xaxis: {
      title: {
        text: null
      }
    },
    yaxis: {
      title: {
        text: 'Frequencey'
      }
    }
  }

  for (let i in input) {
    layout.yaxis.title.text = parameters.find(e => e.name === input[i].yaxis)?.alias || input[i].yaxis
    data.push({
      "y": input[i].y,
      "legendgroup": input[i].id,
      "name": input[i].name,
      "marker": {
        "color": input[i].color,
        "line": {
          "color": input[i].color,
          "width": 1
        }
      },
      "idx": boxpoints === 'all'? input[i]['$loki'] : null,
      "type": "box",
      "boxpoints": boxpoints === "false" ? false : boxpoints,
      "visible": true
    })
  }

  return { data, layout }
}

export default boxplot
