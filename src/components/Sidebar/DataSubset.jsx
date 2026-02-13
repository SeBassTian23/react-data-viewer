import { useCallback, useMemo } from 'react'

import { ReactSortable } from "react-sortablejs";

import DataSubsetItem from './DataSubsetItem'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { useSelector, useDispatch } from 'react-redux';

import { getDatasetCount } from '../../modules/database'

import { datasubsetShowAll, datasubsetHideAll, datasubsetDnD, datasubsetsDeleted } from '../../features/datasubset.slice';

import useHelp from '../../hooks/useHelp';
import useModalConfirm from '../../hooks/useModalConfirm';

export default function DataSubset(props) {

  const state = useSelector(state => state.datasubsets)
  const dispatch = useDispatch()

  const help = useHelp();
  const modal = useModalConfirm();

  const showAllSeries = (event) => {
    event.preventDefault()
    // Add Filter to Series
    dispatch(datasubsetShowAll());
  }

  const hideAllSeries = (event) => {
    event.preventDefault()
    // Add Filter to Series
    dispatch(datasubsetHideAll());
  }

  const sortableList = useMemo(() => state.map(item => ({ ...item })), [state]); 

  const setList = useCallback(
    (newList) => {
      const newIds = newList.map(i => i.id);
      const oldIds = state.map(i => i.id);
      const sameOrder = newIds.every((id, idx) => id === oldIds[idx]);

      if (!sameOrder) {
        dispatch(datasubsetDnD(newList.map(i => i.id)));
      }
    },
    [dispatch, state]
  );

    
  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Data Selection", "help/md/data-subsets.md")
  },[] )

  const handleClickReset = useCallback(() => modal.show("confirm", {
    header: "Delete Subsets",
    content: `Removing "all Subsets" cannot be undone.`,
    yes: "Delete",
    no: "Cancel",
    payload: {
      id: props.id,
      action: "DELETE_SUBSETS"
    }
  }), [] )

  const handleClickDeleteHidden = useCallback(() => {
    dispatch(datasubsetsDeleted( state.filter( itm => !itm.isVisible).map(itm => itm.id) || []))
  }, [] )

  return (
    <>
      <Row id="dv-series">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center fw-bold">
          Data Selection
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
        </Col>
        <Col sm={12} className='px-2'>
          {(state.length > 0) && (
            <ButtonToolbar aria-label="Data Subsets Menu">
              <ButtonGroup size='sm' className="me-2" aria-label="Data Subsets">
                <Button variant='outline-secondary' onClick={showAllSeries}><i className='bi-eye-fill' /> Show All</Button>
                <Button variant='outline-secondary' onClick={hideAllSeries}><i className='bi-eye-slash-fill' /> Hide All</Button>
              </ButtonGroup>
              <ButtonGroup size='sm' className="me-2" aria-label="Data Subset Reset">
                <Button variant='outline-secondary' onClick={handleClickReset}><i className="bi-x-circle" /> Reset</Button>
                <DropdownButton size="sm" variant='outline-secondary'>
                  <Dropdown.Item onClick={handleClickDeleteHidden}><i className="bi bi-eye-slash-fill" /> Remove hidden</Dropdown.Item>
                </DropdownButton>
              </ButtonGroup>
            </ButtonToolbar>
          )
          }
        </Col>
      </Row>
      <Row className={`h-100 overflow-auto${(state.length === 0) ? ' align-items-center' : ''}`}>
        <Col sm={12} className='p-0'>
          {getDatasetCount('data') === 0 && <div className='text-center'>
            <i className='bi-box-arrow-in-down text-muted fs-1' />
            <span className='d-block text-muted fs-5'>Import Data</span>
            <p className='small'>To Get Started Import Data from a File.</p>
            <button className="btn btn-sm btn-primary my-2" onClick={props.setModalImport} title='Import Data'><i className='bi-box-arrow-in-down' /> Import…</button>
          </div>}
          {(getDatasetCount('data') > 0 && state.length === 0) ? (
            <div className='text-center p-3'>
              <i className='bi-clipboard-check text-muted fs-1' />
              <span className='d-block text-primary fs-5'>All Data Selected</span>
              <span className='small'>All available data is currently selected. Use the Filter <i className='bi-filter-square' />&nbsp;button to select subsets of data.</span>
            </div>
          ) :
            <ReactSortable tag='ul' handle='.bi-square-fill' className='list-group list-group-flush mt-2 scrollarea w-100' list={ sortableList } setList={ setList } direction={'vertical'} animation={200} delayOnTouchStart={true} delay={2}>
              {state.map((el, idx) => <DataSubsetItem key={idx} {...el} />)}
            </ReactSortable>
            // <ListGroup as="ul" variant="flush" className='mt-2 scrollarea w-100'>
            //   {state.map((el, idx) => <DataSubsetItem key={idx} {...el} />)}
            // </ListGroup>
          }
        </Col>
      </Row>
    </>
  )
}
