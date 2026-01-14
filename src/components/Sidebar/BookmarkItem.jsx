import { useState } from 'react'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import BookmarkItemMenu from './BookmarkItemMenu'

import { useDispatch } from 'react-redux';
import { bookmarkEdit } from '../../features/bookmark.slice';

import { updateDocByField, saveDatabase } from '../../modules/database'

dayjs.extend(localizedFormat)

export default function BookmarkItem(props) {

  const [inputValue, setInputValue] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showHoverContent, setShowHoverContent] = useState(false);

  const handleSave = () => {
    let nameUpdated = null
    if (inputValue !== "")
      nameUpdated = inputValue
  
    updateDocByField('id', props.id,  {name: nameUpdated},  'bookmarks');
    dispatch(bookmarkEdit({ id: props.id, name: nameUpdated }));

    saveDatabase();

    setShowEdit(false);
  }

  const showEditClick = (input) => {
    setShowHoverContent(false);
    setShowEdit(true);
    setInputValue(input);
  }

  const dispatch = useDispatch();

  return (
    <ListGroup.Item as="li" className='list-group-item'
      onMouseEnter={() => setShowHoverContent(true)}
      onMouseLeave={() => setShowHoverContent(false)}
      title={props.name}
    >
      <span className="d-flex align-items-left">
        <span className='text-nowrap'>
          <i className="bi-bookmark-check" /> {props.name}
        </span>
      </span>
      {props?.creator && <>{props.creator?.avatar? <img src={props.creator.avatar} className='rounded-circle bookmark-avatar' /> : <i className='bi bi-person-circle' />} <span className='text-muted'>{props.creator?.name}</span></> }
      <ul className='list-inline text-muted bookmark-ul-icons'>
        <li className='list-inline-item'><i className='bi-columns-gap' /> {props.dashboard}</li>
        <li className='list-inline-item'><i className='bi-filter' /> {props.datasubsets}</li>
        <li className='list-inline-item'><i className='bi-bar-chart-steps' /> {props.thresholds}</li>
        <li className='list-inline-item'>
          <i className='bi bi-calendar-event' /> <span className='text-muted'>{dayjs(props.created_at).format('l LT')}</span>
        </li>
      </ul>
      {(showHoverContent && !showEdit) && <BookmarkItemMenu {...props} onEditClick={() => showEditClick(props.bookmark || '')} /> }
      {showEdit && <InputGroup size='sm' className="">
        <Form.Control as="input" size='sm' placeholder="Bookmark Name"  value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyUp={(e) => { if(e.key === 'Enter') handleSave() }} />
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
