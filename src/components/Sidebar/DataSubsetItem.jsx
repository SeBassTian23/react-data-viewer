import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import { getFilteredData } from '../../modules/database'

import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

import tinycolor from 'tinycolor2'

import ModalDialogEditSubset from '../Dialogs/ModalDialogEditSubset'
import DataSubsetItemMenu from './DataSubsetItemMenu'

import { useDispatch } from 'react-redux'
import { datasubsetToggled } from '../../features/datasubset.slice'
import {selectedThresholds} from '../../store/thresholds';

export default function DataSubsetItem(props) {

  const thresholds = useSelector(selectedThresholds)

  const [count, setCount] = useState(props.count || 0);

  const [showHoverContent, setShowHoverContent] = useState(false);

  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  useEffect(() => {
    let query = getFilteredData('data', { filters: props.filter, thresholds }).data().length
    setCount(query)
  }, [thresholds, props.filter])

  return (
    <>
      <ListGroup.Item as="li" className="d-flex justify-content-between align-items-center"
        onMouseEnter={() => setShowHoverContent(true)}
        onMouseLeave={() => setShowHoverContent(false)}
        onDoubleClick={() => dispatch(datasubsetToggled(props.id))}
        title={`${props.name}${props.count !== count ? ` [${count}/${props.count}]` : ` [${props.count}]`}`}
        style={props.isVisible ? { background: `linear-gradient(90deg, ${tinycolor(props.color).setAlpha(.2)} 5%, transparent 50%)` } : {}}
      >
        <span className="d-inline-block text-truncate" style={!props.isVisible ? { 'opacity': 0.25 } : {}}>
          <i className="bi-square-fill " style={{ "color": props.color }} /> {props.name || "Unknown"}
        </span>
        {showHoverContent && (
          <DataSubsetItemMenu {...props} showModalEdit={handleShow} setModalShow={setModalShow} />
        )}
        {!showHoverContent && (
          <Badge bg={props.count !== count ? "danger" : "secondary"} style={!props.isVisible ? { 'opacity': 0.25 } : {}}>{props.count !== count? count : props.count}</Badge>
        )}
      </ListGroup.Item>
      <ModalDialogEditSubset show={show} onHide={handleClose} {...props} />
    </>
  )
}
