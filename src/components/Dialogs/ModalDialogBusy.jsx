import React from 'react'

import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner'

export default function ModalDialogBusy(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className='p-4 text-center'>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
        {props.content && <p className="mb-0 mt-2 small">{props.content}</p>}
      </Modal.Body>
    </Modal>
  );
}