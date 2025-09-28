import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import { uniqWith, isEqual, differenceWith } from 'lodash'

import HelpOffCanvas from '../Main/HelpOffCanvas'

import { fileExtension } from '../../helpers/file-extension';
import { analysisUpdate } from '../../features/analysis.slice';

import { getDatasetCount } from '../../modules/database'

export default function ModalDialogAnalysis(props) {

  const store = useSelector(state => state.analysis)
  const bookmarks = useSelector(state => state.bookmarks)
  const refName = useRef();
  const refNotes = useRef();
  const [hasdata, setHasdata] = useState(false);
  const [team, setTeam] = useState([]);

  const [show, setShow] = useState(false)
  const [message, setMessage] = useState({ header: '', body: '', icon: '', status: 'secondary' })

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(analysisUpdate({
      name: refName.current.value,
      notes: refNotes.current.value
    }))
    props.onHide();
  }

  useEffect(() => {
    if (getDatasetCount() > 0)
      setHasdata(true)
    else
      setHasdata(false)
  }, [props.show])

  useEffect(() => {
    setTeam(differenceWith( uniqWith(bookmarks.filter( itm => itm.creator ).map( itm => itm.creator), isEqual), [store.creator], isEqual))
  }, [bookmarks])

  return ( <>
    <Modal
      show={props.show}
      onHide={handleClose}
      backdrop="static"
      keyboard={true}
      size={'md'}
    >
      <Modal.Body>
        <span className='float-end'><HelpOffCanvas title='Help | Analysis' url='help/md/analysis.md' /></span>
        <span className="d-block fs-4"><i className="bi bi-journal-richtext fs-2 text-muted" /> Analysis</span>
        <Form className='mt-2'>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control ref={refName} type="text" placeholder="My Analysis" defaultValue={store.name} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control ref={refNotes} as="textarea" rows={3} placeholder='My Analysis Notes…' defaultValue={store.notes} />
          </Form.Group>

          {(store?.creator && store?.creator?.name) && <Form.Group className="mb-3">
            <UserProfile {...store.creator} isCreator={true} />
          </Form.Group>}

          {(team.length > 0) && <Form.Group className="mb-3">
            <div className="form-label m-0">Team</div>
            <ul className='list-unstyled analysis-team-members'>
              { team.map( (user, idx) => {
                return <li key={idx}>
                    <UserProfile {...user} />
                  </li>
                })
              }
            </ul>
          </Form.Group>}

          <Form.Group className="mb-3">
            <div className="form-label m-0">File(s)</div>
            <ListGroup as="ul" variant="flush" className='list-unstyled'>
              <AnalysisFileInfo files={store.files} hasdata={hasdata} handleClose={handleClose} setShow={setShow} setMessage={setMessage} setModalImport={props.setModalImport} />
            </ListGroup>
          </Form.Group>
          <Row>
            <Col sm={6}>
              <span className='d-block'>Started: </span>
              <Form.Text>{new Date(store.created_at).toLocaleString()}</Form.Text>
            </Col>
            <Col sm={6}>
              <span className='d-block'>Last Saved: </span>
              <Form.Text>{new Date(store.updated_at).toLocaleString()}</Form.Text>
            </Col>
          </Row>

        </Form>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant="link" className='fs-6 text-decoration-none col-12 m-0 rounded-0 border-end' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

    <ToastContainer className="p-3" position='top-end'>
      <Toast onClose={() => setShow(false)} show={show} delay={4000} autohide bg={message.status || 'secondary'}>
        <Toast.Header>
          <i className={`bi ${message.icon === '' ? 'bi-app-indicator' : message.icon} me-2`} />
          <strong className="me-auto">{message.header}</strong>
        </Toast.Header>
        <Toast.Body>{message.body}</Toast.Body>
      </Toast>
    </ToastContainer>
  </>
  )
}

function AnalysisFileInfo(props) {
  let files = props.files
  let hasdata = props.hasdata

  if (files.length == 0 && hasdata)
    return <li key={"0"} className='small text-muted'><i className={`bi bi-file-earmark-x text-warning`} /> No files associated</li>

  if (files.length == 0 && !hasdata)
    return <><ListGroup.Item as="li" key={"0"}>
      <button className="btn btn-primary btn-sm" onClick={(e) => { e.preventDefault(); props.handleClose(); props.setModalImport(true) }} title='Import Data'><i className='bi-box-arrow-in-down' /> Import Data…</button>
      <span className='ms-2 small text-muted'>To Get Started Import Data from a File.</span>
    </ListGroup.Item>
    </>

  return files.map((itm, idx) => {
    if (typeof (itm) === 'string')
      return <ListGroup.Item as="li" key={idx} className='d-flex align-items-center ps-2'>
        <i className={`bi ${fileExtension(itm) != '' ? 'bi-filetype-'+fileExtension(itm) : 'bi-file-earmark'} fs-4 me-2`} /> <span className='text-muted'>{itm}</span>
      </ListGroup.Item>

    if (typeof (itm) === 'object')
      return <ListGroup.Item as="li" key={idx} className='d-flex align-items-center ps-2'>
        <i className={`bi ${fileExtension(itm.name) != '' ? 'bi-filetype-'+fileExtension(itm.name) : 'bi-file-earmark'} fs-4 me-2`} />
        <span className='text-muted'>{itm.name} <br />
          <small>{(itm.size > 1024 ** 2 ? (itm.size / 1024 ** 2).toFixed(2) + ' mb' : (itm.size / 1024).toFixed(2) + ' kb')} | {new Date(itm.lastModified).toLocaleString()}</small>
        </span>
      </ListGroup.Item>
  })
}

function UserProfile(props) {
  return <div className='d-flex align-items-center p-1'>
    <div className="flex-shrink-0 text-center rounded bg-light analysis-user-avatar">
      {props.avatar ? <img src={props.avatar} width={40} className='rounded' /> : <i className="bi bi bi-person-circle fs-2 text-muted" />}
    </div>
    <div className='flex-grow-1'>
      <div className="analysis-user-name">{props.name}{ props?.isCreator && <small className='ms-1'>(Creator)</small>}</div>
      <div className='text-muted analysis-user-email'>{props.email}</div>
    </div>
  </div>
}
