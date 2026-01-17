import { useEffect, useState, useCallback } from 'react'
import Button from 'react-bootstrap/Button';

import { NavLink, useNavigate } from 'react-router-dom'

import { useHotkeys } from 'react-hotkeys-hook'

import { ShortcutLabelStr } from '../Main/ShortcutLabel'

import ModalDialogAnalysis from '../Dialogs/ModalDialogAnalysis'
import ModalDialogUser from '../Dialogs/ModalDialogUser'

export default function SidebarNavigation(props) {

  const navigate = useNavigate()

  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (props.darkmode)
      document.querySelector("body").setAttribute('data-bs-theme', 'dark');
    else
      document.querySelector("body").setAttribute('data-bs-theme', 'light')
  }, [props.darkmode])


  const handleClickAnalysisModal = useCallback(() => props.setAnalysisModal(true), [props.setAnalysisModal]);
  
  const handleClickUserModal = useCallback(() => props.setUserModal(true), [props.setUserModal]);
  
  const handleClickDarkmode = useCallback(() => {
    props.setDarkmode(prev => !prev);
  }, [props.setDarkmode]);
  
  const handleClickToggleSidebar = useCallback(() => {
    props.setToggle(prev => !prev);
  }, [props.setToggle]);

  useHotkeys('meta+shift+d', (event) => {
    event.preventDefault();
    navigate('/')
  });

  useHotkeys('meta+shift+p', (event) => {
    event.preventDefault();
    navigate('/plot')
  });

  useHotkeys('meta+shift+m', (event) => {
    event.preventDefault();
    navigate('/map')
  });

  useHotkeys('meta+shift+x', (event) => {
    event.preventDefault();
    navigate('/spreadsheet')
  });

  return (
    <nav className="d-flex flex-column text-center border-end vh-100 p-0" id='dv-nav'>
      <a className="navbar-brand p-2 mb-2" href={__APP_URL__} target='_blank'>
        <img src='./icon.svg' alt='App Logo' className="img-fluid w-100" />
      </a>
      <ul className="d-flex nav navbar-nav flex-column flex-grow-1 w-100">
        <li className="nav-item">
          <NavLink className="nav-link px-0" to="/" title={ShortcutLabelStr('showDashboard')}>
            <i className="bi-columns-gap" />
            <span className="d-block">Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link px-0" to="/plot" title={ShortcutLabelStr('showPlot')}>
            <i className="bi-graph-up" />
            <span className="d-block">Plot</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link px-0" to="/map" title={ShortcutLabelStr('showMap')}>
            <i className="bi-globe-americas" />
            <span className="d-block">Map</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link px-0" to="/spreadsheet" title={ShortcutLabelStr('showSpreadsheet')}>
            <i className="bi-table" />
            <span className="d-block">Spreadsheet</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link px-0" to="/documentation" title="Documentation">
            <i className="bi-book" />
            <span className="d-block">Docs</span>
          </NavLink>
        </li>
      </ul>
      <Button type="link" variant={null} className='mx-1' title='About the Analysis' onClick={handleClickAnalysisModal}>
        <i className="bi bi-journal-richtext fs-5" />
      </Button>
      <Button type="link" variant={null} className='mx-1 user-profile-btn' title='User' onClick={handleClickUserModal}>
        {avatar ? <div className='rounded ratio ratio-1x1' style={{background: `url(${avatar}) 0% 0% / cover`}}/> : <i className="bi bi-person-square fs-5" />}
      </Button>
      <Button type="button" variant={null} className='mx-1' title='Color Mode' onClick={handleClickDarkmode}>
        {props.darkmode ? <i className="bi bi-moon-stars fs-5" /> : <i className="bi bi-sun fs-5" />}
      </Button>
      <Button type="button" variant={null} className='mx-1' title='Toggle Sidebar' onClick={handleClickToggleSidebar}>
        <span className="sidebar-toggle-icon-stack">
          <i className="bi bi-layout-sidebar fs-5" />
          <i className={`bi ${props.toggle ? "bi-caret-left-fill" : "bi-caret-right-fill"}`}></i>
        </span>
      </Button>

      <ModalDialogAnalysis setModalImport={props.setModalImport} show={props.analysisModal} onHide={() => props.setAnalysisModal(false)} />
      <ModalDialogUser show={props.userModal} onHide={() => props.setUserModal(false)} avatar={avatar} setAvatar={setAvatar} />
    </nav>
  )
}
