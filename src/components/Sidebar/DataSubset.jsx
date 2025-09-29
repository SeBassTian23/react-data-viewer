import { useState, useCallback } from 'react'

import { ReactSortable } from "react-sortablejs";

import DataSubsetItem from './DataSubsetItem'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ModalDialogConfirm from '../Dialogs/ModalDialogConfirm'

import { useSelector, useDispatch } from 'react-redux';

import { getDatasetCount } from '../../modules/database'

import { datasubsetReset, datasubsetShowAll, datasubsetHideAll, datasubsetDnD } from '../../features/datasubset.slice';

import useHelp from '../../hooks/useHelp';

export default function DataSubset(props) {

  const state = useSelector(state => state.datasubsets)
  const dispatch = useDispatch()

  const help = useHelp();

  const [modalShow, setModalShow] = useState(false);

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

  const setList = (request, obj, dragging ) => {
    dispatch( datasubsetDnD(request) )
  }
    
  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Data Selection", "help/md/data-subsets.md")
  },[] )

  return (
    <>
      <Row id="dv-series">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center">
          Data Selection
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
        </Col>
        <Col sm={12}>
          {(state.length > 0) && (
            <ButtonToolbar aria-label="Data Subsets Menu">
              <ButtonGroup size='sm' className="me-2" aria-label="Data Subsets">
                <Button variant='outline-secondary' onClick={showAllSeries}><i className='bi-eye-fill' /> Show All</Button>
                <Button variant='outline-secondary' onClick={hideAllSeries}><i className='bi-eye-slash-fill' /> Hide All</Button>
              </ButtonGroup>
              <ButtonGroup size='sm' className="me-2" aria-label="Data Subset Reset">
                <Button variant='outline-secondary' onClick={() => setModalShow(true)}><i className="bi-x-circle" /> Reset</Button>
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
            <button className="btn btn-primary my-2" onClick={props.setModalImport} title='Import Data'><i className='bi-box-arrow-in-down' /> Import…</button>
          </div>}
          {(getDatasetCount('data') > 0 && state.length === 0) ? (
            <div className='text-center p-3'>
              <i className='bi-clipboard-check text-muted fs-1' />
              <span className='d-block text-primary fs-5'>All Data Selected</span>
              <span className='small'>All available data is currently selected. Use the Filter <i className='bi-filter-square' />&nbsp;button to select subsets of data.</span>
            </div>
          ) :
            <ReactSortable tag='ul' handle='.bi-square-fill' className='list-group list-group-flush mt-2 scrollarea w-100' list={ JSON.parse(JSON.stringify(state)) } setList={ setList } direction={'vertical'} animation={200} delayOnTouchStart={true} delay={2}>
              {state.map((el, idx) => <DataSubsetItem key={idx} {...el} />)}
            </ReactSortable>
            // <ListGroup as="ul" variant="flush" className='mt-2 scrollarea w-100'>
            //   {state.map((el, idx) => <DataSubsetItem key={idx} {...el} />)}
            // </ListGroup>
          }
        </Col>
      </Row>

      <ModalDialogConfirm
        show={modalShow}
        onHide={(confirmed) => {
          setModalShow(false);
          if (confirmed)
            dispatch(datasubsetReset());
        }
        }
        header="Delete Subsets"
        content={<>Removing all <strong>Subsets</strong> cannot be undone.</>}
        yes="Delete"
        no="Cancel"
      />
    </>
  )
}
