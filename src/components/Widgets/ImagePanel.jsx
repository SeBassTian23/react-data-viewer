import { useState, useRef, useEffect, useCallback } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import { useSelector, useDispatch } from 'react-redux'
import { dashboardEditPanel } from '../../features/dashboard.slice'

export default function ImagePanel(props) {

  const dispatch = useDispatch()

  const [state, setState] = useState(false)

  const fileInput = useRef()

  const handleImageSelect = (e) => {
    const file = e.target.files[0];

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
  }

  useEffect(() => setState( props.content? true : false ), [props.content])

  const imageNewTab = (base64String) => {
    let image = new Image();
    image.src = base64String;
    var newTab = window.open();
    newTab.document.body.innerHTML = image.outerHTML;
  }

  const handleClick = useCallback(() => imageNewTab(props.content.base64))

  return (
    <>
      {!state && <>
        <Card.Body className='p-1 overflow-y-hidden'>
          <Row className='m-0 p-0'>
            <Col className='p-1'>
              <Form.Group className="my-auto">
                <Form.Label className='form-label-header'>Image</Form.Label>
                <Form.Control onChange={handleImageSelect} size="sm" required type="file" ref={fileInput} multiple={false} accept="image/png, image/webp, image/svg+xml, image/jpeg, image/tiff, image/gif" />
                <Form.Text muted className='d-block my-2  text-center'>
                  Add an image file to your analysis. Supported image file formats are: <b>.jpg/.jpeg</b>, <b>.png</b>, <b>.tif/.tiff</b>, <b>.gif</b>, <b>.svg</b>, and <b>.webp</b>.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
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
