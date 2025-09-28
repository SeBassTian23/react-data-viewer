import React from 'react'

import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import { useDispatch } from 'react-redux';
import { parameterToggled } from '../../features/parameter.slice';

export default function ParameterItem(props) {

  const dispatch = useDispatch();

  return (
    <ListGroup.Item as="li"
      className="d-flex justify-content-between align-items-center"
      title={props.alias ? `${props.alias} (${props.name})` : props.name}
    >
      <span className='d-inline-block text-truncate'>{props.alias ? props.alias : props.name}</span>
      <Form.Check
        type="switch"
        checked={props.isSelected}
        onChange={() => dispatch(parameterToggled(props.index))}
      />
    </ListGroup.Item>
  )
}
