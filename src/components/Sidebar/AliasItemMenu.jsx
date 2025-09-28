import React from 'react'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { useDispatch } from 'react-redux';
import { parametersEdit } from '../../features/parameter.slice';

export default function AliasItemMenu(props) {

  const dispatch = useDispatch()

  return (
    <>
      <ButtonGroup size="sm" className='bg-white' style={{ position: 'absolute', right: '0.625rem', top: '0.5rem'}}>
        <Button variant="outline-secondary" onClick={props.onEditClick} >
          <i className="bi-input-cursor-text" />
        </Button>
        {props.alias && <Button variant="outline-secondary" onClick={() => dispatch(parametersEdit({ id: props.id, alias: null }))} >
          <i className="bi-trash-fill" />
        </Button>}
      </ButtonGroup>
    </>
  )
}
