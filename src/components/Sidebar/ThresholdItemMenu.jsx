import { useCallback } from 'react';

import Button from 'react-bootstrap/Button'
import { ButtonGroup } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import { thresholdToggle } from '../../features/threshold.slice';
import useModalConfirm from '../../hooks/useModalConfirm';

export default function ThresholdItemMenu(props) {

  const dispatch = useDispatch()
  const modal = useModalConfirm()

  const handleDelete = useCallback(() => modal.show("confirm", {
    header: "Delete Threshold",
    content: `Removing Thresholds for "${props.name || "Unknown"}" cannot be undone.`,
    yes: "Delete",
    no: "Cancel",
    payload: {
      id: props.id,
      action: "DELETE_THRESHOLD"
    }
  }), [] )

  const handleToggle = () => dispatch(thresholdToggle(props.id))

  return (
    <>
      <ButtonGroup size="sm" className="threshold-menu-select">
        <Button variant="outline-secondary" onClick={handleDelete} >
          <i className="bi-x-lg" />
        </Button>
        <Button variant="outline-secondary" onClick={handleToggle} >
          {props.isSelected && <i className="bi-toggle-on" />}
          {!props.isSelected && <i className="bi-toggle-off" />}
        </Button>
      </ButtonGroup>
    </>
  )
}