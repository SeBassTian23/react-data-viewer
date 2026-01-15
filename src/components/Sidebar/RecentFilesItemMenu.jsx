import { useCallback } from "react";

import Button from 'react-bootstrap/Button'
import { ButtonGroup } from 'react-bootstrap';

import useModalConfirm from "../../hooks/useModalConfirm";

export default function RecentFilesItemMenu(props) {
  
  const modal = useModalConfirm();

  const handleClickDelete = useCallback( () => modal.show("confirm", {
    header: "Delete Recent Analysis from Cache",
    content: `Removing "${props.name || "Unknown"}" cannot be undone.`,
    yes: "Delete",
    no: "Cancel",
    payload: {
      filename: props.file,
      action: "DELETE_CACHED_ANALYSIS"
    }
  }), [])

  return (
    <>
      <ButtonGroup size="sm" className='bg-white bookmark-menu-btn-group' >
        <Button variant="outline-secondary" onClick={(e) => {e.stopPropagation(); handleClickDelete()}} >
          <i className="bi-journal-x" />
        </Button>
      </ButtonGroup>
    </>
  )
}
