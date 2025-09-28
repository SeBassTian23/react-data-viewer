import { useState } from 'react'

import { useForm } from 'react-hook-form'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import HelpOffCanvas from '../Main/HelpOffCanvas'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

import FilterItem, { FilterItemDateTime } from './FilterItem'

import { getFilteredData } from '../../modules/database'
import generateFilterCombinations from '../../utils/data/generateFilterCombinations';

import { useSelector, useDispatch } from 'react-redux'

import { } from '../../features/parameter.slice'
import { datasubsetAdded, datasubsetMultipleAdded } from '../../features/datasubset.slice'

export default function Filters() {

  const { register, unregister, reset, getValues, setValue, handleSubmit, resetField } = useForm();

  const [show, setShow] = useState(false)
  const [seriesCount, setSeriesCount] = useState(0)

  const state = useSelector(state => state.parameters)
  const dispatch = useDispatch()

  const resetSelection = (event) => {
    event.preventDefault()
    // Add Filter to Series
    const fields = Object.keys(getValues()) || []
    fields.forEach(element => {
      resetField(element);
    });
    reset()
  }

  return (
    <>
      <Row id='dv-filters'>
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center">
          Filter Data into Subsets
          <HelpOffCanvas title='Help | Filter Data' url='help/md/data-filter.md' />
        </Col>
        <Col sm={12}>
          <ButtonToolbar aria-label="Filters Menu">
            <ButtonGroup size='sm' className="me-2" aria-label="Apply Filter">
              <Button variant='outline-secondary' onClick={handleSubmit((data) => {
                
                if (Object.entries(data).find((item) => item[1].length > 0)) {          
                  const selection = {
                    name: Object.entries(data).filter((item) => {
                      return item[1].length > 0
                    }).map((item) => item[1] ).join(' & '),
                    count: 0,
                    isVisible: true,
                    filter: Object.entries(data).filter((item) => item[1].length > 0).map((item) => {
                      return {
                        'name': item[0],
                        'values': item[1],
                        'type': state.find( param => param.name === item[0] || param.alias === item[0] )?.specialtype || state.find( param => param.name === item[0] || param.alias === item[0] )?.type || undefined
                      }
                    })
                  }

                  selection.count = getFilteredData('data', { filters: selection.filter }).data().length

                  // Add Filter to Series
                  dispatch(datasubsetAdded(selection))

                  setSeriesCount(1)
                  setShow(true)
                  const fields = Object.keys(getValues()) || []
                  fields.forEach(element => {
                    resetField(element)
                  });
                  reset()
                }
              })}><i className='bi-union' /> Single</Button>

              <Button variant='outline-secondary' onClick={handleSubmit((data, event) => {

                if (Object.entries(data).find((item) => item[1].length > 0)) {
                  const selections = Object.entries(data).filter((item) => item[1].length > 0)
                  const filters = selections.map((item) => {
                    return {
                      'name': item[0],
                      'values': item[1],
                      'type': state.find( item => item.name === item[0] || item.alias === item[0] )?.specialtype || state.find( item => item.name === item[0] || item.alias === item[0] )?.type || undefined
                    }
                  })

                  if (selections.length > 0) {

                    const selection = generateFilterCombinations(filters).map((item) => {

                      return {
                        name: item.map((item) => item.values.join(', ')).join(' & '),
                        count: getFilteredData('data', { filters: item }).data().length,
                        isVisible: true,
                        filter: item
                      }

                    })

                    // Add Filter to Series
                    dispatch(datasubsetMultipleAdded(selection))
                    setSeriesCount(selection.length)
                    setShow(true)
                    const fields = Object.keys(getValues()) || []
                    fields.forEach(element => {
                      resetField(element)
                    });
                    reset()
                  }
                }
              })}><i className='bi-subtract' /> Separate</Button>
            </ButtonGroup>
            <ButtonGroup size='sm' className="me-2" aria-label="Selection">
              <Button variant='outline-secondary' onClick={resetSelection}><i className="bi-x-circle" /> Reset</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>

      <Row className='h-100 overflow-auto'>
        <Col sm={12} className='p-0'>
          <ListGroup as="ul" variant="flush">
            {state.map((el, idx) => {
              if (el.isFilter && el.isSelected)
                if (el.specialtype === 'date-time')
                  return (<FilterItemDateTime key={idx} index={idx} {...el} register={register} unregister={unregister} setValue={setValue} />)
                else
                  return (<FilterItem key={idx} index={idx} {...el} register={register} setValue={setValue} />)
            })}
          </ListGroup>
        </Col>
      </Row>

      <ToastContainer className="p-3" position='top-end'>
        <Toast bg='secondary' onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Header>
            <i className='bi-filter me-2' />
            <strong className="me-auto">Filter</strong>
          </Toast.Header>
          <Toast.Body >
            <i className='bi-check-circle me-2' />
            {seriesCount === 1 && <><strong>A subset</strong> has been added</>}
            {seriesCount > 1 && <><strong>{seriesCount} subsets</strong> have been added</>}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}
