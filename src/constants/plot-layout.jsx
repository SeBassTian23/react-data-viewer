const plotLayout = {
  title: {
    text: null
  },
  paper_bgcolor: "rgba(0, 0, 0, 0)",
  plot_bgcolor: "rgba(0, 0, 0, 0)",
  modebar: {
    bgcolor: "white",
    remove: ["toimage"]
  },
  legend: {
    orientation: "h",
    traceorder: "normal",
    y: -0.25
  },
  autosize: true,
  hovermode: "closest",
  xaxis: {
    title: {
      text: "x-Axis"
    },
    type: "linear",
    autorange: true,
    automargin: true
  },
  yaxis: {
    title: {
      text: "y-Axis"
    },
    type: "linear",
    autorange: true,
    automargin: true
  },
  dragmode: "zoom",
  showlegend: true
}

export default plotLayout

export const plotLayoutDarkmode = {
  font: {
    color: '#ffffff'
  },
  xaxis: {
    gridcolor: '#444444',  // Color of grid lines
    zerolinecolor: '#ffffff',  // Color of the zero line
    tickcolor: '#444444',  // Color of the tick marks
    linecolor: '#444444',  // Color of the axis line    
  },
  yaxis: {
    gridcolor: '#444444',  // Color of grid lines
    zerolinecolor: '#ffffff',  // Color of the zero line
    tickcolor: '#444444',  // Color of the tick marks
    linecolor: '#444444',  // Color of the axis line    
  },
  modebar: {
    bgcolor: '#212529',
  }
}

export const plotLayoutLightmode = {
  font: {
    color: '#444444'
  },
  xaxis: {
    gridcolor: '#eeeeee',  // Color of grid lines
    zerolinecolor: '#444444',  // Color of the zero line
    tickcolor: '#eeeeee',  // Color of the tick marks
    linecolor: '#eeeeee',  // Color of the axis line    
  },
  yaxis: {
    gridcolor: '#eeeeee',  // Color of grid lines
    zerolinecolor: '#444444',  // Color of the zero line
    tickcolor: '#eeeeee',  // Color of the tick marks
    linecolor: '#eeeeee',  // Color of the axis line    
  },
  modebar: {
    bgcolor: '#ffffff'
  }
}