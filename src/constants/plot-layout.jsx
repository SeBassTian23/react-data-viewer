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
    autorange: true
  },
  yaxis: {
    title: {
      text: "y-Axis"
    },
    type: "linear",
    autorange: true
  },
  dragmode: "zoom",
  showlegend: true
}

export default plotLayout

export const plotLayoutDarkmode = {
  title: {
    font: {
      color: '#ffffff'
    }
  },
  xaxis: {
    color: '#ffffff',  // Color for axis label and numbers
    gridcolor: '#444444',  // Color of grid lines
    zerolinecolor: '#ffffff',  // Color of the zero line
    tickcolor: '#444444',  // Color of the tick marks
    linecolor: '#444444',  // Color of the axis line    
  },
  yaxis: {
    color: '#ffffff',  // Color for axis label and numbers
    gridcolor: '#444444',  // Color of grid lines
    zerolinecolor: '#ffffff',  // Color of the zero line
    tickcolor: '#444444',  // Color of the tick marks
    linecolor: '#444444',  // Color of the axis line    
  },
  modebar: {
    bgcolor: '#212529',
  },
  legend: {
    font: {
      color: '#ffffff'
    }
  }
}

export const plotLayoutLightmode = {
  title: {
    font: {
      color: '#444444'
    }
  },
  xaxis: {
    color: '#444444',  // Color for axis label and numbers
    gridcolor: '#eeeeee',  // Color of grid lines
    zerolinecolor: '#444444',  // Color of the zero line
    tickcolor: '#eeeeee',  // Color of the tick marks
    linecolor: '#eeeeee',  // Color of the axis line    
  },
  yaxis: {
    color: '#444444',  // Color for axis label and numbers
    gridcolor: '#eeeeee',  // Color of grid lines
    zerolinecolor: '#444444',  // Color of the zero line
    tickcolor: '#eeeeee',  // Color of the tick marks
    linecolor: '#eeeeee',  // Color of the axis line    
  },
  modebar: {
    bgcolor: '#ffffff'
  },
  legend: {
    font: {
      color: '#444444'
    }
  }
}