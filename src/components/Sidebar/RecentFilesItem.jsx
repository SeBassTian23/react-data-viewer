import ListGroup from 'react-bootstrap/ListGroup';

export default function RecentFilesItem(props) {

  const handleClickRecent = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'l',
      code: 'KeyL',
      metaKey: true,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  };

  return (
    <ListGroup.Item as="li" className='list-group-item-action cursor-pointer px-2 py-1 m-0' title={props.notes || props.title}
      onClick={handleClickRecent}
    >
      <div className='d-flex justify-content-between'>
        <strong className='d-block text-truncate'>{props.title}</strong>
        <small>{new Date(props.lastModifiedDate).toLocaleDateString()}</small>
      </div>
      <small><i className="bi bi-file-earmark-zip" /> {props.name}</small>
    </ListGroup.Item>
  )
}
