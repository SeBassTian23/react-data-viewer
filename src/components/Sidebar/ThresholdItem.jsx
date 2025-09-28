import { useState } from 'react'
import { useSelector } from 'react-redux';

import ListGroup from 'react-bootstrap/ListGroup'
import ThresholdItemMenu from './ThresholdItemMenu';

export default function ThresholdItem(props) {

  const parameters = useSelector(state => state.parameters)

  const [showHoverContent, setShowHoverContent] = useState(false);

  const param = parameters.find(e => e.name === props.name)

  return (
    <ListGroup.Item as="li" className='d-flex justify-content-between align-items-center list-group-item'
      onMouseEnter={() => setShowHoverContent(true)}
      onMouseLeave={() => setShowHoverContent(false)}
      title={`${param.alias ? param.alias : props.name}${!props.isSelected ? ' - disabled' : ''}`}
    >
      <span className="d-inline-block text-truncate" style={!props.isSelected ? { 'opacity': 0.25 } : {}}>
        <span className="fw-bold">{param.alias ? param.alias : props.name}</span><br />
        {(props.min && props.max) && <span className="text-muted small">Between: {props.min} - {props.max}</span>}
        {(props.min && !props.max) && <span className="text-muted small">Min: {props.min}</span>}
        {(!props.min && props.max) && <span className="text-muted small">Max: {props.max}</span>}
      </span>
      {showHoverContent && (
        <ThresholdItemMenu {...props} />
      )}
    </ListGroup.Item>
  )
}
