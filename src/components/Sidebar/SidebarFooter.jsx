import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import humanFileSize from '../../helpers/humanFileSize'

import { getDatasetCount } from '../../modules/database'

export default function SidebarFooter(props) {

  const stateParameters = useSelector(state => state.parameters)
  const stateThresholds = useSelector(state => state.thresholds)
  const stateDatasubsets = useSelector(state => state.datasubsets)
  const stateBookmarks = useSelector(state => state.bookmarks)

  const [count, setCount] = useState(0);
  const [parameters, setParameters] = useState([0,0]);
  const [memory, setMemory] = useState([0,0]);

  useEffect(() => {
    setCount(getDatasetCount())
    setParameters([
      stateParameters.length,
      stateParameters.filter(x => x.isSelected).length
    ])
  }, [stateParameters, stateDatasubsets, stateThresholds, stateBookmarks])

  useEffect(() => {
    const interval = setInterval(() => {
      const mem = performance.memory
      setMemory([( mem.usedJSHeapSize / mem.jsHeapSizeLimit * 100 ).toFixed(0) +' %', humanFileSize(mem.usedJSHeapSize, 0) ]);
    }, 1000);

    return () => clearInterval(interval); // Cleanup function
  }, []);

  return (
    <Row id="dv-sidebar-footer">
      <Col sm={12} className='border-top d-flex justify-content-evenly align-items-center small py-2'>
        <span title='Total Number of Rows (Data-Sets)'><i className={count > 0 ? 'bi-database-fill-check' : 'bi-database-fill'} /> {count}</span>
        <span title={`Parameters (${parameters.join("|")})`}><i className='bi bi-toggles' /> {parameters[1]}</span>
        <span className={`${stateThresholds.filter(x => x.isSelected).length > 0 ? 'text-danger' : ''}`} title='Thresholds'><i className='bi-bar-chart-steps' /> {stateThresholds.filter(x => x.isSelected).length}</span>
        <span title='Bookmarks'><i className='bi bi-journal-bookmark-fill' /> {stateBookmarks.length}</span>
        <span className='d-flex align-items-center' title='Resources (Memory)'><i className='bi bi-cpu' /> <span className="d-flex flex-column w-100 text-end footer-memory">
            <span className='text-nowrap'>{memory[0]}</span>
            <span className='text-nowrap'>{memory[1]}</span>
          </span>
        </span>
      </Col>
    </Row>
  )
}
