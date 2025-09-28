import { useState } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import ParameterItem from './ParameterItem'

import HelpOffCanvas from '../Main/HelpOffCanvas'

import { useSelector } from 'react-redux';

export default function Parameters() {

  const state = useSelector(state => state.parameters);
  const [filter, setFilter] = useState('');

  return (
    <>
      <Row id="dv-parameters">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center">
          Parameters
          <HelpOffCanvas title='Help | Parameters' url='help/md/parameters.md' />
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
