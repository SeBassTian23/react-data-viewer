import { useEffect, useState, useMemo, useCallback } from 'react'

import Form from 'react-bootstrap/Form'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ListGroup from 'react-bootstrap/ListGroup'

import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(minMax)

import { getFilteredData, getUnique } from '../../modules/database'

export default function FilterItem(props) {

  const [toggle, setToggle] = useState(false);

  // Memoize the click handler
  const handleToggle = useCallback(() => {
    props.setValue(props.name, []);
    setToggle(prev => !prev);
  }, [props.name, props.setValue])

  return (
    <ListGroup.Item as="li" className='list-group-item-action'>
      <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={handleToggle}>
        <span>
          {toggle ? <i className='bi-caret-down-fill small' /> : <i className='bi-caret-right-fill small' />}
          {' '}<span className={toggle ? 'fw-bold' : ''}>{props.alias? props.alias : props.name}</span>
        </span>
        <span className='badge text-bg-light'>{props?.filterData?.unique? props.filterData.unique.length : '0'}</span>
      </div>
      <Form.Select
        size="sm"
        htmlSize={4}
        multiple={true}
        {...props.register(props.name)}
        className={`mt-2 ${ toggle ? 'd-block' : 'd-none' }`}
      >
        {props?.filterData?.unique && props.filterData.unique.map((el, idx) => {
          return (<option key={idx} value={el}>{el}</option>)
        })}
      </Form.Select>

    </ListGroup.Item>
  )
}

export function FilterItemDateTime(props) {

  const [toggle, setToggle] = useState(false);
  const [inputtype, setInputtype] = useState('datetime-local');
  const [datetimerange, setDatetimerange] = useState(false);
  const [inputformat, setInputformat] = useState('YYYY-MM-DDTHH:mm');
  const [inputmin, setInputmin] = useState('');
  const [inputmax, setInputmax] = useState('');

  /* Get unique parameter values - memoized for performance */
  const { min, max } = useMemo(() => {

    if(!props?.filterData){
      const query = getFilteredData('data', { filters: [], dropna: [props.name], sortby: props.name })
      const uniqueData = getUnique(query.data({ removeMeta: true }), props.name)
      const minVal = dayjs.min(uniqueData.map(e => dayjs(e)))
      const maxVal = dayjs.max(uniqueData.map(e => dayjs(e)))
      return { min: minVal, max: maxVal}
    }
    return { min: props.filterData.min || null, max: props.filterData.max || null }
  }, [props.name])

  /* Update format and reset inputs when input type changes */
  useEffect(() => {
    let newFormat = 'YYYY-MM-DDTHH:mm';
    if(inputtype === 'date')
      newFormat = 'YYYY-MM-DD';
    else if(inputtype === 'time')
      newFormat = 'HH:mm';
    
    setInputformat(newFormat);
    // Reset inputs to avoid format conflicts
    setInputmin('');
    setInputmax('');
  }, [inputtype]);

  /* Set initial min/max values based on format */
  useEffect(() => {
    setInputmin(dayjs(min).format(inputformat));
    setInputmax(dayjs(max).format(inputformat));
  }, [inputformat, min, max]);

  /* Update form values when inputs change */
  useEffect(() => {
    if(toggle) {
      props.setValue(`${props.name}.0`, inputmin);
      if(datetimerange)
        props.setValue(`${props.name}.1`, inputmax);
    }
  }, [inputmin, inputmax, toggle, datetimerange, props.name, props.setValue]);

  /* Handle range toggle */
  useEffect(() => {
    if(!datetimerange) {
      props.unregister(`${props.name}.1`);
    } else {
      props.setValue(`${props.name}.1`, inputmax);
    }
  }, [datetimerange, props.name, inputmax, props.setValue, props.unregister]);

  /* Handle main toggle */
  useEffect(() => {
    if(!toggle) {
      props.unregister(`${props.name}.0`);
      props.unregister(`${props.name}.1`);
    } else {
      props.setValue(`${props.name}.0`, inputmin);
      if(datetimerange)
        props.setValue(`${props.name}.1`, inputmax);
    }
  }, [toggle, props.name, inputmin, inputmax, datetimerange, props.setValue, props.unregister]);

  const handleToggle = useCallback(() => {
    setToggle(prev => !prev);
  }, []);

  const handleRangeChange = useCallback(() => {
    setDatetimerange(prev => !prev);
  }, []);

  return (
    <ListGroup.Item as="li" className='list-group-item-action'>
      <div className="d-flex justify-content-between align-items-center" role="button" onClick={handleToggle}>
        <span>
          {toggle ? <i className='bi-caret-down-fill' /> : <i className='bi-caret-right-fill' />}
          {' '}{props.name}
        </span>
        <span className='badge text-bg-light'><i className='bi bi-calendar-range' /></span>
      </div>
      
      <div className={toggle ? 'd-block' : 'd-none' }>
        <ButtonGroup size='sm'>
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked={true} onClick={() => setInputtype('datetime-local')} />
          <label className="btn btn-outline-secondary filter-datetime-btn" htmlFor="btnradio1">Date-Time</label>
          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" onClick={() => setInputtype('date')} />
          <label className="btn btn-outline-secondary filter-datetime-btn" htmlFor="btnradio2">Date</label>
          <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" onClick={() => setInputtype('time')}/>
          <label className="btn btn-outline-secondary filter-datetime-btn" htmlFor="btnradio3">Time</label>
        </ButtonGroup>

        <Form.Check
            inline
            type="switch"
            label="Range"
            size={'sm'}
            className='ms-3 mt-2 small'
            onChange={handleRangeChange}
          />

        {toggle && <input
          type={inputtype}
          {...props.register(`${props.name}.0`)}
          className='mt-2 form-control form-control-sm'
          min={inputmin}
          max={inputmax}
        />
        }

        {(toggle && datetimerange) && <>
          <i className='bi bi-arrow-down d-block text-center' />
          <input
            type={inputtype}
            {...props.register(`${props.name}.1`)}
            className='mt-0 form-control form-control-sm'
            min={inputmin}
            max={inputmax}
          /> 
        </>
        }

      </div>

    </ListGroup.Item>
  )
}