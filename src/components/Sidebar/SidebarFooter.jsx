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


  const [memory, setMemory] = useState([0,0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const mem = performance.memory
      setMemory([(mem.usedJSHeapSize / 1048576).toFixed(2), (mem.totalJSHeapSize / 1048576).toFixed(2)]);
    }, 1000);

    return () => clearInterval(interval); // Cleanup function
  }, []);

  return (
    <Row id="dv-sidebar-footer">
      <Col sm={12} className='border-top d-flex justify-content-evenly align-items-center'>
        <span className='small p-2 px-0' title='Total Number of Rows (Data-Sets)'><i className={count > 0 ? 'bi-database-fill-check' : 'bi-database-fill'} /> {count}</span>
        <span className='small p-2 px-0' title='Parameters - Active (Deactivated)'><i className='bi-toggles' /> {stateParameters.filter(x => x.isSelected).length}
          {(stateParameters.length !== stateParameters.filter(x => x.isSelected).length) && <>({stateParameters.length - stateParameters.filter(x => x.isSelected).length})</>}
        </span>
        <span className={stateThresholds.filter(x => x.isSelected).length > 0 ? 'small p-2 px-0 text-danger' : 'small px-0 p-2'} title='Thresholds - Active|Total'><i className='bi-bar-chart-steps' /> {stateThresholds.filter(x => x.isSelected).length}
          {(stateThresholds.length !== stateThresholds.filter(x => x.isSelected).length) && <>({stateThresholds.length - stateThresholds.filter(x => x.isSelected).length})</>}
        </span>
        <span className='small p-2 px-0' title='Bookmarks'><i className='bi bi-journal-bookmark-fill' /> {stateBookmarks.length}</span>
        <span className='small p-2 px-0 d-flex align-items-center' title='Resources'><i className='bi bi-cpu' /> <span style={{fontSize: '0.5rem', lineHeight: '0.5rem', width: '1rem', padding: '0 0 0 0.2rem'}} className="d-flex flex-column"><span>{memory[0]}</span><span>{memory[1]}</span></span></span>
      </Col>
    </Row>
  )
}
