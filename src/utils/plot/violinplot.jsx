

const violinplot = ({ input = [], points = 'outliers', parameters = [] } = {}) => {

  let data = []
  let layout = {
    barmode: "stack",
    xaxis: {
      title: {
        text: null
      },
      visible: false,
      type: 'category'
    },
    yaxis: {
      title: {
        text: 'Counts'
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
      "box": {
        "visible": true
      },
      "idx": points === 'all'? input[i]['$loki'] : null,
      "type": "violin",
      "visible": true,
      "points": points === "false" ? false : points,
    })
  }

  return { data, layout }
}

export default violinplot
