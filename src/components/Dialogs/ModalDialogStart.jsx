import {useEffect, useState} from 'react';
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
    opfs.fileList().then( e => setFiles(e.filter(f => f.name.match(/\.db$/) ) ))
  },[])

  return (
    <Modal
      show={props.show}
      onHide={() => props.onHide()}
      keyboard={true}
      size={'sm'}
      centered
    >
      <Modal.Body className="text-center">
        { profile.name &&
          <Row className='border-bottom'>
            <Col className='text-start fs-5 fw-light text-secondary pb-2'>Welcome Back, <strong>{ profile.name.split(' ')[0]}</strong>!</Col>
          </Row>
        }
        <Row>
          <Button onClick={() => {props.onHide(); props.setAnalysisModal(true);}} variant="link" className='fs-6 text-decoration-none col m-0 rounded-0 border-end'>
            <i className='bi bi-journal-richtext fs-1' />
            <span className='d-block text-muted'>New Analysis</span>
          </Button>
          <Button onClick={() => {props.onHide(); props.setLoadAnalysis(true);}} variant="link" className='fs-6 text-decoration-none col m-0 rounded-0'>
            <i className='bi bi-folder2-open fs-1' />
            <span className='d-block text-muted'>Load Analysis</span>
          </Button>
        </Row>
        {files.length > 0 && <Row className='border-top pt-2 text-start'>
          <Col className='px-0'>
            <span className='d-block text-muted small px-1'>Most Recent Analysis</span>
            <ul className='list-group list-group-flush overflow-y-auto small px-1' style={{maxHeight: '200px'}} >
              {files.slice(0,1).map( (el, idx) => <RecentFilesItem key={idx} index={idx} {...el} onHide={props.onHide} />)}
            </ul>
          </Col>
        </Row>}
      </Modal.Body>
    </Modal>
  )
}