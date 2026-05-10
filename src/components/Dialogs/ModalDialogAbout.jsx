import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const CURRENT_YEAR = new Date().getUTCFullYear();

export default function ModalDialogAbout({ show, onHide }) {

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={true}
      size='sm'
      centered
    >
      <Modal.Body className="d-flex flex-column align-items-center">
        <img src='./icon.svg' alt='App Logo' className="w-25" />
        <span className='fs-5'>{__APP_NAME__}</span>
        <span className='fs-6 text-secondary'>{__APP_DESCRIPTION__}</span>
        <small>Created by: {__APP_AUTHOR__.split(' <')[0]}</small>
        <small>Version {__APP_VERSION__}</small>
        <small>©{CURRENT_YEAR} • {__APP_LICENSE__}</small>
        <span className='d-flex justify-content-center gap-3'>
          <span className='small'>
            Source: <a href={__APP_URL__} target='_blank'>GitHub ↗</a>
          </span>
          <a href={__APP_ISSUES_URL__} className='small' target='_blank'>Report Issue ↗</a>
        </span>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button 
          variant="link"
          className='fs-6 text-decoration-none col-12 m-0 rounded-0 border-end'
          onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}