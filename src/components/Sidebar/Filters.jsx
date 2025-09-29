import { useCallback } from 'react'

import { useForm } from 'react-hook-form'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'

import FilterItem, { FilterItemDateTime } from './FilterItem'

import { getFilteredData } from '../../modules/database'
import generateFilterCombinations from '../../utils/data/generateFilterCombinations';

import { useSelector, useDispatch } from 'react-redux'

import { } from '../../features/parameter.slice'
import { datasubsetAdded, datasubsetMultipleAdded } from '../../features/datasubset.slice'

import useToast from "../../hooks/useToast";
import useHelp from '../../hooks/useHelp';

export default function Filters() {

  const { register, unregister, reset, getValues, setValue, handleSubmit, resetField } = useForm();

  const state = useSelector(state => state.parameters)
  const dispatch = useDispatch();

  const toast = useToast()
  const help = useHelp();


  const resetSelection = (event) => {
    event.preventDefault()
    // Add Filter to Series
    const fields = Object.keys(getValues()) || []
    fields.forEach(element => {
      resetField(element);
    });
    reset()
  }

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Filter Data", "help/md/data-filter.md")
  },[] )

  return (
    <>
      <Row id='dv-filters'>
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center">
          Filter Data into Subsets
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
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

                  toast.success( "A subset has been added" , "Filter", "bi-filter");
                  
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

                    toast.success( selection.length === 1? "A subset has been added" : `${selection.length} subsets have been added` , "Filter", "bi-filter");

                    const fields = Object.keys(getValues()) || []
                    fields.forEach(element => {
                      resetField(element)
                    });
                    reset();
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
    </>
  )
}
