import * as PlotlyIcons from 'plotly-icons';

const distribution = [
  {
    'type': 'histogram',
    'name': 'Histogram',
    'icon': <PlotlyIcons.PlotHistogramIcon className='ploty-icon' />,
    'options': [
      {
        'label': 'x-Axis',
        'input': 'select',
        'name': 'xaxis',
        'options': 'number'
      },
      {
        'label': 'Bar Mode',
        'input': 'select',
        'name': 'barmode',
        'options': ['overlay', 'stack', 'group', 'relative']
      }
    ]
  },
  {
    'type': 'boxplot',
    'name': 'Box-Plot',
    'icon': <PlotlyIcons.PlotBoxIcon className='ploty-icon' />,
    'options': [
      {
        'label': 'y-Axis',
        'input': 'select',
        'name': 'yaxis',
        'options': 'number'
      },
      {
        'label': 'Outliers',
        'input': 'select',
        'name': 'boxpoints',
        'options': ['outliers', 'all', 'suspectedoutliers', false]
      }
    ]
  },
  {
    'type': 'violinplot',
    'name': 'Violin-Plot',
    'icon': <PlotlyIcons.PlotViolinIcon className='ploty-icon' />,
    'options': [
      {
        'label': 'y-Axis',
        'input': 'select',
        'name': 'yaxis',
        'options': 'number'
      },
      {
        'label': 'Outliers',
        'input': 'select',
        'name': 'points',
        'options': ['outliers', 'all', 'suspectedoutliers', false]
      }
    ]
  },
  {
    'type': 'histogram2d',
    'name': '2D Histogram',
    'icon': <PlotlyIcons.PlotHistogram2dIcon className='ploty-icon' />,
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
        'label': 'Gradient',
        'input': 'select',
        'name': 'colorscale',
        'options': 'parameters-colorscale'
      }
    ]
  },
  {
    'type': 'histogram2dcontour',
    'name': '2D Contour',
    'icon': <PlotlyIcons.PlotHistogram2dcontourIcon className='ploty-icon' />,
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
        'label': 'Gradient',
        'input': 'select',
        'name': 'colorscale',
        'options': 'parameters-colorscale'
      },
      {
        'label': 'Markers',
        'input': 'select',
        'name': 'showMarkers',
        'options': [true, false]
      },
      {
        'label': 'Coloring',
        'input': 'select',
        'name': 'coloring',
        'options': ['lines', 'fill', 'heatmap']
      },
      {
        'label': 'Labels',
        'input': 'select',
        'name': 'showlabels',
        'options': [false, true]
      },
      {
        'label': 'x- & y-Axis Histograms',
        'input': 'select',
        'name': 'showHistograms',
        'options': [true, false]
      }
    ]
  }
]

export default distribution;