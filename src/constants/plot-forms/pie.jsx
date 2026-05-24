import * as PlotlyIcons from 'plotly-icons';

const pie = [
  {
    'type': 'pie',
    'name': 'Pie Chart',
    'icon': <PlotlyIcons.PlotPieIcon className='ploty-icon-pie' />,
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
        'label': 'Calculate',
        'name': 'showas',
        'input': 'select',
        'options': ['mean', 'median', 'sum', 'count']
      },
      {
        'label': 'Label',
        'name': 'textinfo',
        'input': 'select',
        'options': ['percent', 'value', 'label', 'label+percent', 'label+value']
      },
      {
        'label': 'Label Position',
        'name': 'textposition',
        'input': 'select',
        'options': ['inside','outside']
      }
    ]
  }
]

export default pie;