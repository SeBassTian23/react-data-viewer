import { useEffect, useId } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import ListGroup from 'react-bootstrap/ListGroup';

import Button from 'react-bootstrap/Button'

import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal';

import { useForm } from 'react-hook-form';

import plotforms from '../../constants/plot-forms'

import { ColorGradientDropDown } from '../Main/ColorGradient';

import { useSelector, useDispatch } from 'react-redux'
import { plotUpdate } from '../../features/plot.slice';


export default function ModalDialogPlot(props) {

  const state = useSelector(state => state.plot)
  const parameters = useSelector(state => state.parameters) 

  const dispatch = useDispatch()

  const { register, watch, reset, setValue, getValues } = useForm();

  useEffect(() => {
    if (props.show) {

      if (state.title)
        setValue('title', state.title, { shouldTouch: true })

      if (state.legend)
        setValue('legend', 'show', { shouldTouch: true })

      if (state.plottype && plotforms[props.type] !== undefined && plotforms[props.type].some((itm) => itm.type == state.plottype ))
        setValue('plottype', state.plottype, { shouldTouch: true })
      else
        setValue('plottype', null, { shouldTouch: true })
    }

  }, [props.show])


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Body>
        <Row>
          <Col className='border-end'>
            <PlotTypeSelect {...props} register={register} />
          </Col>
          <Col>
            <PlotParameterSelect {...props} register={register} setValue={setValue} getValues={getValues} watch={watch} />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant='link' className="fs-6 text-decoration-none col-6 m-0 rounded-0 border-end" onClick={() => { reset(); props.onHide() }}>Close</Button>
        <Button variant='link' className="fw-bold fs-6 text-decoration-none col-6 m-0 rounded-0" onClick={() => {
          if(getValues().plottype)
            dispatch(plotUpdate(getValues()))
          reset();
          props.onHide()
        }
        }
        disabled={(parameters.length === 0 || !getValues().plottype)? true : false}
        >Plot</Button>
      </Modal.Footer>
    </Modal>
  );
}

function PlotTypeSelect(props) {

  const plots = plotforms[props.type] || []

  const legendId = useId()

  return (
    <>
      <div className='border-bottom'>
        <Form.Group className="my-3">
          <Form.Label className='form-label-header'>Title</Form.Label>
          <Form.Control
            size='sm'
            type="text"
            aria-describedby=""
            placeholder='Plot Title'
            {...props.register("title")}
          />
          <Form.Text>Leave empty to hide title</Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className='form-label-header'>Legend</Form.Label>
          <Form.Check type="checkbox" id={legendId} label="Include Legend" value={'show'} {...props.register("legend")} />
        </Form.Group>
      </div>
      <div className='mt-3'>
        <Form.Label className='form-label-header'>Types</Form.Label>
        <ListGroup variant="flush">
          {
            plots.map((item, idx) => {
              return (
                <ListGroup.Item key={idx}>
                  <Form.Check type='radio' id={`check-api-${idx}`}>
                    <Form.Check.Input type='radio' {...props.register("plottype")} value={item.type} />
                    <Form.Check.Label>
                      {' '} {item.icon} {item.name || item.type}
                    </Form.Check.Label>
                  </Form.Check>
                </ListGroup.Item>
              )
            })
          }
        </ListGroup>
      </div>
    </>
  )
}

function PlotParameterSelect(props) {

  const plots = plotforms[props.type] || []
  const plotselect = plots.find((item) => (item.type === props.watch('plottype')))
  const parameters = useSelector(state => state.parameters)
  const state = useSelector(state => state.plot)

  if (state.plottype && plotselect && state.plottype === plotselect.type) {
    for (let key in state) {
      if (!['legend', 'title', 'plottype'].includes(key))
        props.setValue(key, state[key])
    }
  }

  return (
    <>
      {plotselect &&
        plotselect.options.map((item, idx) => {
          return (
            <Form.Group className="mb-3" key={idx}>
              <Form.Label className='form-label-header'>{item.label}</Form.Label>
              {(typeof item.options === 'string' && !item.options.match(/^parameters-/)) &&
                <Form.Select size="sm"
                  {...props.register(item.name)}
                  multiple={item.multiple ? true : false}
                  htmlSize={item.multiple ? item.multiple : null}
                >
                  {parameters.map((option, idx) => {
                    if (option.isSelected && ( (option.type === item.options || option.specialtype === item.options) || (item.options === 'number' && option.specialtype === 'date-time') ) )
                      return <option key={idx} value={option.name}>{option.alias ? option.alias : option.name}</option>
                  })}
                </Form.Select>
              }

              {(item.options === 'parameters-colorscale') &&
                <ColorGradientDropDown key={idx} register={props.register} selectedScale={state[item.name] || 'Viridis'} inputName={item.name} />
              }

              {Array.isArray(item.options) &&
                <Form.Select size="sm"
                  {...props.register(item.name)}
                  multiple={item.multiple ? true : false}
                  htmlSize={item.multiple ? item.multiple : null}
                  key={idx}
                >
                  {item.options.map((option, idx) => {
                    if (option === 'parameters-number') {
                      return parameters.map((option, idx) => {
                        if (option.type === 'number' || option.specialtype === 'date-time' || option.specialtype === 'number' && option.isSelected) {
                          return <option key={idx} value={option.name}>{option.alias ? option.alias : option.name}</option>
                        }
                      })
                    }
                    else if (option === 'parameters-string') {
                      return parameters.map((option, idx) => {
                        if (option.type === 'string' || option.specialtype === 'string' && option.isSelected)
                          return <option key={idx} value={option.name}>{option.alias ? option.alias : option.name}</option>
                      })
                    }
                    else if (option === 'parameters-color') {
                      return parameters.map((option, idx) => {
                        if (option.specialtype === 'color' && option.isSelected)
                          return <option key={idx} value={option.name}>{option.alias ? option.alias : option.name}</option>
                      })
                    }
                    else if (option === 'parameters-array') {
                      return parameters.map((option, idx) => {
                        if (option.type === 'array' && option.isSelected)
                          return <option key={idx} value={option.name}>{option.alias ? option.alias : option.name}</option>
                      })
                    }
                    else {
                      let optionStr = option
                      if (option === true)
                        optionStr = 'Show'
                      if (option === false)
                        optionStr = 'Hide'
                      return <option key={idx} value={option}>{optionStr}</option>
                    }
                  })
                  }
                </Form.Select>
              }
            </Form.Group>
          )
        })
      }
    </>
  )
}
