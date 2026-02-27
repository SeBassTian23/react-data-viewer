import { useState, useRef, useEffect, useCallback } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import { useDispatch } from 'react-redux'
import { dashboardEditPanel } from '../../features/dashboard.slice'

export default function ImagePanel(props) {

  const dispatch = useDispatch()

  const [state, setState] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInput = useRef();
  const refDragCounter = useRef(0);

  useEffect(() => setState( props.content? true : false ), [props.content])

  const imageNewTab = (base64String) => {
    let image = new Image();
    image.src = base64String;
    var newTab = window.open();
    newTab.document.body.innerHTML = image.outerHTML;
  }

  const handleClick = useCallback(() => imageNewTab(props.content.base64))

  const handleDroppedFile = useCallback((file)=>{
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(dashboardEditPanel({
        id: props.id, content: {
          base64: reader.result,
          lastModified: file.lastModified,
          name: file.name,
          size: file.size,
          type: file.type
        }
      }))
    }
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    refDragCounter.current = 0;
    setIsDragging(false);
    handleDroppedFile(e.dataTransfer.files[0]);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    refDragCounter.current += 1;
    if (refDragCounter.current === 1) {
      setIsDragging(true);
    }
  }

  const onDragLeave = (e) => {
    e.preventDefault();
    refDragCounter.current -= 1;
    if (refDragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const onFileChange = (e) => {
    console.log(e.dataTransfer)
    handleDroppedFile(e.target.files[0]);
  };

  return (
    <>
      {!state && <>
        <Card.Body className='p-1 overflow-y-hidden'
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
        >
          {isDragging? <div className="d-flex flex-column justify-content-center align-items-center p-1 card-body text-muted small">
              <i className="bi bi-file-earmark-plus fs-1"></i>
            </div>
          :
          <Row className='m-0 p-0'>
            <Col className='p-1'>
              <Form.Group className="my-auto">
                <Form.Label className='form-label-header'>Image</Form.Label>
                <Form.Control onChange={onFileChange} size="sm" required type="file" ref={fileInput} multiple={false} accept="image/png, image/webp, image/svg+xml, image/jpeg, image/tiff, image/gif" />
                <Form.Text muted className='d-block my-2  text-center'>
                  Add an image file to your analysis. Supported image file formats are: <b>.jpg/.jpeg</b>, <b>.png</b>, <b>.tif/.tiff</b>, <b>.gif</b>, <b>.svg</b>, and <b>.webp</b>.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          }
        </Card.Body>
      </>}
      {state && <>
        <Card.Body className='p-1 overflow-y-hidden' role='button' style={
          {
            "background": `url(${props.content.base64})`,
            "backgroundSize": "contain",
            "backgroundPosition": "center",
            "backgroundRepeat": "no-repeat"
          }}
          title={props.name}
          onClick={handleClick}></Card.Body>
      </>}
    </>
  )
}
