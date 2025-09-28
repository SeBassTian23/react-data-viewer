import * as PlotlyIcons from 'plotly-icons';

const scatter = [
  {
    'type': 'scatter',
    'name': 'Scatter',
    'icon': <PlotlyIcons.PlotScatterIcon className='ploty-icon' />,
    'options': [
      {
        'label': 'x-Axis',
        'input': 'select',
        'name': 'xaxis',
        'options': 'number'
      },
      {
        'label': 'y-Axis',
        'input': 'select',
        'name': 'yaxis',
        'options': 'number'
      },
      {
        'label': 'Marker Size By',
        'input': 'select',
        'name': 'sizeaxis',
        'options': ['None', 'parameters-number']
      },
      {
        'label': 'Marker Colored By',
        'input': 'select',
        'name': 'colorscaleaxis',
        'options': ['None', 'parameters-number', 'parameters-color']
      },
      {
        'label': 'Color Scale',
        'input': 'select',
        'name': 'gradient',
        'options': 'parameters-colorscale'
      }
    ]
  },
  {
    'type': 'scatter-lines',
    'name': 'Scatter (with lines)',
    'icon': <PlotlyIcons.PlotLineMarkersIcon className='ploty-icon' />,
    'options': [
      {
        'label': 'x-Axis',
        'input': 'select',
        'name': 'xaxis',
        'options': 'number'
      },
      {
        'label': 'y-Axis',
        'input': 'select',
        'name': 'yaxis',
        'options': 'number'
      },
      {
        'label': 'Marker Size By',
        'input': 'select',
        'name': 'sizeaxis',
        'options': ['None', 'parameters-number']
      },
      {
        'label': 'Marker Colored By',
        'input': 'select',
        'name': 'colorscaleaxis',
        'options': ['None', 'parameters-number']
      },
      {
        'label': 'Color Scale',
        'input': 'select',
        'name': 'gradient',
        'options': 'parameters-colorscale'
      },
      {
        'label': 'Line Shape',
        'input': 'select',
        'name': 'shape',
        'options': ['linear', 'spline', 'hv', 'vh', 'hvh', 'vhv']
      },
      {
        'label': 'Line Style',
        'input': 'select',
        'name': 'dash',
        'options': ['solid', 'dot', 'dash', 'longdash', 'dashdot', 'longdashdot']
      }
    ]
  },
  {
    'type': 'scatter3d',
    'name': '3D Scatter',
    'icon': <PlotlyIcons.PlotScatter3dIcon className='ploty-icon' />,
    'options': [
      {
        'label': 'x-Axis',
        'input': 'select',
        'name': 'xaxis',
        'options': 'number'
      },
      {
        'label': 'y-Axis',
        'input': 'select',
        'name': 'yaxis',
        'options': 'number'
      },
      {
        'label': 'z-Axis',
        'input': 'select',
        'name': 'zaxis',
        'options': 'number'
      },
      {
        'label': 'Marker Size By',
        'input': 'select',
        'name': 'sizeaxis',
        'options': ['None', 'parameters-number']
      },
      {
        'label': 'Marker Colored By',
        'input': 'select',
        'name': 'colorscaleaxis',
        'options': ['None', 'parameters-number']
      },
      {
        'label': 'Color Scale',
        'input': 'select',
        'name': 'gradient',
        'options': 'parameters-colorscale'
      }
    ]
  },
  // {
  //   'type': 'surface',
  //   'name': '3D Surface',
  //   'icon': <PlotlyIcons.PlotSurfaceIcon className='ploty-icon' />,
  //   'options': [
  //     {
  //       'label': 'x-Axis',
  //       'input': 'select',
  //       'name': 'xaxis',
  //       'options': 'number'
  //     },
  //     {
  //       'label': 'y-Axis',
  //       'input': 'select',
  //       'name': 'yaxis',
  //       'options': 'number'
  //     },
  //     {
  //       'label': 'z-Axis',
  //       'input': 'select',
  //       'name': 'zaxis',
  //       'options': 'number'
  //     },
  //     {
  //       'label': 'Color Scale',
  //       'input': 'select',
  //       'name': 'gradient',
  //       'options': 'parameters-colorscale'
  //     }
  //   ]
  // },
]

export default scatter;