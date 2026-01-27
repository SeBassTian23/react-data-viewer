import * as PlotlyIcons from 'plotly-icons';

const line = [
  {
    'type': 'line',
    'name': 'Lines',
    'icon': <PlotlyIcons.PlotLineIcon className='ploty-icon' />,
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
      },
      // { 'label': 'Color Scale',
      //   'input': 'select',
      //   'name': 'gradient',
      //   'options': 'parameters-colorscale'
      // }
    ]
  },
  {
    'type': 'line-y-only',
    'name': 'Lines (y-Data only)',
    'icon': <PlotlyIcons.PlotLineIcon className='ploty-icon' />,
    'options': [
      {
        'label': 'y-Axis',
        'input': 'select',
        'name': 'yaxis',
        'options': 'number'
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
      },
      // { 'label': 'Color Scale',
      //   'input': 'select',
      //   'name': 'gradient',
      //   'options': 'parameters-colorscale'
      // }
    ]
  },
  {
    'type': 'line-array-y-only',
    'name': 'Lines from Arrays (y-Data only)',
    'icon': <PlotlyIcons.PlotLineIcon className='ploty-icon' />,
    'options': [
      {
        'label': 'y-Axis',
        'input': 'select',
        'name': 'yaxis',
        'options': 'array'
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
      },
      {
        'label': 'Lines Colored By',
        'input': 'select',
        'name': 'colorscaleaxis',
        'options': ['None', 'Row Number', 'parameters-number', 'parameters-color']
      },
      { 'label': 'Color Scale',
        'input': 'select',
        'name': 'gradient',
        'options': 'parameters-colorscale'
      }
    ]
  }
]

export default line;