import { useState, useCallback } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import ParameterItem from './ParameterItem'

import { useSelector } from 'react-redux';

import useHelp from '../../hooks/useHelp';

export default function Parameters() {

  const state = useSelector(state => state.parameters);
  const [filter, setFilter] = useState('');

  const help = useHelp();

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Parameters", "help/md/parameters.md")
  },[] )

  return (
    <>
      <Row id="dv-parameters">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center fw-bold">
          Parameters
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
        </Col>
      </Row>

      <Row className='h-100 overflow-auto align-content-start'>
        <Col sm={12} className='py-1'>
          <Form.Control type="search" size="sm" placeholder="Search" onChange={(e) => setFilter(e.target.value)} />
        </Col>
        <Col sm={12} className='p-0'>
          <ListGroup as="ul" variant="flush">
            {state.map((el, idx) => {
              if(el.name.toLowerCase().match(filter.toLowerCase()) || filter === '')
               return (<ParameterItem key={idx} index={idx} {...el} />)
            })}
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}
