import { useState } from "react";

import Button from 'react-bootstrap/Button'
import { ButtonGroup } from 'react-bootstrap';

import { useDispatch } from 'react-redux';

import { dashboardAddMultiplePanels } from '../../features/dashboard.slice'
import { datasubsetMultipleAdded, datasubsetReset } from '../../features/datasubset.slice'
import { mapApplySettings } from '../../features/map.slice'
import { parametersAddBackup } from '../../features/parameter.slice'
import { plotUpdate } from '../../features/plot.slice'
import { thresholdAddBackup } from '../../features/threshold.slice'

import ModalDialogConfirm from '../Dialogs/ModalDialogConfirm'

import { getSingleDatumByField } from '../../modules/database'

export default function BookmarkItemMenu(props) {

  const dispatch = useDispatch()

  const [modalShow, setModalShow] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);

  function BookmarkApply(id, props) {

    let analysis = getSingleDatumByField(id, 'id', 'bookmarks');

    if (analysis && analysis.store !== undefined) {
      if (analysis.store.dashboard !== undefined)
        dispatch(dashboardAddMultiplePanels(analysis.store.dashboard))
      if (analysis.store.datasubsets !== undefined) {
        dispatch(datasubsetReset())
        dispatch(datasubsetMultipleAdded(analysis.store.datasubsets))
      }
      if (analysis.store.map !== undefined)
        dispatch(mapApplySettings(analysis.store.map))
      if (analysis.store.parameters !== undefined)
        dispatch(parametersAddBackup(analysis.store.parameters))
      if (analysis.store.plot !== undefined)
        dispatch(plotUpdate(analysis.store.plot))
      if (analysis.store.thresholds !== undefined)
        dispatch(thresholdAddBackup(analysis.store.thresholds))

      props.setMessage({
        ...props.message,
        body: <>Selected bookmark applied</>,
        header: "Bookmark",
        icon: 'bi-journal-bookmark-fill',
        status: 'secondary'
      });
    }

    else{
      props.setMessage({
        ...props.message,
        body: <>Failed to apply bookmark</>,
        header: "Bookmark",
        icon: 'bi-journal-bookmark-fill',
        status: 'danger'
      });
    }

    props.setShow(true);

  }

  return (
    <>
      <ButtonGroup size="sm" className='bg-white bookmark-menu-btn-group' >
        <Button variant="outline-secondary" onClick={() => setModalShow(true)} >
          <i className="bi-journal-arrow-up" />
        </Button>
        <Button variant="outline-secondary" onClick={props.onEditClick} >
          <i className="bi-input-cursor-text" />
        </Button>
        <Button variant="outline-secondary" onClick={() => setModalDeleteShow(true)} >
          <i className="bi-bookmark-x" />
        </Button>
      </ButtonGroup>

      <ModalDialogConfirm
        show={modalShow}
        onHide={(confirmed) => {
          setModalShow(false);
          if (confirmed) {
            BookmarkApply(props.id, props);
          }
        }
        }
        header="Load Bookmark"
        content={<>Make sure to save your current work as a <strong>New Bookmark</strong> before loading selected Bookmark.</>}
        yes="Continue"
        no="Cancel"
      />

      <ModalDialogConfirm
        show={modalDeleteShow}
        onHide={(confirmed) => {
          setModalDeleteShow(false);
          if (confirmed) {
            props.deleteBookmark(props.id);
          }
        }
        }
        header="Delete Bookmark"
        content={<>Removing <strong>"{props.name || "Unknown"}"</strong> cannot be undone.</>}
        yes="Delete"
        no="Cancel"
      />
    </>
  )
}
