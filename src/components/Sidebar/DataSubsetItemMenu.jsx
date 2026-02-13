import { useCallback } from 'react'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { useDispatch } from 'react-redux'
import { datasubsetToggled, datasubsetDblToggled } from '../../features/datasubset.slice'
import useModalConfirm from '../../hooks/useModalConfirm'

export default function DataSubsetItemMenu(props) {

  const dispatch = useDispatch();

  const modal = useModalConfirm();

  const handleDelete = useCallback(() => modal.show("confirm", {
    header: "New Analysis",
    content: `Removing Subset "${props.name}" cannot be undone.`,
    yes: "Delete",
    no: "Cancel",
    payload: {
      id: props.id,
      action: "DELETE_SUBSET"
    }
  }), [] )

  return (
    <>
      <ButtonGroup size="sm" className="data-subset-btn-group">
        <Button variant="outline-secondary" onClick={() => dispatch(datasubsetToggled(props.id))} onDoubleClick={() => dispatch(datasubsetDblToggled(props.id))}>
          {props.isVisible && <i className="bi-eye-fill" />}
          {!props.isVisible && <i className="bi-eye-slash-fill" />}
        </Button>
        <Button variant="outline-secondary" onClick={() => props.showModalEdit()} >
          <i className="bi-gear-fill" />
        </Button>
        <Button variant="outline-secondary" onClick={handleDelete} >
          <i className="bi-x-lg" />
        </Button>
      </ButtonGroup>
    </>
  )
}