import { useState } from 'react';

import Button from 'react-bootstrap/Button'
import { ButtonGroup } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import { thresholdToggle, thresholdDelete } from '../../features/threshold.slice';

import ModalDialogConfirm from '../Dialogs/ModalDialogConfirm';

export default function ThresholdItemMenu(props) {

  const dispatch = useDispatch()

  const [modalDeleteShow, setModalDeleteShow] = useState(false);

  return (
    <>
      <ButtonGroup size="sm" className="threshold-menu-select">
        <Button variant="outline-secondary" onClick={() => setModalDeleteShow(true)} >
          <i className="bi-x-lg" />
        </Button>
        <Button variant="outline-secondary" onClick={() => dispatch(thresholdToggle(props.id))} >
          {props.isSelected && <i className="bi-toggle-on" />}
          {!props.isSelected && <i className="bi-toggle-off" />}
        </Button>
      </ButtonGroup>

      <ModalDialogConfirm
        show={modalDeleteShow}
        onHide={(confirmed) => {
          setModalDeleteShow(false);
          if (confirmed) {
            dispatch(thresholdDelete(props.id))
          }
        }
        }
        header="Delete Threshold"
        content={<>Removing Thresholds for <strong>"{props.name || "Unknown"}"</strong> cannot be undone.</>}
        yes="Delete"
        no="Cancel"
      />
    </>
  )
}