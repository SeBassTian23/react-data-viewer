import { useState, useEffect, useCallback } from 'react'
import { useStore } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';

import { useHotkeys } from 'react-hotkeys-hook'

import DataSubset from './DataSubset'
import DataTypes from './DataTypes'
import Filters from './Filters'
import Parameters from './Parameters'
import Bookmarks from './Bookmarks'
import Thresholds from './Thresholds'
import RecentFiles from './RecentFiles'

import ModalDialogAbout from '../Dialogs/ModalDialogAbout'
import ModalDialogStart from '../Dialogs/ModalDialogStart'

import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import DropdownButton from 'react-bootstrap/DropdownButton'

import saveAnalysisToFile from '../../utils/data/save-analysis'

import Aliases from './Aliases';

import ModalDialogImport from '../Dialogs/ModalDialogImport'
import ModalDialogBusy from '../Dialogs/ModalDialogBusy'
import ModalDialogAnalysisImport from '../Dialogs/ModalDialogAnalysisImport'

import { ShortcutLabel, ShortcutLabelStr } from '../Main/ShortcutLabel'

import { useAddDashboardPanel } from '../../hooks/useAddDashboardPanel';

import widgets from '../../constants/widgets'
import useModal from '../../hooks/useModalConfirm';
import { useAddBookmark } from '../../hooks/useAddBookmark';
import useToast from '../../hooks/useToast';

export default function SidebarTabs(props) {

  const store = useStore();

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const modal = useModal();
  const addBookmark = useAddBookmark();

  // Custom Hooks
  const addDashboardPanel = useAddDashboardPanel();

  const modalImport = props.modalImport
  const setModalImport = props.setModalImport;

  const [showAbout, setShowAbout] = useState(false)
  const [modalSaveAnalysis, setModalSaveAnalysis] = useState(false);
  const [dashboardMenuInactive, setDashboardMenuInactive] = useState(false);

  const [startModal, setStartModal] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const [loadAnalysis, setLoadAnalysis] = useState(false);
  const [state, setState] = useState({
    selectedTab: 'DataSubsets',
    title: 'Data'
  });

  const saveBookmark = useCallback( () => addBookmark(), []);

  useHotkeys('meta+/', (event) => {
    event.preventDefault();
    props.setTogglesidebar(!props.show);
  });

  useHotkeys('meta+ctrl+n', (event) => {
    event.preventDefault();
    handleNewAnalysis();
  });

  useHotkeys('meta+s', (event) => {
    event.preventDefault();
    setModalSaveAnalysis(true);
  });

  useHotkeys('meta+shift+s', (event) => {
    event.preventDefault();
    saveBookmark();
  });

  useHotkeys('meta+shift+l', (event) => {
    event.preventDefault();
    changeTab('Bookmarks', 'Bookmarks');
  });

  useHotkeys('meta+l', (event) => {
    event.preventDefault();
    setLoadAnalysis(true);
  });

  useHotkeys('meta+i', (event) => {
    event.preventDefault();
    setModalImport(true);
  });

  useHotkeys('meta+k', (event) => {
    event.preventDefault();
    (state.selectedTab === 'DataSubsets') ? changeTab('Filters', 'Filter') : changeTab('DataSubsets', 'Data')
  });

  const changeTab = (selectedTab, title) => {
    setState(() => {
      return { 'selectedTab': selectedTab, 'title': title }
    });
  }

  const saveAnalysis = () => {
    saveAnalysisToFile(store.getState());
    setModalSaveAnalysis(false)
  }

  useEffect(() => {
    if (location.pathname === "/")
      setDashboardMenuInactive(false)
    else
      setDashboardMenuInactive(true)
  }, [location.pathname])

  useEffect(() => {
    if (localStorage.getItem('APP_USER_RECENT_FILES'))
      setShowRecent(true)
    else
      setShowRecent(false)
  }, [localStorage.getItem('APP_USER_RECENT_FILES')])  

  // Initial Loading
  useEffect(()=>{
    setTimeout(()=>{
      if(location?.pathname == '/')
        setStartModal(true);
    }, 250)
  },[])

  const handleNewAnalysis = useCallback(() => modal.show("confirm", {
    header: "New Analysis",
    content: `Start a New Analysis. Make sure to save your old Analysis, if you didn't already.`,
    yes: "Start",
    no: "Cancel",
    payload: {
      action: "NEW_ANALYSIS"
    }
  }), [] )

  const renderTabContent = (tab) => {
    switch (tab) {
      case 'DataSubsets':
        return <DataSubset setModalImport={setModalImport} />;
      case 'DataTypes':
        return <DataTypes />;
      case 'Filters':
        return <Filters />;
      case 'Parameters':
        return <Parameters />;
      case 'Bookmarks':
        return <Bookmarks />;
      case 'Thresholds':
        return <Thresholds />;
      case 'Aliases':
        return <Aliases />;
      case 'Recent':
        return <RecentFiles />;
      default:
        return <DataSubset setModalImport={setModalImport} />;
    }
  }

  return (
    <>
      <div id="dv-tab-nav">
        <ButtonToolbar className='d-flex align-items-center'>
          <ButtonGroup size="sm" className='w-100' aria-label="Data Toolbar">
            {(state.selectedTab !== 'DataSubsets') ? <Button type="button" variant={props.darkmode? "outline-light" : "outline-dark"} onClick={() => changeTab('DataSubsets', 'Data')} title="Back to Data Subsets" ><i className="bi bi-chevron-left" /> Back</Button> : <Button type="button" variant={props.darkmode? "outline-light" : "outline-dark"} onClick={() => changeTab('Filters', 'Filter')} title={ShortcutLabelStr('toggleFilter')}><i className="bi bi-filter" /> Filter</Button>}
            <DropdownButton size="sm" as={ButtonGroup} className='column-dropdown' variant={props.darkmode? "outline-light" : "outline-dark"} align="end" disabled={dashboardMenuInactive} title={<><i className="bi bi-window-plus" /> Panels</>}>
              <Dropdown.Header>General</Dropdown.Header>
              {widgets.filter( itm => itm.category == 'general').map( (itm, idx) => <Dropdown.Item key={idx} onClick={() => addDashboardPanel(itm.type)}><i className={`bi ${itm.icon || "bi bi-clipboard-data"}`} /> {itm.name}</Dropdown.Item> )}
              <Dropdown.Divider />
              <Dropdown.Header>Statistics</Dropdown.Header>
              {widgets.filter( itm => itm.category == 'statistics').map( (itm, idx) => <Dropdown.Item key={idx} onClick={() => addDashboardPanel(itm.type)}><i className={`bi ${itm.icon || "bi bi-clipboard-data"}`} /> {itm.name}</Dropdown.Item> )}
              <Dropdown.Divider />
              <Dropdown.Header>Continuous/Numerical</Dropdown.Header>
              {widgets.filter( itm => itm.category == 'statistics_numerical').map( (itm, idx) => <Dropdown.Item key={idx} onClick={() => addDashboardPanel(itm.type)}><i className={`bi ${itm.icon || "bi bi-clipboard-data"}`} /> {itm.name}</Dropdown.Item> )}
              <Dropdown.Divider />
              <Dropdown.Header>Categorical/Count</Dropdown.Header>
              {widgets.filter( itm => itm.category == 'statistics_category').map( (itm, idx) => <Dropdown.Item key={idx} onClick={() => addDashboardPanel(itm.type)}><i className={`bi ${itm.icon || "bi bi-clipboard-data"}`} /> {itm.name}</Dropdown.Item> )}
            </DropdownButton>
            <DropdownButton size="sm" as={ButtonGroup} variant={props.darkmode? "outline-light" : "outline-dark"} align="end" title={<><i className="bi bi-database-fill-gear" /> Data</>}>
              <Dropdown.Header>Data</Dropdown.Header>
              <Dropdown.Item onClick={() => changeTab('Thresholds', 'Thresholds')}><i className="bi bi-bar-chart-steps" /> Thresholds</Dropdown.Item>
              <Dropdown.Item onClick={() => changeTab('Parameters', 'Parameters')}><i className="bi bi-toggles" /> Parameters</Dropdown.Item>
              <Dropdown.Item onClick={() => changeTab('DataTypes', 'Data Types')}><i className="bi bi-123" /> Data Types</Dropdown.Item>
              <Dropdown.Item onClick={() => changeTab('Aliases', 'Aliases')}><i className="bi bi-at" /> Aliases</Dropdown.Item>
            </DropdownButton>
            <DropdownButton size="sm" as={ButtonGroup} variant={props.darkmode? "outline-light" : "outline-dark"} align="end" title={<i className="bi bi-three-dots-vertical" />}>
              <Dropdown.Item onClick={handleNewAnalysis} className='d-flex justify-content-between align-items-center'><span className='me-3'><i className="bi bi-journal-richtext" /> New Analysis…</span> <ShortcutLabel shortcutKey="newAnalysis" /></Dropdown.Item>
              <Dropdown.Item onClick={() => setLoadAnalysis(true)} className='d-flex justify-content-between align-items-center'><span className='me-3'><i className="bi bi-journal-arrow-up" /> Load…</span> <ShortcutLabel shortcutKey="loadAnalysis" /></Dropdown.Item>
              <Dropdown.Item onClick={() => setModalSaveAnalysis(true)} className='d-flex justify-content-between align-items-center'><span className='me-3'><i className="bi bi-journal-arrow-down" /> Save…</span> <ShortcutLabel shortcutKey="saveAnalysis" /></Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setModalImport(true)} className='d-flex justify-content-between align-items-center'><span className='me-3'><i className="bi bi-box-arrow-in-down" /> Import Data…</span> <ShortcutLabel shortcutKey="importData" /></Dropdown.Item>
              {showRecent && <Dropdown.Item onClick={() => changeTab('Recent', 'Recent Files')} className='d-flex justify-content-between align-items-center'><span className='me-3'><i className="bi bi-file-earmark-zip" /> Recent Files…</span></Dropdown.Item>}
              <Dropdown.Divider />
              <Dropdown.Item onClick={saveBookmark} className='d-flex justify-content-between align-items-center'><span className='me-3'><i className="bi bi-bookmark-plus" /> Save Bookmark…</span> <ShortcutLabel shortcutKey="saveBookmark" /></Dropdown.Item>
              <Dropdown.Item onClick={() => changeTab('Bookmarks', 'Bookmarks')} className='d-flex justify-content-between align-items-center'><span className='me-3'><i className="bi bi-bookmarks" /> Bookmarks</span> <ShortcutLabel shortcutKey="showBookmarks" /></Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setShowAbout(true)}><i className="bi bi-info-square" /> About</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </ButtonToolbar>
      </div>

      {renderTabContent(state.selectedTab, props)}

      <ModalDialogAbout show={showAbout} about={{...props.about}} onHide={() => setShowAbout(false)} />

      <ModalDialogImport
        show={modalImport}
        onHide={(response) => {
          setModalImport(false);
          if (response) {
            if (response.success)
              toast.success(`Data from "${response.message}" imported`, "Data Import", "bi-database-check")
            else
              toast.error(response.message, "Data Import", "bi-database-exclamation")
            navigate('/spreadsheet')
          }
        }
        }
        yes="Import"
        no="Cancel"
      />

      <ModalDialogAnalysisImport show={loadAnalysis} setLoadAnalysis={setLoadAnalysis} />

      <ModalDialogBusy show={modalSaveAnalysis} content={"Creating Analysis File…"} onEntered={() => saveAnalysis()} />

      <ModalDialogStart show={startModal} onHide={setStartModal} setAnalysisModal={props.setAnalysisModal} setLoadAnalysis={setLoadAnalysis} />
    </>
  )
}
