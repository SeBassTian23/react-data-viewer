import React from 'react'

import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import { useDispatch } from 'react-redux';
import { parameterFilterToggled } from '../../features/parameter.slice';

export default function ParameterFilterItem(props) {

  const dispatch = useDispatch();

  return (
    <ListGroup.Item as="li"
      className="d-flex justify-content-between align-items-center"
      title={props.alias ? `${props.alias} (${props.name})` : props.name}
    >
      <span className='d-inline-block text-truncate'>
        {props.alias ? props.alias : props.name} {(!props.isSelected && props.isFilter) && <i className="bi bi-eye-slash-fill text-danger" title="Select Parameter to show up as Filter" />}
      </span>

      <Form.Check
        type="switch"
        checked={props.isFilter}
        onChange={() => dispatch(parameterFilterToggled(props.id))}
      />
    </ListGroup.Item>
  )
}
