import ListGroup from 'react-bootstrap/ListGroup'

export default function FlagItem({ onClick, ...props }) {

  const comment = props.comment || "Undefined Reason";

  return (
    <ListGroup.Item as="li" className="d-flex justify-content-between align-items-center"
      onClick={onClick}
      role='button'
      title={comment}
    >
      <span className='d-inline-block text-truncate'>{comment}</span>
      <span style={{fontSize: 'x-small', whiteSpace: 'nowrap'}}>(ID: {props.datumId})</span>
    </ListGroup.Item>
  )
}
