import React  from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form';

import { ColorGradientDropDown } from '../Main/ColorGradient';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

import { mapShowHistogram } from '../../features/map.slice'

export default function ModalDialogMapHistogram(props) {

  const { register, getValues } = useForm();
  const dispatch = useDispatch()

  const stateParameters = useSelector(state => state.parameters)
  const stateMap = useSelector(state => state.map)

  return (
    <Modal
      show={props.show}
      onHide={() => props.onHide()}
      backdrop="static"
      keyboard={true}
    >
      <Modal.Body>
        <h5>Histogram</h5>
        <Form.Group className='my-2'>
          <Form.Label className='form-label-header'>Color Markers By</Form.Label>
          <Form.Select size='sm' aria-label="Parameter" {...register("colorBy")} defaultValue={stateMap.colorBy} >
            {stateParameters.map((option, idx) => {
              if (option.isSelected && (option.type === 'number' || option.specialtype === 'date-time' || option.specialtype === 'number') )
                // if (option.type === 'number' && option.isSelected)
                return <option key={idx} value={option.name}>{option.alias ? option.alias : option.name}</option>
            })
            }
          </Form.Select>
        </Form.Group>
        <Form.Group className='my-2'>
          <Form.Label className='form-label-header'>Color Scale</Form.Label>
          <ColorGradientDropDown inputName='colorScale' register={register} selectedScale={stateMap.colorScale} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant="link" className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end' onClick={() => props.onHide()}>
          Close
        </Button>
        <Button variant="link" className='fw-bold fs-6 text-decoration-none col-6 m-0 rounded-0' onClick={() => {
          let values = getValues()
          if (values.colorScale === undefined)
            values.colorScale = 'Viridis'
          dispatch(mapShowHistogram({ colorType: 'histogram', ...values }))
          props.onHide()
        }
        } disabled={stateParameters.length === 0 ? true : false}>Apply</Button>
      </Modal.Footer>
    </Modal>
  )
}
