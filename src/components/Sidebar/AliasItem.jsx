import { useState } from 'react'

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import ListGroup from 'react-bootstrap/ListGroup';

import { useDispatch } from 'react-redux';
import { parametersEdit } from '../../features/parameter.slice';

import AliasItemMenu from './AliasItemMenu';

export default function AliasItem(props) {

  const [inputValue, setInputValue] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showHoverContent, setShowHoverContent] = useState(false);

  const handleSave = () => {
    if (inputValue === "")
      dispatch(parametersEdit({ id: props.id, alias: null }));
    else
      dispatch(parametersEdit({ id: props.id, alias: inputValue }));
    setShowEdit(false);
  }

  const showEditClick = (input) => {
    setShowHoverContent(false);
    setShowEdit(true);
    setInputValue(input);
  }

  const dispatch = useDispatch();

  return (
    <ListGroup.Item as="li"
      onMouseEnter={() => setShowHoverContent(true)}
      onMouseLeave={() => setShowHoverContent(false)}
      className="d-flex justify-content-between align-items-start flex-column"
      title={props.alias ? `${props.alias} (${props.name})` : props.name}
    >
      {props.alias && <span className='d-inline-block text-truncate fw-bold'>{props.alias}</span>}
      <span className={`d-inline-block text-truncate${props.alias && ' small'}`}>{props.name}</span>
      {(showHoverContent && !showEdit) && <AliasItemMenu {...props} onEditClick={() => showEditClick(props.alias || '')} />}
      {showEdit && <InputGroup size='sm' className="">
        <Form.Control as="input" size='sm' placeholder="Alias Name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyUp={(e) => { if(e.key === 'Enter') handleSave() }} />
        <InputGroup.Text as='button' onClick={handleSave}>
          <i className='bi-check' />
        </InputGroup.Text>
        <InputGroup.Text as='button' onClick={() => { setShowEdit(false); setShowHoverContent(false); }}>
          <i className='bi-x' />
        </InputGroup.Text>
      </InputGroup>
      }
    </ListGroup.Item>
  )
}
