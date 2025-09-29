import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux';

import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import AliasItem from './AliasItem'

import useHelp from '../../hooks/useHelp';

export default function Aliases() {

  const state = useSelector(state => state.parameters)
  const [filter, setFilter] = useState('');

  const help = useHelp();

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Parameter Aliases", "help/md/aliases.md")
  },[] )

  return (
    <>
      <Row id="dv-parameters">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center">
          Aliases
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
              if (el.name.toLowerCase().match(filter.toLowerCase()) || filter === '')
                return (<AliasItem key={idx} index={idx} {...el} />)
            })}
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}
