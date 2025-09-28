import { useState } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import DataTypeItemMenu from './DataTypeItemMenu';
import { datatypeIcons } from '../../constants/datatype-icons'


export default function DataTypeItem(props) {

  const [showHoverContent, setShowHoverContent] = useState(false);

  return (
    <ListGroup.Item as="li" className="d-flex justify-content-between align-items-center"
      onMouseEnter={() => setShowHoverContent(true)}
      onMouseLeave={() => setShowHoverContent(false)}
      title={props.specialtype ? props.specialtype : props.type || ''}
    >
      <span className='d-inline-block text-truncate'>{props.alias ? props.alias : props.name}</span>

      <i className={`bi ${props.specialtype ? datatypeIcons[props.specialtype] : datatypeIcons[props.type] || 'bi-question-square'}`} />

      {showHoverContent && (
        <DataTypeItemMenu {...props} />
      )}
    </ListGroup.Item>
  )
}
