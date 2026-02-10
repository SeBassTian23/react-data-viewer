import {useEffect} from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';

export default function ModalDialogConfirm(props) {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        props.onHide(true);
      }
    };

    if (props.show) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [props.show, props]);

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Body className='p-4 text-center'>
        {props.header && <h5 className='mb-2'>{props.header}</h5>}
        {props.content && <p className="mb-0 small">{props.content}</p>}
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button onClick={() => props.onHide(true)} variant='link' className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end'><strong className="text-danger">{props.yes || 'Yes'}</strong></Button>
        <Button onClick={() => props.onHide(false)} variant='link' className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end'>{props.no || 'No'}</Button>
      </Modal.Footer>
    </Modal>
  );
}