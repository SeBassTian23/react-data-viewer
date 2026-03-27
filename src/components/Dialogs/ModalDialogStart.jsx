import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import RecentFilesItem from '../Sidebar/RecentFiles/RecentFilesItem'

import opfs from '../../modules/opfs'

export default function ModalDialogStart(props) {

  const [files, setFiles] = useState([])

  const profile = useSelector(state => state.user)

  useEffect(() => {
    opfs.fileList().then(e => setFiles(e.filter(f => f.name.match(/\.db$/))))
  }, [])

  return (
    <Modal
      show={props.show}
      onHide={() => props.onHide()}
      keyboard={true}
      size={'md'}
      centered
      id="welcome-dialog"
    >
      <Modal.Body>
        <Row className='mb-2'>
          <Col sm={12} className='fs-4'>
            {profile.name?
              <>Welcome Back, <strong>{profile.name.split(' ')[0]}</strong>!</>
              : <>Welcome!</>
            }
          </Col>
          <Col className='text-secondary small'>Let's analyze your Data</Col>
        </Row>
        <Row className='text-center my-4'>
          <Col className='border-end px-4'>
            <Button onClick={() => { props.onHide(); props.setAnalysisModal(true); }} variant="outline-primary" className='w-100'>
              <i className='bi bi-journal-richtext fs-1' />
              <span className='d-block text-muted fw-bold'>New Analysis</span>
              <small className='d-block text-muted'>Import data from a file</small>
            </Button>
          </Col>
          <Col className='px-4'>
            <Button onClick={() => { props.onHide(); props.setLoadAnalysis(true); }} variant="outline-primary" className='w-100'>
              <i className='bi bi-folder2-open fs-1' />
              <span className='d-block text-muted fw-bold'>Load Analysis</span>
              <small className='d-block text-muted'>Continue your work</small>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className='text-secondary small px-4'>
            Start a new analysis importing a .csv, .json, .txt, or .parquet data file or continue a previously saved analysis.
          </Col>
        </Row>
      </Modal.Body>
      {files.length > 0 && <Modal.Footer>
        <Col className='text-start'>
          <span className='form-label ps-2 mb-2'>Most Recent Analysis</span>
          <ul className='list-group list-group-flush overflow-y-auto small px-1'>
            {files.slice(0, 1).map((el, idx) => <RecentFilesItem
              key={idx}
              index={idx}
              onHide={props.onHide}
              {...el}
            />)}
          </ul>
        </Col>
      </Modal.Footer>}
      {!profile.allowCookies && <Modal.Footer>
        <Col className='text-start'><b>Pro Tip:</b> Allow cookies to set up a local profile and save recent analysis for more features and convinient access.</Col>
      </Modal.Footer>}
    </Modal>
  )
}