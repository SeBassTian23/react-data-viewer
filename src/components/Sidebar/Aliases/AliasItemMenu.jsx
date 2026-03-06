import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { useDispatch } from 'react-redux';
import { parametersEdit } from '../../../features/parameter.slice';

export default function AliasItemMenu({id, alias, onEditClick, ...props}) {

  const dispatch = useDispatch();

  const handleDelete = () => dispatch(parametersEdit({ id, alias: null }));

  return (
    <ButtonGroup size="sm" className='bg-white alias-menu-select'>
      <Button variant="outline-secondary" onClick={onEditClick} >
        <i className="bi bi-input-cursor-text" />
      </Button>
      {alias && <Button variant="outline-secondary" onClick={handleDelete} >
        <i className="bi bi-trash-fill" />
      </Button>}
    </ButtonGroup>
  )
}
