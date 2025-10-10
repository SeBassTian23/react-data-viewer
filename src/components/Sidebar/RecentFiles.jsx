import { useState, useEffect, useCallback } from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import RecentFilesItem from './RecentFilesItem'
import useHelp from '../../hooks/useHelp';

export default function RecentFiles() {

  const [recentFiles, setRecentFiles] = useState([]);

  const help = useHelp();

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Analysis", "help/md/analysis.md")
  },[] )

  const handleClearRecent = useCallback( ()=> {
    setRecentFiles([]);
    localStorage.setItem('APP_USER_RECENT_FILES', JSON.stringify(recentFiles, null));
  }, [] )

  useEffect( ()=>{
    let files = localStorage.getItem('APP_USER_RECENT_FILES');
    if( files ) {
      files = JSON.parse(files);
      setRecentFiles(files);
    }
  },[localStorage.getItem('APP_USER_RECENT_FILES')])

  return (
    <>
      <Row id="dv-recent-files">
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center">
          Recent Files
          <Button variant={null} onClick={handleClickHelp}><i className='bi-question-circle' /></Button>
        </Col>
        <Col sm={12}>
          <ButtonToolbar aria-label="Recent Files Menu">
            <ButtonGroup size='sm' className="me-2" aria-label="Recent Files">
              <Button variant='outline-secondary' onClick={handleClearRecent}><i className='bi-x-circle' /> Reset</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Row className={`h-100 overflow-auto ${recentFiles.length === 0? 'align-content-center': 'align-content-start'}`}>
        <Col sm={12} className='p-2'>
          {recentFiles.length === 0? <div className='text-center'>
              <i className='bi-file-earmark-zip text-muted fs-1' />
              {/* <span className='d-block text-muted fs-5'>Recent Files</span> */}
              <p className='small'>No Recent Files.</p>
            </div>
            :
          <ListGroup as="ul" variant="flush">
            {[...recentFiles].reverse().map((el, idx) => <RecentFilesItem key={idx} index={idx} {...el} /> )}
          </ListGroup>
}
        </Col>
      </Row>
    </>
  )
}
