import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';

import HelpOffCanvas from '../Main/HelpOffCanvas';
import { useFileImport } from '../../hooks/useFileImport';

export default function ModalDialogImport(props) {
  
  const { processFile, isBusy, fileInvalid, setFileInvalid, resetState } = useFileImport();

  const { register, reset, getValues } = useForm({
    defaultValues: {
      file: "",
      delimiter: "",
      format: "wide",
      append: null
    }
  });

  const handleProcessFile = () => {
    const values = getValues();
    processFile(values, props.onHide);
  };

  // Combined reset function
  const handleReset = () => {
    reset(); // Reset form
    resetState(); // Reset hook state
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      backdrop={!isBusy ? true : 'static'}
      keyboard={!isBusy}
      onExit={handleReset}
      onEnter={() => {
        resetState();
        reset();
      }}
    >
      <Modal.Body className='p-4'>
        <Row>
          <Col sm={12}>
            <span className='float-end'>
              <HelpOffCanvas title='Help | Data Import' url='help/md/data-import.md' />
            </span>
            <span className="d-block fs-4">
              <i className="bi-box-arrow-in-down fs-1 text-muted" /> Import Data
            </span>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Form.Group className="my-3">
              <Form.Control 
                type="file" 
                {...register("file", { required: true })} 
                isInvalid={fileInvalid} 
                onChange={() => setFileInvalid(false)} 
                multiple={false} 
                accept="text/csv, text/plain, application/json, application/octet-stream" 
              />
              <Form.Text muted className='d-block my-2'>
                Supported files formats are comma separated files <b>(.csv)</b> and tab separated files <b>(.txt)</b>.
                Data can also be provided formatted as a JSON object <b>(.json)</b>.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col sm={12} className='mb-3'>
            <Row className="align-items-center">
              <Col xs="auto">
                <Form.Select className="mb-2" title="Column Delimiter" {...register("delimiter")}>
                  <optgroup label="Separator">
                    <option value="">Auto</option>
                    <option value=",">Comma</option>
                    <option value="\t">Tab</option>
                    <option value=";">Semicolon</option>
                  </optgroup>
                </Form.Select>
              </Col>
              <Col xs="auto">
                <Form.Select className="mb-2" title="Data Format" {...register("format")}>
                  <optgroup label="Format">
                    <option value="wide">Wide (default)</option>
                    <option value="long">Long</option>
                  </optgroup>
                </Form.Select>
              </Col>
              <Col xs="auto">
                <Form.Check type="checkbox" className="mb-2" label="Append Data" {...register("append")} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className='flex-nowrap p-0'>
        <Button 
          onClick={handleProcessFile}
          variant='link' 
          className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end' 
          disabled={isBusy}
        >
          <strong className="text-danger">{props.yes || 'Yes'}</strong>
        </Button>
        <Button 
          onClick={() => {
            handleReset();
            props.onHide(false);
          }}
          variant='link' 
          className='fs-6 text-decoration-none col-6 m-0 rounded-0 border-end' 
          disabled={isBusy}
        >
          {props.no || 'No'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}