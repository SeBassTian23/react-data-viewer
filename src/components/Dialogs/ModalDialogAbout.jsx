import React from 'react';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function ModalDialogAbout(props) {

  return (
    <Modal
      show={props.show}
      onHide={() => props.onHide()}
      backdrop="static"
      keyboard={true}
      size={'sm'}
      centered
    >
      <Modal.Body className="text-center">
        <img src='./icon.svg' alt='App Logo' className="img-fluid w-25" />
        <h5>{__APP_NAME__}</h5>
        <h6 className='text-muted'>{__APP_DESCRIPTION__}</h6>
        <small>Created by: {__APP_AUTHOR__.split(' <')[0]}</small>
        <br />
        <small>Version {__APP_VERSION__}</small>
        <br />
        <small>&copy;{new Date().getUTCFullYear()} &bull; {__APP_LICENSE__}</small>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button variant="link" className='fs-6 text-decoration-none col-12 m-0 rounded-0 border-end' onClick={() => props.onHide()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}