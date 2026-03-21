import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup';

import { uniqWith, isEqual, differenceWith } from 'lodash'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

import humanFileSize from '../../helpers/humanFileSize'

import { fileExtension } from '../../helpers/file-extension';
import { analysisUpdate } from '../../features/analysis.slice';

import { getDatasetCount } from '../../modules/database'

import useHelp from '../../hooks/useHelp';

export default function ModalDialogAnalysis(props) {

  const store = useSelector(state => state.analysis)
  const bookmarks = useSelector(state => state.bookmarks)
  const refName = useRef();
  const refNotes = useRef();
  const [hasdata, setHasdata] = useState(false);
  const [team, setTeam] = useState([]);

  const dispatch = useDispatch();

  const help = useHelp();

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

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Analysis", "help/md/analysis.md")
  },[] )

  return ( <>
    <Modal
      show={props.show}
      onHide={handleClose}
      backdrop="static"
      keyboard={true}
      size={'lg'}
    >
      <Modal.Body>
        <span className="d-flex align-items-center fs-5">
          <i className="bi bi-journal-richtext me-2 fs-3 text-muted" /> Analysis
          <Button variant={null} onClick={handleClickHelp} className='ms-auto'><i className='bi bi-question-circle' /></Button>
        </span>

        <Row>
          <Col sm={12} lg={8}>
            <Form className='mt-2'>
              <Form.Group className="mb-3" controlId="analysisName">
                <Form.Label>Name</Form.Label>
                <Form.Control ref={refName} type="text" placeholder="Analysis Name" defaultValue={store.name} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="analysisNotes">
                <Form.Label>Notes</Form.Label>
                <Form.Control ref={refNotes} as="textarea" rows={3} placeholder='Analysis Notes…' defaultValue={store.notes} />
              </Form.Group>
            </Form>

            <div className="mb-3">
              <span className="d-block form-label mb-2">Imported Data</span>
              <ListGroup as="ul" style={{lineHeight: 'normal'}}>
                <AnalysisFileInfo files={store.files} hasdata={hasdata} handleClose={handleClose} setModalImport={props.setModalImport} />
              </ListGroup>
            </div>
          </Col>
          <Col sm={12} lg={4} className='border-start pt-2'>
            <span className='d-block form-label'>Started</span>
            <span className='text-muted'>{dayjs(store.created_at).format('l LT')}</span>
            <hr />
            <span className='d-block form-label'>Last Saved</span>
            <span className='text-muted'>{dayjs(store.updated_at).format('l LT')}</span>
            <hr />
            <span className="d-block form-label">Analysis Team</span>
            <ul className='list-unstyled'>
              {(store?.creator && store?.creator?.name) && <li>
                <UserProfile {...store.creator} isCreator={true} />
              </li>}
              { team.map( (user, idx) => {
                return <li key={idx}>
                    <UserProfile {...user} />
                  </li>
                })
              }
            </ul>       
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant="link" className='fs-6 text-decoration-none col-12 m-0 rounded-0 border-end' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

function AnalysisFileInfo({ files, hasdata, handleClose, setModalImport }) {

  const icon = (name) => {
    if(['json', 'csv', 'txt'].includes(fileExtension(name)))
      return `bi bi-filetype-${fileExtension(name)}`
    return `bi bi-file-earmark`
  }

  if (files.length == 0 && hasdata)
    return <li key={"0"} className='small text-muted'><i className={`bi bi-file-earmark-x text-warning`} /> No files associated</li>

  if (files.length == 0 && !hasdata)
    return <><ListGroup.Item as="li" key={"0"}>
      <button className="btn btn-primary btn-sm" onClick={(e) => { e.preventDefault(); handleClose(); setModalImport(true) }} title='Import Data'><i className='bi bi-box-arrow-in-down' /> Import Data…</button>
      <span className='ms-2 small text-muted'>To Get Started Import Data from a File.</span>
    </ListGroup.Item>
    </>

  return files.map((itm, idx) => {
    if (typeof (itm) === 'string')
      return <ListGroup.Item as="li" key={idx} className='d-flex align-items-center ps-2'>
        <i className={`${icon(itm)} fs-4 me-2`} /> <span className='text-muted'>{itm}</span>
      </ListGroup.Item>

    if (typeof (itm) === 'object')
      return <ListGroup.Item as="li" key={idx} className='d-flex align-items-center ps-2'>
        <i className={`${icon(itm.name)} fs-4 me-2`} />
        <span className='text-muted fw-bold d-flex flex-column'>{itm.name}
          <span className='imported-file-info'>
            <i className='bi bi-hdd' /> { humanFileSize(itm.size)}
            <i className='bi bi-file-earmark-text ms-2' /> {fileExtension(itm.name)}
            <i className='bi bi-calendar2 ms-2' /> {dayjs(itm.lastModified).format('L LT')}
          </span>
        </span>
      </ListGroup.Item>
  })
}

function UserProfile({name, email, avatar = null, isCreator = null}) {

  return <div className='d-flex align-items-center p-1'>
    <div className="flex-shrink-0 text-center rounded bg-light analysis-user-avatar">
      {avatar ? <div className='rounded ratio ratio-1x1 d-inline-block' style={{background: `url(${avatar}) 0% 0% / cover`}}/> : <i className="bi bi bi-person-circle fs-2 text-muted" />}
    </div>
    <div className='flex-grow-1'>
      <div className="analysis-user-name">{name}{ isCreator && <Badge pill bg="secondary" className='ms-1'>Creator</Badge>}</div>
      <div className='text-muted analysis-user-email'>{email}</div>
    </div>
  </div>
}
