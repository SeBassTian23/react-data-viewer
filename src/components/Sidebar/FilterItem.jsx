import { useEffect, useState } from 'react'

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

  /* Get unique parameter values */
  let query = getFilteredData('data', { filters: [], dropna: [props.name], sortby: props.name })
  let unique = getUnique(query.data({ removeMeta: true }), props.name)

  return (
    <ListGroup.Item as="li" className='list-group-item-action'>
      <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={() => { props.setValue(props.name, []); setToggle(!toggle) }}>
        <span>
          {toggle ? <i className='bi-caret-down-fill small' /> : <i className='bi-caret-right-fill small' />}
          {' '}<span className={toggle && 'fw-bold'}>{props.alias? props.alias : props.name}</span>
        </span>
        <span className='badge text-bg-light'>{unique.length}</span>
      </div>
      <Form.Select
        size="sm"
        htmlSize={4}
        multiple={true}
        {...props.register(props.name)}
        style={{ 'display': toggle ? 'block' : 'none' }}
        className='mt-2'
      >
        {unique.map((el, idx) => {
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
  const [inputmin, setInputmin] = useState();
  const [inputmax, setInputmax] = useState();

  /* Get unique parameter values */
  let query = getFilteredData('data', { filters: [], dropna: [props.name], sortby: props.name })
  let unique = getUnique(query.data({ removeMeta: true }), props.name)

  const min = dayjs.min(unique.map(e => dayjs(e)))
  const max = dayjs.max(unique.map(e => dayjs(e)))

  useEffect( () => {
    // Set all to empty to avoid format-input conflict warnings
    setInputmin('')
    setInputmax('')
    if(inputtype === 'datetime-local')
      setInputformat('YYYY-MM-DDTHH:mm')
    if(inputtype === 'date')
      setInputformat('YYYY-MM-DD')
    if(inputtype === 'time')
      setInputformat('HH:mm')
  },[inputtype]);

  useEffect( () => {
    setInputmin(dayjs(min).format(inputformat))
    setInputmax(dayjs(max).format(inputformat))
  },[inputformat])

  useEffect( () => {
    if(toggle){
      props.setValue(`${props.name}.0`, inputmin);
      if(datetimerange)
        props.setValue(`${props.name}.1`, inputmax);
    }
  },[inputmin,inputmax])

  useEffect( () => {
    if(!datetimerange)
      props.unregister(`${props.name}.1`);
    else{
      props.setValue(`${props.name}.1`, inputmax);
    }
  },[datetimerange])

  useEffect( () => {
    if(!toggle){
      props.unregister(`${props.name}.0`);
      props.unregister(`${props.name}.1`);
    }
    else{
      props.setValue(`${props.name}.0`, inputmin);
      if(datetimerange)
        props.setValue(`${props.name}.1`, inputmax);
    }
  },[toggle])

  return (
    <ListGroup.Item as="li" className='list-group-item-action'>
      <div className="d-flex justify-content-between align-items-center" style={{ 'cursor': 'pointer' }} onClick={() => setToggle(!toggle)}>
        <span>
          {toggle ? <i className='bi-caret-down-fill' /> : <i className='bi-caret-right-fill' />}
          {' '}{props.name}
        </span>
        <span className='badge text-bg-light'><i className='bi bi-calendar-range' /></span>
      </div>
      
      <div style={{ 'display': toggle ? 'block' : 'none' }}>
        <ButtonGroup size='sm'>
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked={true} onClick={() => setInputtype('datetime-local')} />
          <label className="btn btn-outline-secondary" htmlFor="btnradio1" style={{padding: '0.2rem 0.35rem', fontSize: '0.75rem'}}>Date-Time</label>
          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" onClick={() => setInputtype('date')} />
          <label className="btn btn-outline-secondary" htmlFor="btnradio2" style={{padding: '0.2rem 0.35rem', fontSize: '0.75rem'}}>Date</label>
          <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" onClick={() => setInputtype('time')}/>
          <label className="btn btn-outline-secondary" htmlFor="btnradio3" style={{padding: '0.2rem 0.35rem', fontSize: '0.75rem'}}>Time</label>
        </ButtonGroup>

        <Form.Check
            inline
            type="switch"
            label="Range"
            size={'sm'}
            className='ms-3 mt-2'
            style={{fontSize: 'small'}}
            onChange={()=>setDatetimerange( e => !e)}
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