import React, { Fragment } from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup';

import colorSchemes from '../../constants/color-schemes'

import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux'
import { datasubsetEdited } from '../../features/datasubset.slice'

export default function ModalDialogEditSubset(props) {

  const profile = useSelector(state => state.user);

  const { register, getValues, setValue } = useForm();
  const dispatch = useDispatch();

  return (
    <Modal
      show={props.show}
      onHide={() => props.onHide()}
      backdrop="static"
      keyboard={true}
    >
      <Modal.Body>
        <span className="d-flex align-items-center fs-5">
          <i className="bi bi-filter me-2 fs-3 text-muted" /> Data Subset
        </span>

        <span className='form-label'>Color & Name</span>
        <InputGroup className="mb-3 mt-2">
          <Form.Control type={'color'} aria-label="Series color" {...register("color")} defaultValue={props.color} className='form-color' />
          <Form.Control type={'text'} aria-label="Series name" {...register("name")} placeholder='Subset Name' defaultValue={props.name} />
        </InputGroup>
        <span className='form-label'>Preset Colors</span>
        <div className='d-flex justify-content-between p-2'>
        {colorSchemes[profile.colorScheme].map((itm,idx) => <button key={idx} type="button" className="btn-color-selector" style={{
              background: itm,
              boxShadow: `0 0 0 1px var(--bs-body-bg), 0 0 0 2px var(--bs-border-color)`
            }}
            onClick = {()=> setValue("color", itm)}
          />)}
        </div>
        <span className='form-text'>Select different color schemes in your user profile</span>
          <hr/>
        <span className='form-label'>Filter(s)</span>
        <FilterDescriptionList filter={props.filter} />
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

const FilterDescriptionList = function({filter, ...props}){

  const parameters = useSelector(state => state.parameters)

  return <dl className='row mb-0'>
    {filter.map((itm, idx) => <Fragment key={idx}>
        <dt className="col-sm-4">{itm.name === "$loki"? "Individual Rows" : parameters.find(p => p.name == itm.name )?.alias || itm.name}</dt>
        <dd className="col-sm-8">{itm.name === "$loki"? `${itm.values.length} selected` : itm.values.join(', ')}</dd>
      </Fragment>
      )}
  </dl>
}
