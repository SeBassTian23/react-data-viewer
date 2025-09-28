import React from 'react'

import { useForm } from 'react-hook-form';

import { useSelector, useDispatch } from 'react-redux'
import { dashboardEditPanel, dashboardEditTitlePanel } from '../../features/dashboard.slice'

import { confidenceLevels } from '../../constants/confidence-levels'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

export default function PanelInputForm(props) {

  const { register, getValues } = useForm();
  const dispatch = useDispatch()

  const selectType = props.selectType || 'number'
  const selectTypeName = selectType === 'string' ? 'Categorical' : 'Numerical'
  const selectHelp = props.selectHelp
  const title = props.title || 'Unnamed'
  const additionalSelect = props.additionalSelect || null

  const stateParameters = useSelector(state => state.parameters)

  return (
    <>
      <Card.Body className='p-1' style={{ "overflowY": "hidden !important" }}>
        <Row className='m-0 p-0'>
          <Col className='p-1'>
            <Form.Label className='form-label-header'>{selectTypeName}</Form.Label>
            <Form.Select size='sm' aria-label={selectTypeName} {...register("parameter")} defaultValue={''} >
              {stateParameters.map((option, idx) => {
                if (option.type === selectType && option.isSelected)
                  return <option key={idx} value={option.name}>{option.alias ? option.alias : option.name}</option>
                return null
              })
              }
            </Form.Select>
            {selectHelp && <Form.Text muted>{selectHelp}</Form.Text>}
          </Col>
        </Row>
        <Row className='m-0 p-0'>
          {
            additionalSelect && <Col className='p-1'>
              <Form.Label className='form-label-header'>{additionalSelect.title}</Form.Label>
              <Form.Select size='sm' aria-label={additionalSelect.title} {...register(additionalSelect.register_name)} defaultValue={additionalSelect.defaultValue} >
                {Object.entries(additionalSelect.values).map((option, idx) => {
                  return <option key={idx} value={option[1]}>{option[0]}</option>
                })
                }
              </Form.Select>
            </Col>
          }
          <Col className='p-1'>
            <Form.Label className='form-label-header'>Confidence</Form.Label>
            <Form.Select size='sm' aria-label="Confidence Interval" {...register("confidence_level")} defaultValue='0.05' >
              {Object.entries(confidenceLevels).map((option, idx) => {
                return <option key={idx} value={option[1]}>{option[0]}</option>
              })
              }
            </Form.Select>
          </Col>
          <Col className='d-flex align-items-center mt-auto flex-column p-1'>
            <Button variant="outline-primary" size="sm" onClick={() => {
              let values = getValues()
              dispatch(dashboardEditPanel({ id: props.id, content: { ...values } }))
              dispatch(dashboardEditTitlePanel({ id: props.id, title: `${values.parameter} | ${title}` }))
            }
            }><i className='bi-caret-right' /> Apply</Button>
          </Col>
        </Row>
      </Card.Body>
    </>
  )
}