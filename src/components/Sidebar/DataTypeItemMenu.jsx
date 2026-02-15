import FormSelect from 'react-bootstrap/FormSelect';

import { useDispatch } from 'react-redux';
import { parametersEdit } from '../../features/parameter.slice';
import { getFilteredData, getUnique } from '../../modules/database'
import { getFilterData } from '../../utils/data/parameter'

import { datatypeIcons } from '../../constants/datatype-icons';

export default function DatatypeItemMenu(props) {

  const dispatch = useDispatch();

  const update = ( e ) => {
    const query = getFilteredData('data', { filters: [], dropna: [props.name], sortby: props.name })
    const col = getUnique(query.data({ removeMeta: true }), props.name)
    dispatch(parametersEdit({
      id: props.id,
      specialtype: e.target.value === 'unknown' ? null : e.target.value,
      isFilter: ['string', 'date-time'].indexOf(e.target.value) > -1,
      filterData: getFilterData(col, e.target.value)
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