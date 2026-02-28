import { useState, useEffect, useCallback } from 'react'
import { useStore } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';

import { useHotkeys } from 'react-hotkeys-hook'

import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import DropdownButton from 'react-bootstrap/DropdownButton'

import saveAnalysisToFile from '../../utils/data/save-analysis'

import ModalDialogAbout from '../Dialogs/ModalDialogAbout'
import ModalDialogStart from '../Dialogs/ModalDialogStart'
import ModalDialogImport from '../Dialogs/ModalDialogImport'
import ModalDialogBusy from '../Dialogs/ModalDialogBusy'
import ModalDialogAnalysisImport from '../Dialogs/ModalDialogAnalysisImport'

import SidebarTabContent from './SidebarTabContent'
import SidebarPanelMenuItems from './SidebarPanelMenuItems'

import { ShortcutLabel, ShortcutLabelStr } from '../Main/ShortcutLabel'

import useModalConfirm from '../../hooks/useModalConfirm';
import { useAddBookmark } from '../../hooks/useAddBookmark';
import useToast from '../../hooks/useToast';

import opfs from '../../modules/opfs'

export default function SidebarTabs({ modalImport, setModalImport, darkmode, setTogglesidebar, ...props }) {

  const store = useStore();

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const modal = useModalConfirm();
  const addBookmark = useAddBookmark();

  const [showAbout, setShowAbout] = useState(false)
  const [modalSaveAnalysis, setModalSaveAnalysis] = useState(false);

  const [startModal, setStartModal] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const [loadAnalysis, setLoadAnalysis] = useState(false);
  const [tab, setTab] = useState('DATASUBSETS');

  const saveBookmark = useCallback(() => addBookmark(), [addBookmark]);

  useHotkeys('meta+/', (event) => {
    event.preventDefault();
    setTogglesidebar(curr => !curr);
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
    setTab('Bookmarks', 'Bookmarks');
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
    setTab( curr =>  curr === 'DATASUBSETS'? 'FILTERS' : 'DATASUBSETS')
  });

  useHotkeys('meta+u', (event) => {
    event.preventDefault();
    setTab('RECENT');
  });

  const saveAnalysis = () => {
    saveAnalysisToFile(store.getState());
    setModalSaveAnalysis(false)
  }

  // Initial Loading
  useEffect(() => {
    setShowRecent(opfs.isSupported());
    const timer = setTimeout(() => {
      if (location?.pathname === '/')
        setStartModal(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [])

  useEffect(() => {
    if (localStorage.length === 0)
      setShowRecent(false);
    if (opfs.isSupported() && localStorage.length > 0)
      setShowRecent(true);
  }, [localStorage.length])

  const handleNewAnalysis = useCallback(() => modal.show("confirm", {
    header: "New Analysis",
    content: `Start a New Analysis. Make sure to save your old Analysis, if you didn't already.`,
    yes: "Start",
    no: "Cancel",
    payload: {
      action: "NEW_ANALYSIS"
    }
  }), [modal])

  return (
    <>
      <div id="dv-tab-nav">
        <ButtonToolbar className='d-flex align-items-center'>
          <ButtonGroup size="sm" className='w-100' aria-label="Data Toolbar">
            {(tab !== 'DATASUBSETS') ? <Button type="button" 
              variant={darkmode ? "outline-light" : "outline-dark"}
              onClick={() => setTab('DATASUBSETS')}
              title="Back to Data Subsets" ><i className="bi bi-chevron-left" /> Back
              </Button>
              : 
              <Button
                type="button"
                variant={darkmode ? "outline-light" : "outline-dark"}
                onClick={() => setTab('FILTERS')}
                title={ShortcutLabelStr('toggleFilter')}><i className="bi bi-filter" /> Filter
              </Button>
            }
            <SidebarPanelMenuItems darkmode={darkmode} />
            <DropdownButton size="sm" as={ButtonGroup} variant={darkmode ? "outline-light" : "outline-dark"} align="end" title={<><i className="bi bi-database-fill-gear" /> Data</>}>
              <Dropdown.Header>Settings</Dropdown.Header>
              <Dropdown.Item onClick={() => setTab('PARAMETERS')}><i className="bi bi-toggles" /> Parameters</Dropdown.Item>
              <Dropdown.Item onClick={() => setTab('DATATYPES')}><i className="bi bi-123" /> Data Types</Dropdown.Item>
              <Dropdown.Item onClick={() => setTab('ALIASES')}><i className="bi bi-at" /> Aliases</Dropdown.Item>
              <Dropdown.Item onClick={() => setTab('PARAMETERFILTERS')}><i className="bi bi-filter" /> Filters</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header>Rules</Dropdown.Header>
              <Dropdown.Item onClick={() => setTab('THRESHOLDS')}><i className="bi bi-bar-chart-steps" /> Thresholds</Dropdown.Item>
              <Dropdown.Item onClick={() => setTab('FLAGS')}><i className="bi bi-flag" /> Flagged Data</Dropdown.Item>
            </DropdownButton>
            <DropdownButton size="sm" as={ButtonGroup} variant={darkmode ? "outline-light" : "outline-dark"} align="end" title={<i className="bi bi-three-dots-vertical" />}>
              <Dropdown.Item onClick={handleNewAnalysis} className='d-flex align-items-center'><span className='flex-grow-1 me-3'><i className="bi bi-journal-richtext" /> New Analysis…</span> <ShortcutLabel shortcutKey="newAnalysis" /></Dropdown.Item>
              <Dropdown.Item onClick={() => setLoadAnalysis(true)} className='d-flex align-items-center'><span className='flex-grow-1 me-3'><i className="bi bi-journal-arrow-up" /> Load…</span> <ShortcutLabel shortcutKey="loadAnalysis" /></Dropdown.Item>
              <Dropdown.Item onClick={() => setModalSaveAnalysis(true)} className='d-flex align-items-center'><span className='flex-grow-1 me-3'><i className="bi bi-journal-arrow-down" /> Save…</span> <ShortcutLabel shortcutKey="saveAnalysis" /></Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setModalImport(true)} className='d-flex align-items-center'><span className='flex-grow-1 me-3'><i className="bi bi-box-arrow-in-down" /> Import Data…</span> <ShortcutLabel shortcutKey="importData" /></Dropdown.Item>
              <Dropdown.Item onClick={() => setTab('RECENT')} className='d-flex align-items-center' disabled={!showRecent}><span className='flex-grow-1 me-3'><i className="bi bi-file-earmark-zip" /> Recent…</span><ShortcutLabel shortcutKey="showRecent" /></Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={saveBookmark} className='d-flex align-items-center'><span className='flex-grow-1 me-3'><i className="bi bi-bookmark-plus" /> Save Bookmark…</span> <ShortcutLabel shortcutKey="saveBookmark" /></Dropdown.Item>
              <Dropdown.Item onClick={() => setTab('BOOKMARKS')} className='d-flex align-items-center'><span className='flex-grow-1 me-3'><i className="bi bi-bookmarks" /> Bookmarks</span> <ShortcutLabel shortcutKey="showBookmarks" /></Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setShowAbout(true)}><i className="bi bi-info-square" /> About</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </ButtonToolbar>
      </div>

      <SidebarTabContent tab={tab} setModalImport={setModalImport} {...props} />

      <ModalDialogAbout show={showAbout} about={{ ...props.about }} onHide={() => setShowAbout(false)} />

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