import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import { getFilteredData } from '../../modules/database'

import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Badge from 'react-bootstrap/Badge'

import tinycolor from 'tinycolor2'

import ModalDialogConfirm from '../Dialogs/ModalDialogConfirm'
import ModalDialogEditSubset from '../Dialogs/ModalDialogEditSubset'

import { useDispatch } from 'react-redux'
import { datasubsetToggled, datasubsetDblToggled, datasubsetDeleted } from '../../features/datasubset.slice'

export default function DataSubsetItem(props) {

  const dataSubsets = useSelector(state => state.datasubsets)
  const stateThresholds = useSelector(state => state.thresholds)
  const thresholds = stateThresholds.filter((itm) => itm.isSelected)

  const [count, setCount] = useState(props.count || 0);

  const [showHoverContent, setShowHoverContent] = useState(false);

  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const dispatch = useDispatch()

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    let query = getFilteredData('data', { filters: props.filter, thresholds }).data().length
    setCount(query)
  }, [stateThresholds,dataSubsets])

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
      <ModalDialogConfirm
        show={modalShow}
        onHide={(confirmed) => {
          setModalShow(false);
          if (confirmed)
            dispatch(datasubsetDeleted(props.id))
        }
        }
        header="Delete Subset"
        content={<>Removing Subset <strong>"{props.name}"</strong> cannot be undone.</>}
        yes="Delete"
        no="Cancel"
      />
    </>
  )
}

function DataSubsetMenu(props) {

  const dispatch = useDispatch()

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
        <Button variant="outline-secondary" onClick={() => props.setModalShow(true)} >
          <i className="bi-x-lg" />
        </Button>
      </ButtonGroup>
    </>
  )
}
