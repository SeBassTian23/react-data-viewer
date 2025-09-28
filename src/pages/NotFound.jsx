import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function NotFound() {
  return (
    <Row className='vh-100 align-items-center'>
      <Col className="text-center">
        <i className="bi-bug text-muted fs-1"></i>
        <span className="d-block text-muted fs-5">Page Not Found</span>
        <span className="small">The requested page cannot be found or has been moved.</span>
      </Col>
    </Row>
  )
}
