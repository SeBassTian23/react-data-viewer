import { useEffect, useState, useCallback } from 'react'

import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit';

import { getFilteredData } from '../../modules/database'

import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Badge from 'react-bootstrap/Badge'

import tinycolor from 'tinycolor2'

import ModalDialogEditSubset from '../Dialogs/ModalDialogEditSubset'

import { useDispatch } from 'react-redux'
import { datasubsetToggled, datasubsetDblToggled } from '../../features/datasubset.slice'
import useModalConfirm from '../../hooks/useModalConfirm'

import {selectedThresholds} from '../../store/thresholds';

export default function DataSubsetItem(props) {

  const thresholds = useSelector(selectedThresholds)

  const [count, setCount] = useState(props.count || 0);

  const [showHoverContent, setShowHoverContent] = useState(false);

  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    let query = getFilteredData('data', { filters: props.filter, thresholds }).data().length
    setCount(query)
  }, [thresholds, props.filter])

  return (
    <>
      <ListGroup.Item as="li" className="d-flex justify-content-between align-items-center"
        onMouseEnter={() => setShowHoverContent(true)}
        onMouseLeave={() => setShowHoverContent(false)}
        title={`${props.name}${props.count !== count ? ` [${count}/${props.count}]` : ` [${props.count}]`}`}
        style={props.isVisible ? { background: `linear-gradient(90deg, ${tinycolor(props.color).setAlpha(.2)} 5%, transparent 50%)` } : {}}
      >
        <span className="d-inline-block text-truncate" style={!props.isVisible ? { 'opacity': 0.25 } : {}}>
          <i className="bi-square-fill " style={{ "color": props.color }} /> {props.name || "Unknown"}
        </span>
        {showHoverContent && (
          <DataSubsetMenu {...props} showModalEdit={handleShow} setModalShow={setModalShow} />
        )}
        {!showHoverContent && (
          <Badge bg={props.count !== count ? "danger" : "secondary"} style={!props.isVisible ? { 'opacity': 0.25 } : {}}>{props.count !== count? count : props.count}</Badge>
        )}
      </ListGroup.Item>
      <ModalDialogEditSubset show={show} onHide={handleClose} {...props} />
    </>
  )
}

function DataSubsetMenu(props) {

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
