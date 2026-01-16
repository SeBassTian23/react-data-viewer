import { useState, useCallback } from 'react'

import { useForm } from 'react-hook-form'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import ListGroup from 'react-bootstrap/ListGroup'

import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ThresholdItem from './ThresholdItem'

import { useSelector, useDispatch } from 'react-redux';
import { thresholdAdd } from '../../features/threshold.slice';

import useHelp from '../../hooks/useHelp';
import useModalConfirm from '../../hooks/useModalConfirm';

export default function Thresholds(props) {

  const state = useSelector(state => state.thresholds);

  const [toggleform, setToggleform] = useState(false);

  const help = useHelp();
  const modal = useModalConfirm();

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Threshold Data", "help/md/thresholds.md")
  },[] )

  const handleReset = useCallback(() => modal.show("confirm", {
    header: "Delete Thresholds",
    content: `Removing "all Thresholds" cannot be undone.`,
    yes: "Delete",
    no: "Cancel",
    payload: {
      action: "DELETE_THRESHOLDS"
    }
  }), [] )

  const handleNew = () => setToggleform(true)

  return (
    <>
      <Row id='dv-thresholds'>
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center fw-bold">
          Thresholds
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
        </Col>
        <Col sm={12}>
          <ButtonToolbar aria-label="Threshold Menu">
            <ButtonGroup size='sm' className="me-2" aria-label="Add Threshold">
              <Button variant='outline-secondary' onClick={handleNew}><i className='bi-plus-circle-fill' /> New</Button>
              <Button variant='outline-secondary' onClick={handleReset} disabled={!state.length > 0}><i className='bi-x-circle' /> Reset</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>

      {toggleform && <ThresholdForm closeform={setToggleform} />}

      <Row className={`h-100 overflow-auto align-content-${state.length === 0? 'center': 'start'}`}>
        <Col sm={12} className='p-0'>
          {state.length === 0 && !toggleform? <div className='text-center text-muted'>
              <i className='bi bi-bar-chart-steps text-muted fs-1' />
              <p className='small'>Thresholds</p>
            </div>
            :
            <ListGroup as="ul" variant="flush">
              {state.map((el, idx) => <ThresholdItem key={idx} {...el} />)}
            </ListGroup>
          }         
        </Col>
      </Row>
    </>
  )
}

const ThresholdForm = (props) => {

  const state = useSelector(state => state.parameters)
  const thresholds = useSelector(state => state.thresholds)

  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  return (
    <>
      <Row className="mb-2">
        <Form.Group as={Col}>
          <Form.Select size='sm' {...register("parameter")} aria-label="Default select example">
            {state.filter((item) => (item.type === 'number' && thresholds.filter((th) => th.name === item.name).length === 0))
              .map((item, idx) => <option key={idx} value={item.name}>{item.alias ? item.alias : item.name}</option>)
            }
          </Form.Select>
        </Form.Group>
      </Row>

      <Row>
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
      </Row>
      <Row className='mb-2'>
        <Col>
          <Button size='sm' className='mx-1' onClick={handleSubmit((data, event) => {

            const payload = {
              name: data.parameter,
              min: data.minimum !== '' ? data.minimum : null,
              max: data.maximum !== '' ? data.maximum : null
            }

            // dispatch({type: actions.ADD_THRESHOLD, payload})

            dispatch(thresholdAdd(payload))

            props.closeform(false)
          })}>Add</Button>
          <Button size='sm' className='mx-1' variant='outline-secondary' onClick={() => (props.closeform(false))}>Cancel</Button>
        </Col>
      </Row>
    </>
  )

}