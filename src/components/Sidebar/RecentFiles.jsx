import { useState, useEffect, useCallback } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'

import RecentFilesItem from './RecentFilesItem'
import useHelp from '../../hooks/useHelp';
import useModal from '../../hooks/useModalConfirm';
import opfs from '../../modules/opfs'

import humanFileSize from '../../helpers/humanFileSize'

export default function RecentFiles() {

  const [fileCount, setFileCount] = useState(0);
  const [recentFiles, setRecentFiles] = useState([]);
  const [storage, setStorage] = useState(null);
  const [sort, setSort] = useState(true);
  const [filter, setFilter] = useState('');

  const help = useHelp();
  const modal = useModal();

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Analysis", "help/md/analysis.md")
  },[] )

  const handleClearRecent = useCallback(() => modal.show("confirm", {
    header: "Reset Cached Analyses",
    content: `Removing "all cached analyses" cannot be undone.`,
    yes: "Reset",
    no: "Cancel",
    payload: {
      action: "DELETE_CACHED_ANALYSES"
    }
  }), [] )

  const handleClickSort = useCallback( ()=> {
    setSort( e => !e)
  },[] )

  useEffect(() => {
    let init = false

    async function load() {
      if(!init && opfs.isSupported()){
        await opfs.fileList(sort).then( e => {
          console.log(e.map(f => `${f.name} | ${f.size}` ))
          setFileCount(e.length || 0)
          setRecentFiles( e.filter(f => f.name.endsWith(".db")) )
        })
        await opfs.infoStorage().then( e => setStorage(e))
      }
    }
    
    load() // Initial
    const handler = () => load() // change events

    window.addEventListener("opfs-change", handler)
    return () => {
      init = true
      window.removeEventListener("opfs-change", handler)
    }
  }, [sort])

  return (
    <>
      <Row id="dv-recent-files">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center fw-bold">
          Recent Files
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
        </Col>
        <Col sm={12} className='d-flex justify-content-between align-items-center'>
          <ButtonToolbar aria-label="Recent Files Menu">
            <ButtonGroup size='sm' className="me-2" aria-label="Recent Files">
              <Button variant='outline-secondary' onClick={handleClearRecent} disabled={!fileCount > 0}><i className='bi bi-x-circle' /> Reset</Button>
            </ButtonGroup>
            <ButtonGroup size='sm' className="me-2" aria-label="Recent Files">
              <Button variant='outline-secondary' onClick={handleClickSort} title="Sort by Date" ><i className={`bi bi-sort-${sort? 'down' : 'up'}`} /></Button>
            </ButtonGroup>
          </ButtonToolbar>
          {storage && <>
            <span className='text-muted' style={{fontSize: 'x-small'}}>{ humanFileSize(storage.usage) } of { humanFileSize(storage.quota) } used</span>
          </> }
        </Col>
      </Row>
      <Row className={`h-100 overflow-auto ${recentFiles.length === 0? 'align-content-center': 'align-content-start'}`}>
        <Col sm={12} className='py-1'>
          <Form.Control type="search" size="sm" placeholder="Search" onChange={(e) => setFilter(e.target.value)} />
        </Col>
        <Col sm={12} className='p-2'>
          {recentFiles.length === 0? <div className='text-center'>
              <i className='bi-file-earmark-zip text-muted fs-1' />
              <p className='small'>No Recent Files.</p>
            </div>
            :
          <ListGroup as="ul" variant="flush">
            {recentFiles.map((el, idx) => <RecentFilesItem key={idx} {...el} hasFilter={filter} /> )}
          </ListGroup>
}
        </Col>
      </Row>
    </>
  )
}