import { useState, useCallback } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import DataTypeItem from './DataTypeItem'

import { useSelector } from 'react-redux'

import useHelp from '../../hooks/useHelp';

export default function DataTypes() {

  const state = useSelector(state => state.parameters);

  const [filter, setFilter] = useState('');

  const help = useHelp();

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Data Types", "help/md/data-types.md")
  },[] )

  return (
    <>
      <Row id="dv-datatypes">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center fw-bold">
          Data Types
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
        </Col>
      </Row>
      <Row className='h-100 overflow-auto align-content-start'>
        <Col sm={12} className='py-1'>
          <Form.Control type="search" size="sm" placeholder="Search" onChange={(e) => setFilter(e.target.value)} />
        </Col>
        <Col sm={12} className='p-0'>
          <ListGroup as="ul" variant="flush">
            {state.filter(f => f.name.toLowerCase().match(filter.toLowerCase()) || filter === '').map((el, idx) => <DataTypeItem key={idx} {...el} />)}
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}
