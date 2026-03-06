import { Suspense, useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/callouts.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Sidebar from './components/Sidebar/Sidebar';
import RenderRoutes from './routes.jsx';

import { Provider } from 'react-redux'
import store from './store'

import { dbInit } from './modules/database'

import ToastManager from './components/Main/ToastManager'
import HelpOffcanvasManager from './components/Main/HelpOffcanvasManager.jsx'
import ModalManager from './components/Main/ModalManager.jsx'

/* Set up database tables */
dbInit();

function App() {

  let initDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || false;
  if(localStorage.length > 0 && localStorage.getItem('APP_USER_DARKMODE'))
    initDarkMode = JSON.parse(localStorage.getItem('APP_USER_DARKMODE'))

  const [darkmode, setDarkmode] = useState(initDarkMode);

  useEffect(()=>{
    function handleDarkModePrefferedChange() {
      const doesMatch = window.matchMedia("(prefers-color-scheme: dark)").matches

      if(localStorage.length > 0 && localStorage.getItem('APP_USER_DARKMODE'))
        setDarkmode(JSON.parse(localStorage.getItem('APP_USER_DARKMODE')))
      else
        setDarkmode(doesMatch)
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleDarkModePrefferedChange )

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleDarkModePrefferedChange)
    }

  },[])

  return (
    <Suspense fallback={<h1>Loading Application…</h1>}>
      <Provider store={store}>
        <Container fluid>
          <Row>
            <Sidebar darkmode={darkmode} setDarkmode={setDarkmode} />
            <Col as='main' id="dv-main" className="overflow-auto" >
              <RenderRoutes darkmode={darkmode} />
            </Col>
          </Row>
        </Container>
        <ModalManager />
        <HelpOffcanvasManager />
        <ToastManager />
      </Provider>
    </Suspense>
  );
}

export default App;
