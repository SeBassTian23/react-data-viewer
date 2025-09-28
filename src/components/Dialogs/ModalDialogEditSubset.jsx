import React from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup';

import { useForm } from 'react-hook-form';

import { useDispatch } from 'react-redux'
import { datasubsetEdited } from '../../features/datasubset.slice'

export default function ModalDialogEditSubset(props) {

  const { register, getValues } = useForm();
  const dispatch = useDispatch()

  return (
    <Modal
      show={props.show}
      onHide={() => props.onHide()}
      backdrop="static"
      keyboard={true}
    >
      <Modal.Body>
        <h5>Edit Series</h5>
        <InputGroup className="mb-3">
          <Form.Control type={'color'} aria-label="Series color" {...register("color")} defaultValue={props.color} className='form-color' />
          <Form.Control type={'text'} aria-label="Series name" {...register("name")} defaultValue={props.name} />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant="link" className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end' onClick={() => props.onHide()}>
          Close
        </Button>
        <Button variant="link" className='fw-bold fs-6 text-decoration-none col-6 m-0 rounded-0' onClick={() => {
          dispatch(datasubsetEdited({ id: props.id, ...getValues() }))
          props.onHide()
        }
        }>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}
