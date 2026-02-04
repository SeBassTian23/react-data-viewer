import { memo, useCallback } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { ReactSortable } from "react-sortablejs";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import DashboardWidget from '../components/Main/DashboardWidget'
import { dashboardDnDPanel } from '../features/dashboard.slice'

const MemoizedDashboardWidget = memo(DashboardWidget)

export default function Dashboard(props) {

  const analysis = useSelector(state=>state.analysis)
  const state = useSelector(state=>state.dashboard)
  const dispatch = useDispatch();

  // Memoize setList so it doesn't change on every render
  const setList = useCallback((newState) => {
    const ids = newState.map(item => item.id)
    dispatch(dashboardDnDPanel(ids))
  }, [dispatch])

  return (
    <>
      <Row className='position-absolute'>
        <Col>
          <span className='fs-3'>{analysis.name}</span> <span className='text-muted'>{new Date(analysis.updated_at).toLocaleString()}</span>
        </Col>
      </Row>
      {state.length === 0 ?
        <Row className='vh-100 align-items-center'>
          <div className="text-center">
            <i className="bi-columns-gap text-muted fs-1" />
            <span className="d-block text-muted fs-5">Dashboard</span>
            <span className="small">Add Panels to your Dashboard to enrich your Analysis and save your Results.<br />Use the <i className="bi-window-plus"></i>&nbsp;button when available to add the view as a Panel.</span>
          </div> 
        </Row> : 
        <ReactSortable handle='.bi-grip-vertical' className='row px-2 pb-1 pt-5 vh-100 align-content-start flex-wrap' list={ state.map(item => ({ ...item })) } setList={ newState => setList([...newState]) } animation={200} delayOnTouchStart={true} delay={2}>
          {state.map((item, idx) => {
            const key = item?.type === 'map'? `${item.id}-${idx}` : item.id
            return <MemoizedDashboardWidget key={key} {...item} {...props}/>
          })}
        </ReactSortable>
      }
    </>
  )
}