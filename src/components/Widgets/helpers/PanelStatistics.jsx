import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Card from 'react-bootstrap/Card';
import PanelInputForm from './PanelInputForm'
import widgets from '../../../constants/widgets';

/**
 * Panel Stats General Container
 * @param {*} widgetType - widget name
 * @param {*} props - props
 * @param {*} CalculateComponent - Component to calculate statistical test
 * @returns 
 */
export default function PanelStatistics({ 
  widgetType, 
  props, 
  CalculateComponent
}) {

  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)

  const subsets = stateDatasubsets.filter((itm) => itm.isVisible)
  const thresholds = stateThresholds.filter((itm) => itm.isSelected)

  const [state, setState] = useState(false)

  useEffect(() => setState(props.content ? true : false), [props.content, stateThresholds, stateDatasubsets])

  const widget = widgets.find(itm => itm.type == widgetType);

  return (<>
    {state ?
      <Card.Body className='p-0 overflow-y'>
        <CalculateComponent {...props} {...props.content} subsets={subsets} thresholds={thresholds} />
      </Card.Body>
      :
      <PanelInputForm {...props} 
        selectType={widget.selectType}
        additionalSelect={widget?.additionalSelect || null}
        comment={widget?.comment}
        selectHelp={`Parameter for ${widget.name}`}
        />
    }
  </>
  )
}