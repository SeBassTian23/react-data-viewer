import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'

import BookmarkItem from './BookmarkItem'
import ModalDialogConfirm from '../Dialogs/ModalDialogConfirm'

import useHelp from '../../hooks/useHelp';

export default function Bookmarks(props) {

  const state = useSelector(state => state.bookmarks) || []; 

  const [modalShow, setModalShow] = useState(false);

  const help = useHelp();

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Bookmarks", "help/md/bookmarks.md")
  },[] )

  return (
    <>
      <Row id="dv-bookmarks">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center">
          Bookmarks
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
        </Col>
        <Col sm={12} className='mb-2'>
          <ButtonToolbar aria-label="Bookmark Menu">
            <ButtonGroup size='sm' className="me-2">
              <Button variant='outline-secondary' onClick={props.saveBookmark}><i className='bi-bookmark-plus' /> Save Bookmark</Button>
              <Button variant='outline-secondary' onClick={() => setModalShow(true)}><i className='bi-x-circle' /> Reset</Button>
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

      <ModalDialogConfirm
        show={modalShow}
        onHide={(confirmed) => {
          setModalShow(false);
          if (confirmed)
            props.resetBookmarks()
        }
        }
        header="Delete Bookmarks"
        content={<>Removing <strong>all Bookmarks</strong> cannot be undone.</>}
        yes="Delete"
        no="Cancel"
      />

    </>
  )
}
