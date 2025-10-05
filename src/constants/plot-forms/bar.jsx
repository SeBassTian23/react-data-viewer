import * as PlotlyIcons from 'plotly-icons';

const bar = [
  {
    'type': 'barchart',
    'name': 'Bar',
    'icon': <PlotlyIcons.PlotBarIcon className='ploty-icon-bar' />,
    "options": [
      {
        'label': 'y-Axis',
        'name': 'yaxis',
        'input': 'select',
        'options': 'number'
      },
      {
        'label': 'Category',
        'name': 'categoryaxis',
        'input': 'select',
        'options': ['None', 'parameters-string']
      },
      {
        'label': 'Error Bars',
        'name': 'errorbar',
        'input': 'select',
        'options': ['None', 'Standard Deviation', 'Standard Error']
      },
      {
        'label': 'Calculate',
        'name': 'showas',
        'input': 'select',
        'options': ['mean', 'median', 'sum']
      },
      {
        'label': 'Display Bars',
        'name': 'barmode',
        'input': 'select',
        'options': ['group', 'stack', 'overlay', 'relative']
      }
    ]
  },
  {
    'type': 'barchart-horizontal',
    'name': 'Bar (horizontal)',
    'icon': <PlotlyIcons.PlotBarIcon className='ploty-icon' />,
    "options": [
      {
        'label': 'x-Axis',
        'name': 'yaxis',
        'input': 'select',
        'options': 'number'
      },
      {
        'label': 'Category',
        'name': 'categoryaxis',
        'input': 'select',
        'options': ['None', 'parameters-string']
      },
      {
        'label': 'Error Bars',
        'name': 'errorbar',
        'input': 'select',
        'options': ['None', 'Standard Deviation', 'Standard Error']
      },
      {
        'label': 'Calculate',
        'name': 'showas',
        'input': 'select',
        'options': ['mean', 'median', 'sum']
      },
      {
        'label': 'Display Bars',
        'name': 'barmode',
        'input': 'select',
        'options': ['group', 'stack', 'overlay', 'relative']
      }
    ]
  }
]

export default bar;