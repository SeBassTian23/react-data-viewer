import { useState } from 'react'

import { getFilteredData } from '../../modules/database'

import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

import Plotly from 'plotly.js/dist/plotly'
import * as PlotlyIcons from 'plotly-icons';

import ModalDialogPlot from '../../components/Dialogs/ModalDialogPlot'

import HelpOffCanvas from './HelpOffCanvas'

import { useSelector, useDispatch } from 'react-redux'
import { dashboardAddPanel } from '../../features/dashboard.slice'

import { datasubsetAdded } from '../../features/datasubset.slice'

import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

export default function PlotToolbar(props) {

  const [modalShow, setModalShow] = useState({ type: null, show: false });
  const [toastShow, setToastShow] = useState(false);

  const dispatch = useDispatch()

  const state = useSelector(state => state.plot)
  const stateDatasubsets = useSelector(state => state.datasubsets)

  const addToDashboard = () => {
    dispatch(dashboardAddPanel({
      content: { ...state },
      linkTo: null,
      title: state.title !== ""? state.title : "",
      type: "plot"
    }))
  }

  const addToSubsetInside = (ids) => {

    if (ids.length > 0) {
      const selection = {
        name: "Graph Selection",
        count: 0,
        isVisible: true,
        filter: [{
          name: '$loki',
          values: ids
        }]
      }

      selection.count = getFilteredData('data', { filters: selection.filter }).data().length

      // Add Filter to Series
      dispatch(datasubsetAdded(selection));

      // Remove menu
      props.onSelection(false)
    }
  }

  const addToSubsetOutside = (ids) => {

    var all_ids = []
    stateDatasubsets.filter(e => e.isVisible).forEach(e => {
      all_ids.push(getFilteredData('data', { filters: e.filter }).data().map(e => e['$loki']))
    });
    all_ids = [...new Set(all_ids.flat())];

    let outside_ids = all_ids.filter((e) => !ids.includes(e))

    if (outside_ids.length > 0) {
      const selection = {
        name: "Graph Selection",
        count: 0,
        isVisible: true,
        filter: [{
          name: '$loki',
          values: outside_ids
        }]
      }

      selection.count = getFilteredData('data', { filters: selection.filter }).data().length

      // Add Filter to Series
      dispatch(datasubsetAdded(selection));

      // Remove menu
      props.onSelection(false)
    }
  }

  return (
    <>
      <ButtonToolbar aria-label="Toolbar with button groups" className='d-flex align-items-center'>
        <ButtonGroup size='sm' className="me-2" aria-label="Plot Data">
          <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={() => setModalShow({ type: 'scatter', show: true })}><PlotlyIcons.PlotScatterAxesIcon className='ploty-icon' /> Scatter</Button>
          <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={() => setModalShow({ type: 'line', show: true })}><i className='bi-graph-up' /> Line</Button>
          <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={() => setModalShow({ type: 'bar', show: true })}><i className='bi-bar-chart-line' /> Bar</Button>
          <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={() => setModalShow({ type: 'distribution', show: true })}><PlotlyIcons.PlotBoxIcon className='ploty-icon-dist'  /> Distribution</Button>
          <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={() => setModalShow({ type: 'matrix', show: true })}><PlotlyIcons.PlotSplomIcon className='ploty-icon-matrix' /> Matrix</Button>
        </ButtonGroup>
        {props.isSelected && <ButtonGroup className='me-2' size='sm' aria-label="Selection">
          <DropdownButton size="sm" as={ButtonGroup} variant={props.darkmode? "outline-light" : "outline-dark"} align="end" title={<><i className="bi-bounding-box" /> Selection</>}>
            <Dropdown.Header>Filter Data by Selection</Dropdown.Header>
            <Dropdown.Item onClick={() => addToSubsetInside(props.selectedMarkers)}><i className='bi-intersect' /> Inside</Dropdown.Item>
            <Dropdown.Item onClick={() => addToSubsetOutside(props.selectedMarkers)}><i className='bi-exclude' /> Outside</Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>}
        <ButtonGroup size='sm' aria-label="Dashboard">
          <Button variant={props.darkmode? "outline-light" : "outline-dark"} onClick={() => { addToDashboard(); setToastShow(true); }}><i className="bi-window-plus" /> Panel</Button>
        </ButtonGroup>
        <ButtonGroup className='ms-2' size='sm' aria-label="Save group">
          <DropdownButton size="sm" as={ButtonGroup} variant={props.darkmode? "outline-light" : "outline-dark"} align="end" title={<><i className="bi-box-arrow-down" /> Save…</>}>
            <Dropdown.Item onClick={() => Plotly.downloadImage('mainChart', { filename: 'my-analysis-plot', width: 1400, height: 800, format: 'png' })}><i className="bi-filetype-png" /> PNG</Dropdown.Item>
            <Dropdown.Item onClick={() => Plotly.downloadImage('mainChart', { filename: 'my-analysis-plot', width: 1400, height: 800, format: 'jpeg' })}><i className="bi-filetype-jpg" /> JPEG</Dropdown.Item>
            <Dropdown.Item onClick={() => Plotly.downloadImage('mainChart', { filename: 'my-analysis-plot', width: 1400, height: 800, format: 'webp' })}><i className="bi-file-earmark" /> webp</Dropdown.Item>
            <Dropdown.Item onClick={() => Plotly.downloadImage('mainChart', { filename: 'my-analysis-plot', width: 1400, height: 800, format: 'svg' })}><i className="bi-filetype-svg" /> SVG</Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
        <ButtonGroup className='ms-2' size='sm' aria-label="Help Group">
          <HelpOffCanvas variant={props.darkmode? "outline-light" : "outline-dark"} title='Help | Plot Data' url='help/md/plot.md' />
        </ButtonGroup>
      </ButtonToolbar>
      <ModalDialogPlot
        type={modalShow.type}
        show={modalShow.show}
        onHide={() => setModalShow({ type: null, show: false })}
      />
      <ToastContainer className="p-3" position='top-end'>
        <Toast bg='secondary' onClose={() => setToastShow(false)} show={toastShow} delay={3000} autohide>
          <Toast.Header>
            <i className='bi-window-plus me-2' />
            <strong className="me-auto">Panel</strong>
          </Toast.Header>
          <Toast.Body >
            Plot added to Dashboard
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}
