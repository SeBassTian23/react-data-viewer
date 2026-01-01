import { useCallback } from 'react'
import { useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

import BookmarkItem from './BookmarkItem'

import useHelp from '../../hooks/useHelp';
import useModal from '../../hooks/useModalConfirm';
import { useAddBookmark } from '../../hooks/useAddBookmark';

export default function Bookmarks(props) {

  const state = useSelector(state => state.bookmarks) || []; 

  const help = useHelp();
  const modal = useModal();
  const addBookmark = useAddBookmark();

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Bookmarks", "help/md/bookmarks.md")
  },[] )

  const handleClickReset = useCallback( () => modal.show("confirm", {
    header: "Delete Bookmarks",
    content: `Removing "all Bookmarks" cannot be undone.`,
    yes: "Delete",
    no: "Cancel",
    payload: {
      id: props.id,
      action: "DELETE_BOOKMARKS"
    }
  }), [])

  const handleClickSave = useCallback( () => addBookmark(), []);

  return (
    <>
      <Row id="dv-bookmarks">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center fw-bold">
          Bookmarks
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
        </Col>
        <Col sm={12} className='mb-2'>
          <ButtonToolbar aria-label="Bookmark Menu">
            <ButtonGroup size='sm' className="me-2">
              <Button variant='outline-secondary' onClick={handleClickSave}><i className='bi-bookmark-plus' /> Save Bookmark</Button>
              <Button variant='outline-secondary' onClick={handleClickReset}><i className='bi-x-circle' /> Reset</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row className='h-100 overflow-auto'>
        <Col sm={12} className='p-0'>
          <ListGroup as="ul" variant="flush">
            {state.map((itm) => (
              <BookmarkItem key={itm.id} {...itm} {...props} />
            )).reverse()}
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}
