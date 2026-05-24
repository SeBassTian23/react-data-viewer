
import jStat from 'jstat'

const piechart = ({ input = [], showas = 'mean', textposition = 'inside', textinfo='name+percent', categoryaxis = 'None', parameters = [] } = {}) => {

  const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);

  let data = []
  let layout = {}
  let annotations = []

  let labels = []
  let y = []
  let colors = []

  const hoverinfo = 'label+percent+value'
  
  if (categoryaxis !== 'None') {

    // Get unique categories
    const uniqueCategories =  [...new Set(input.map( itm => itm.category ).flat())]

    // Set up grid
    const {rows, columns} = getOptimalGridLayout(uniqueCategories.length, 16, 9)

    const xgap = 0.1
    const ygap = 0.2

    // Set up a grid for the categories
    layout['grid'] = {
      rows,
      columns,
      xgap,
      ygap
    }

    // Now build data for categories
    for(let c in uniqueCategories){
      let y = []
      for (let i in input) {
        let category_data = indexOfAll(input[i].category, uniqueCategories[c]).map(item => input[i].y[item])

        if (showas === 'median')
          y.push(jStat.median(category_data))
        else if (showas === 'sum')
          y.push(jStat.sum(category_data))
        else if (showas === 'count')
          y.push(category_data.length)
        else
          y.push(jStat.mean(category_data))
      }

      let col = Math.floor( c / columns )
      let row = parseInt(c) % Math.ceil(uniqueCategories.length / rows)

      data.push({
        values: y,
        labels: input.map(el => el.name),
        name: uniqueCategories[c],
        marker: {
          colors: input.map(el => el.color),
        },
        domain: getPieDomain( col, row, rows, columns, xgap, ygap),
        type: "pie",
        hoverinfo,
        textinfo: textinfo,
        textposition: textposition,
        automargin: true
      })

      addSubplotTitle(layout, uniqueCategories[c], col, row, rows, columns, xgap, ygap);

      // addGridBorders(layout, rows, columns, xgap, ygap);

    }

  }
  else{

    for (let i in input) {

      // Labels
      labels.push(input[i].name)
      
      // Colors
      colors.push(input[i].color)

      // Data
      if (showas === 'median')
        y.push(jStat.median(input[i].y))
      else if (showas === 'sum')
        y.push(jStat.sum(input[i].y))
      else if (showas === 'count')
        y.push(input[i].y.length)
      else
        y.push(jStat.mean(input[i].y))
    }

    data.push({
      values: y,
      labels,
      marker: {
        colors
      },
      type: "pie",
      hoverinfo,
      textinfo,
      textposition,
      automargin: true
    })
  }

  return { data, layout }
}

export default piechart

function getOptimalGridLayout(numCharts, width, height) {

  // // total number of charts
  // numCharts = numCharts.length

  // if(numCharts < 4)
  //   return { rows: numCharts, columns: 1 };

  // For landscape screens, prefer wider layouts (more columns than rows)
  const aspectRatio = width / height;  // Adjust if your screen is different (e.g., 21/9)

  
  let bestRows = 1;
  let bestCols = numCharts;
  let bestRatio = Math.abs((bestCols / bestRows) - aspectRatio);
  
  // Try different row/column combinations
  for (let rows = 1; rows <= numCharts; rows++) {
    const cols = Math.ceil(numCharts / rows);
    
    // Calculate how close this ratio is to landscape aspect ratio
    const ratio = cols / rows;
    const difference = Math.abs(ratio - aspectRatio);
    
    // Prefer solutions closer to the aspect ratio
    if (difference < bestRatio) {
      bestRatio = difference;
      bestRows = rows;
      bestCols = cols;
    }
  }
  
  return { rows: bestRows, columns: bestCols, ratio: bestRatio };
}

function getPieDomain(row, col, rows, columns, xgap = 0.1, ygap = 0.2) {
  const cellWidth = 1 / columns;
  const cellHeight = 1 / rows;

  const x0 = col * cellWidth + (xgap / 2) * cellWidth;
  const x1 = (col + 1) * cellWidth - (xgap / 2) * cellWidth;

  // Invert row: Plotly paper coords go bottom-to-top
  const y0 = (rows - row - 1) * cellHeight + (ygap / 2) * cellHeight;
  const y1 = (rows - row) * cellHeight - (ygap / 2) * cellHeight;

  return { x: [x0, x1], y: [y0, y1] };
}

function addSubplotTitle(layout, title, row, col, rows, columns, xgap = 0.1, ygap = 0.2) {
  const cellWidth = 1 / columns;
  const cellHeight = 1 / rows;

  // Center x of the cell
  const x = (col + 0.5) * cellWidth;

  // Top y of the cell (minus a small padding so it sits just inside)
  const y = (rows - row) * cellHeight - (ygap / 2) * cellHeight;

  const annotations = layout.annotations || [];

  annotations.push({
    text: title,
    xref: 'paper',
    yref: 'paper',
    x,
    y,
    xanchor: 'center',
    yanchor: 'bottom',       // text grows downward from the top edge
    showarrow: false,
    font: {
      size: 14,
      // color: '#333',
    },
  });

  layout.annotations = annotations;
  return layout;
}

// Helper to add grid borders to a Plotly layout
function addGridBorders(layout, rows, columns, xgap = 0.1, ygap = 0.2) {
  const cellWidth = 1 / columns;
  const cellHeight = 1 / rows;

  const shapes = layout.shapes || [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // Calculate domain boundaries (with gap applied)
      const x0 = col * cellWidth + (xgap / 2) * cellWidth;
      const x1 = (col + 1) * cellWidth - (xgap / 2) * cellWidth;

      // Plotly rows go bottom-to-top, so invert the row index
      const y0 = (rows - row - 1) * cellHeight + (ygap / 2) * cellHeight;
      const y1 = (rows - row) * cellHeight - (ygap / 2) * cellHeight;

      shapes.push({
        type: 'rect',
        xref: 'paper',
        yref: 'paper',
        x0, y0, x1, y1,
        line: {
          color: 'red',   // border color
          width: 1,
          dash: 'dot',    // 'solid', 'dot', 'dash', etc.
        },
        fillcolor: 'rgba(0,0,0,0)', // transparent fill
      });
    }
  }

  layout.shapes = shapes;
  return layout;
}