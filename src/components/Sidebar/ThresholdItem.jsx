import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form'

import { thresholdEdit } from '../../features/threshold.slice';

import ListGroup from 'react-bootstrap/ListGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ThresholdItemMenu from './ThresholdItemMenu';

export default function ThresholdItem(props) {

  const parameters = useSelector(state => state.parameters)

  const [showHoverContent, setShowHoverContent] = useState(false);
  const [showEditContent, setShowEditContent] = useState(false);

  const param = parameters.find(e => e.name === props.name);

  const { register, getValues, setValue } = useForm();

  const dispatch = useDispatch();

  useEffect( () => {
    if(showEditContent){
      setShowHoverContent();
      if(props.min)
        setValue('minimum', props.min, { shouldTouch: true })
      if(props.max)
        setValue('maximum', props.max, { shouldTouch: true })
    }
  },[showEditContent])

  const handleEditSubmit = () => {
    const data = getValues();
    dispatch(thresholdEdit({
      id: props.id,
      min: data.minimum !== '' ? data.minimum : null,
      max: data.maximum !== '' ? data.maximum : null,
    }));
    setShowEditContent(false);
    setShowHoverContent(true);
  }

  return (
    <ListGroup.Item as="li" className='d-flex justify-content-between align-items-center list-group-item'
      onMouseEnter={() => !showEditContent && setShowHoverContent(true)}
      onMouseLeave={() => setShowHoverContent(false)}
      title={`${param.alias ? param.alias : props.name}${!props.isSelected ? ' - disabled' : ''}`}
    >
      <>
      {showEditContent && <>
        <Row>
        <span className="fw-bold">{param.alias ? param.alias : props.name}</span><br />
        <InputGroup size="sm" as={Col} className="mb-2">
          <InputGroup.Text id="inputGroup-sizing-sm">Min</InputGroup.Text>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            type='number'
            {...register("minimum")}
          />
        </InputGroup>

        <InputGroup size="sm" as={Col} className="mb-2">
          <InputGroup.Text id="inputGroup-sizing-sm">Max</InputGroup.Text>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            type='number'
            {...register("maximum")}
          />
        </InputGroup>
        <Col sm={12}>
          <Button size='sm' variant='outline-secondary' onClick={handleEditSubmit}><i className='bi bi-check' /> Update</Button>
        </Col>
      </Row>
      </>}
      {!showEditContent && <>
        <span className="d-inline-block text-truncate" style={!props.isSelected ? { 'opacity': 0.25 } : {}}>
          <span className="fw-bold">{param.alias ? param.alias : props.name}</span><br />
          {(props.min && props.max) && <span className="text-muted small">Between: {props.min} - {props.max}</span>}
          {(props.min && !props.max) && <span className="text-muted small">Min: {props.min}</span>}
          {(!props.min && props.max) && <span className="text-muted small">Max: {props.max}</span>}
        </span>
        {showHoverContent && (
          <ThresholdItemMenu {...props} setShowEditContent={setShowEditContent} />
        )}</>
      }
      </>
    </ListGroup.Item>
  )
}
