import React from 'react';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'

export default function ModalDialogStart(props) {

  return (
    <Modal
      show={props.show}
      onHide={() => props.onHide()}
      keyboard={true}
      size={'sm'}
      centered
    >
      <Modal.Body className="text-center">
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
      </Modal.Body>
    </Modal>
  )
}