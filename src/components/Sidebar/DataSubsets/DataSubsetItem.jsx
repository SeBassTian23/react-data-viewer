import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import ListGroup from 'react-bootstrap/ListGroup'

import tinycolor from 'tinycolor2'

import ModalDialogEditSubset from '../../Dialogs/ModalDialogEditSubset'
import DataSubsetItemMenu from './DataSubsetItemMenu'

import { useDispatch } from 'react-redux'
import { datasubsetToggled } from '../../../features/datasubset.slice'
import {selectedThresholds} from '../../../store/thresholds';
import useGetFilteredData from '../../../hooks/useGetFilteredData'
import useHoverMenu from '../../../hooks/useHoverMenu'

export default function DataSubsetItem(props) {

  const thresholds = useSelector(selectedThresholds)
  const stateFlags = useSelector(state => state.flags)
  const parameters = useSelector(state => state.parameters)

  const [count, setCount] = useState(props.count || 0);

  const [showHoverContent, setShowHoverContent] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();
  const { getFilteredData } = useGetFilteredData();

  useEffect(() => {
    let query = getFilteredData('data', { filters: props.filter, thresholds })
    query = query.data().length
    setCount(query)
  }, [thresholds, props.filter, stateFlags.checksum])

  const { handleMouseEnter, handleMouseLeave } = useHoverMenu(setShowHoverContent, 250);  

  return (
    <>
      <ListGroup.Item as="li" className="d-flex justify-content-between align-items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={() => dispatch(datasubsetToggled(props.id))}
        title={`${props.name}${props.count !== count ? ` [${count}/${props.count}]` : ` [${props.count}]`}`}
        style={props.isVisible ? { background: `linear-gradient(90deg, ${tinycolor(props.color).setAlpha(.2)} 5%, transparent 50%)` } : {}}
      >
        <i className="bi bi-square-fill " style={{ "color": props.color, 'opacity': props.isVisible? 1 : 0.25  }} />
        <span className='d-flex flex-column flex-grow-1 overflow-hidden ps-2' style={!props.isVisible ? { 'opacity': 0.25 } : {}}>
          <span className="d-inline-block text-truncate">
            {props.name || "Unknown"}
          </span>
          <small className="d-inline-block text-truncate fw-light text-body-secondary">
            <i className="bi bi-filter" /> {props.filter.map(itm => itm.name === "$loki"? "Selected Rows" : parameters.find(p => p.name == itm.name )?.alias || itm.name).join(', ')}
            {props.filter.length == 0 && "No filters"}
          </small>
        </span>
        <span className={`align-self-start text-nowrap font-monospace text-${props.count !== count ? " text-danger" : ""}`} style={!props.isVisible ? { 'opacity': 0.25, fontSize: 'small' } : {fontSize: 'small'}}><i className='bi bi-database' />{props.count !== count? count : props.count}</span>
        {showHoverContent && (
          <DataSubsetItemMenu {...props} showModalEdit={handleShow} />
        )}
      </ListGroup.Item>
      {show && <ModalDialogEditSubset show={show} onHide={handleClose} {...props} />}
    </>
  )
}
