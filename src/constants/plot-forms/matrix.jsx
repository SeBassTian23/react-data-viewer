
import * as PlotlyIcons from 'plotly-icons';

const matrix = [
  {
    'type': 'splom',
    'name': 'SPLOM (Scatter Matrix)',
    'icon': <PlotlyIcons.PlotSplomIcon className='ploty-icon' />,
    "options": [
      {
        'label': 'Dimensions',
        'input': 'select',
        'name': 'dimensionsaxis',
        'options': 'number',
        'multiple': 8
      },
      {
        'label': 'Show Diagonal',
        'input': 'select',
        'name': 'diagonal',
        'options': [false, true]
      }
    ]
  }
]

export default matrix;