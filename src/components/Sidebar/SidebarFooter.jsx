import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { getDatasetCount } from '../../modules/database'

export default function SidebarFooter(props) {

  const [count, setCount] = useState(0)

  const stateParameters = useSelector(state => state.parameters)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateBookmarks = useSelector(state => state.bookmarks)

  useEffect(() => {
    setCount(getDatasetCount())
  }, [stateParameters, stateDatasubsets, stateThresholds, stateBookmarks])

  return (
    <Row id="dv-sidebar-footer">
      <Col className='border-top d-flex justify-content-evenly'>
        <span className='small p-2' title='Total Number of Rows (Data-Sets)'><i className={count > 0 ? 'bi-database-fill-check' : 'bi-database-fill'} /> {count}</span>
        <span className='small p-2' title='Parameters - Active (Deactivated)'><i className='bi-toggles' /> {stateParameters.filter(x => x.isSelected).length}
          {(stateParameters.length !== stateParameters.filter(x => x.isSelected).length) && <>({stateParameters.length - stateParameters.filter(x => x.isSelected).length})</>}
        </span>
        <span className={stateThresholds.filter(x => x.isSelected).length > 0 ? 'small p-2 text-danger' : 'small p-2'} title='Thresholds - Active|Total'><i className='bi-bar-chart-steps' /> {stateThresholds.filter(x => x.isSelected).length}
          {(stateThresholds.length !== stateThresholds.filter(x => x.isSelected).length) && <>({stateThresholds.length - stateThresholds.filter(x => x.isSelected).length})</>}
        </span>
        <span className='small p-2' title='Bookmarks'><i className='bi bi-journal-bookmark-fill' /> {stateBookmarks.length}</span>
      </Col>
    </Row>
  )
}
