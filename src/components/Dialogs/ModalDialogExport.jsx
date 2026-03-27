import { useState } from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import useExport from '../../hooks/useExport';
import { ListGroup } from 'react-bootstrap';

export default function ModalDialogExport(props) {

  const exportNotebook = useExport();
  const [format, setFormat] = useState("ipynb");

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handleClickExport = () => {
    if(format === "ipynb")
      exportNotebook.downloadIPYNB({dashboard: false});
    if(format === "rmd")
      exportNotebook.downloadRMD({dashboard: false});
    if(format === "xlsx")
      exportNotebook.downloadXLSX({dashboard: false});
    props.onHide(true)
  }
  
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Body className='p-4 row'>
        <span className="d-flex align-items-center fs-5">
          <i className="bi bi-journal-code me-2 fs-3 text-muted" /> Export Analysis
          {/* <Button variant={null} onClick={handleClickHelp} className='ms-auto'><i className='bi bi-question-circle' /></Button> */}
        </span>

        <Form.Group className="col-12 col-md-12 mt-2">
          <div className='text-muted fs-6'>File Format</div>
          <ListGroup variant='flush'>
            <ListGroup.Item className='px-1'>
              <Form.Check // prettier-ignore
                  type="radio"
                  id={`format-1`}
                  label={<>Jupyter <small className='text-muted font-monospace'>(.ipynb)</small></>}
                  name="export-format"
                  value="ipynb"
                  checked={format === "ipynb"}
                  onChange={handleFormatChange}
                />
            </ListGroup.Item>
            <ListGroup.Item className='px-1'>
              <Form.Check // prettier-ignore
                type="radio"
                id={`format-2`}
                label={<>RStudio <small className='text-muted font-monospace'>(.rmd)</small></>}
                name="export-format"
                value="rmd"
                checked={format === "rmd"}
                onChange={handleFormatChange}
                // disabled
              />
            </ListGroup.Item>
            <ListGroup.Item className='px-1'>
              <Form.Check // prettier-ignore
                type="radio"
                id={`format-3`}
                label={<>Excel <small className='text-muted font-monospace'>(.xlsx)</small></>}
                name="export-format"
                value="xlsx"
                checked={format === "xlsx"}
                onChange={handleFormatChange}
                // disabled
              />
            </ListGroup.Item>
          </ListGroup>
        </Form.Group>

      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button onClick={handleClickExport} variant='link' className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end'><strong>{props.yes || 'Export'}</strong></Button>
        <Button onClick={() => props.onHide(false)} variant='link' className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end text-danger'>{props.no || 'Cancel'}</Button>
      </Modal.Footer>
    </Modal>
  );
}