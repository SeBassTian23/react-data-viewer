import React from 'react';

import FormSelect from 'react-bootstrap/FormSelect';

import { useDispatch } from 'react-redux';
import { parametersEdit } from '../../features/parameter.slice';

import { datatypeIcons } from '../../constants/datatype-icons';

export default function DatatypeItemMenu(props) {

  const dispatch = useDispatch();

  const update = ( e ) => {
    dispatch(parametersEdit({
      id: props.id,
      specialtype: e.target.value === 'unknown' ? null : e.target.value,
      isFilter: ['string', 'date-time'].indexOf(e.target.value) > -1
    }))
  }

  return (
    <>
      <FormSelect
        size='sm'
        value={props.specialtype || props.type}
        className='data-type-menu-select'
        onChange={update}
      >
        {Object.entries(datatypeIcons).map((itm, idx) => {
          return (
            <option key={idx} value={itm[0]}>{itm[0]}</option>
          )
        })}
      </FormSelect>
    </>
  )
}