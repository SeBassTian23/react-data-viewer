import { useCallback } from "react";

import Button from 'react-bootstrap/Button'
import { ButtonGroup } from 'react-bootstrap';

import useModalConfirm from "../../hooks/useModalConfirm";

export default function BookmarkItemMenu(props) {
  
  const modal = useModalConfirm();

  const handleClickApply = useCallback( () => modal.show("confirm", {
    header: "Load Bookmark",
    content: `Make sure to save your current work as a "New Bookmark" before loading selected Bookmark`,
    yes: "Continue",
    no: "Cancel",
    payload: {
      id: props.id,
      action: "APPLY_BOOKMARK"
    }
  }), [])

  const handleClickDelete = useCallback( () => modal.show("confirm", {
    header: "Delete Bookmark",
    content: `Removing "${props.name || "Unknown"}" cannot be undone.`,
    yes: "Delete",
    no: "Cancel",
    payload: {
      id: props.id,
      action: "DELETE_BOOKMARK"
    }
  }), [])


  return (
    <>
      <ButtonGroup size="sm" className='bg-white bookmark-menu-btn-group' >
        <Button variant="outline-secondary" onClick={handleClickApply} >
          <i className="bi-journal-arrow-up" />
        </Button>
        <Button variant="outline-secondary" onClick={props.onEditClick} >
          <i className="bi-input-cursor-text" />
        </Button>
        <Button variant="outline-secondary" onClick={handleClickDelete} >
          <i className="bi-bookmark-x" />
        </Button>
      </ButtonGroup>
    </>
  )
}
