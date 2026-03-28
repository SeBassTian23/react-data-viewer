import { memo, useCallback, useState, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReactSortable } from "react-sortablejs";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import DashboardWidget from '../components/Main/DashboardWidget'
import { dashboardDnDPanel } from '../features/dashboard.slice'
import { thresholdToggle } from '../features/threshold.slice'
import { flagToggleActive } from '../features/flag.slice'
import { selectedThresholds } from '../store/thresholds'

import PanelMenuItems from '../components/Main/PanelMenuItems';

import widgets from '../constants/widgets';

import useHelp from '../hooks/useHelp'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import useModalConfirm from '../hooks/useModalConfirm';

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.duration(1, "minutes").humanize(); 

const MemoizedDashboardWidget = memo(DashboardWidget)

export default function Dashboard(props) {

  const analysis = useSelector(state => state.analysis)
  const state = useSelector(state => state.dashboard)
  const thresholds = useSelector(selectedThresholds)
  const parameters = useSelector(state => state.parameters)
  const flags = useSelector(state => state.flags)
  const dispatch = useDispatch();

  const help = useHelp();
  const modal = useModalConfirm();

  const [panelFilter, setPanelFilter] = useState([]);

  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const filteredState = useMemo(
    () => panelFilter.length === 0
      ? state
      : state.filter(item => panelFilter.includes(item.type)),
    [state, panelFilter]
  );

  // Memoize setList so it doesn't change on every render
  const setList = useCallback((newState) => {
    const ids = newState.map(item => item.id)
    dispatch(dashboardDnDPanel(ids))
  }, [dispatch])

  const handleDeactivateThreshold = (id) => {
    dispatch(thresholdToggle(id))
  }

  const handleDeactivateFlags = () => {
    dispatch(flagToggleActive())
  }

  const handleFilterChange = (type) => {
    setPanelFilter(prev => {
      if (prev.includes(type))
        return prev.filter(e => e !== type)
      return [...prev, type]
    })
  }

  const handleClickReset = useCallback(() => modal.show("confirm", {
      header: "Reset Dashboard",
      content: `Remove all panels from the Dashboard (A Bookmark is added before panels are removed)`,
      yes: "Reset",
      no: "Cancel",
      payload: {
        action: "DELETE_PANELS"
      }
    }), [modal])

  // Check if scrolling is possible and update button states
  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, [])

  // Scroll handler
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      // Check scroll state after animation
      setTimeout(checkScroll, 300);
    }
  }

  // Initialize and listen to scroll changes
  const handleContainerRef = (ref) => {
    scrollContainerRef.current = ref;
    if (ref) {
      checkScroll();
      ref.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
  }

  const handleReset = () => setPanelFilter([]);

  const typeToNameMap = {};
  widgets.forEach((widget) => {
    typeToNameMap[widget.type] = widget.name;
  });

  const panelTypes = [...new Set(state.map(itm => itm.type))].sort((a, b) => {
    const nameA = typeToNameMap[a] || "";
    const nameB = typeToNameMap[b] || "";
    return nameA.localeCompare(nameB);
  });


  const currentThresholds = thresholds.map(el => {
    return { ...el, name: parameters.find(i => i.name == el.name)?.alias || el.name }
  })

  const handleClickHelp = useCallback(() => {
    help.open('Help | Dashboard', 'help/md/dashboard.md')
  }, [help])

  return (
    <div id="dv-dashboard" className='d-flex flex-column vh-100'>
      <Row className='border-bottom sticky-top bg-sub'>
        <Col sm={12} className='pb-1 d-flex gap-2 align-items-baseline'>
          <span className='fs-4 fw-bold'>{analysis.name || 'New Analysis'}</span>
          <small className='text-body-secondary'>Last saved {dayjs(analysis.updated_at).fromNow()}</small>
        </Col>
        <Col className='pb-1 d-flex gap-2 align-items-center text-nowrap'>
          <ButtonGroup>
            <PanelMenuItems darkmode={props.darkmode} />
            <Dropdown className='d-inline btn-group' autoClose={false}>
              <Dropdown.Toggle size="sm" variant={props.darkmode ? "outline-light" : "outline-dark"} disabled={panelTypes.length < 2 ? true : false}>
                <i className='bi bi-window-stack' /> Select
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header>Select Panels</Dropdown.Header>
                {panelTypes.map(type => (
                  <Dropdown.Item key={type} as='li'>
                    <Form.Check
                      type='checkbox'
                      id={`filter-${type}`}
                      label={widgets.find(itm => itm.type == type)?.name || `Unknown (${type})`}
                      checked={panelFilter.includes(type)}
                      onChange={() => handleFilterChange(type)}
                    />
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleReset}>Reset</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
          <Button size='sm'
              aria-label='Reset Dashboard'
              variant={props.darkmode ? "outline-light" : "outline-dark"}
              onClick={handleClickReset}
              title="Reset Dashboard"
              className='me-2'
              disabled={state.length === 0}
            >
              <i className='bi bi-window-x' /> Reset
          </Button>
          <Button size='sm'
              aria-label='Show Help'
              variant={props.darkmode ? "outline-light" : "outline-dark"}
              onClick={handleClickHelp}
              title="Show Help"
              className='me-2'
            >
              <i className='bi bi-question-circle' />
          </Button>
            {/* Left Scroll Button */}
            {canScrollLeft && <Button size='sm'
              variant='secondary-outline'
              className='flex-shrink-0'
              onClick={() => scroll('left')}
              title="Scroll left"
            >
              <i className='bi bi-chevron-left' />
            </Button>}

            {/* Scrollable Filter Container */}
            <div
              ref={handleContainerRef}
              className='d-flex gap-2 flex-grow-1 overflow-x-auto overflow-y-hidden'
              style={{
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
              }}
            >

              {(flags.isActive && flags.datumIds.length > 0) && (
                <Badge 
                  pill
                  bg='danger' 
                  className='gap-2 text-nowrap'
                  title='Number of Currently Flagged Datapoints'>Flagged Data ({flags.datumIds.length})
                    <i 
                      className='bi bi-x-circle-fill ms-2'
                      title="Deactivate Flagged Data" 
                      role='button' 
                      aria-description='deactivate flagged data' onClick={handleDeactivateFlags} />
                </Badge>
              )}

              {currentThresholds.map((itm, idx) => (
                <Badge 
                  pill 
                  key={`threshold-${idx}`}
                  bg='primary'
                  className='gap-2 text-nowrap'
                  title="Applied Threshold" > {itm.name}: {(itm.min && itm.max)? itm.min + ' - ' + itm.max : (itm.min? '≳ '+ String(itm.min) : '≲ ' + String(itm.max))}
                    <i 
                      className='bi bi-x-circle-fill ms-2'
                      role='button'
                      title="Deactivate Threshold"
                      aria-description='deactivate threshold'
                      onClick={() => handleDeactivateThreshold(itm.id)} />
                </Badge>
              ))}
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && <Button
              size='sm'
              variant='secondary-outline'
              className='flex-shrink-0'
              onClick={() => scroll('right')}
              title="Scroll right"
            >
              <i className='bi bi-chevron-right' />
            </Button>}
        </Col>
      </Row>
      {state.length === 0 ?
        <Row className='align-items-center flex-grow-1'>
          <div className="text-center">
            <i className="bi bi-columns-gap text-body-secondary fs-1" />
            <span className="d-block text-body-secondary fs-5">Dashboard</span>
            <span className="small">Add Panels to your Dashboard to enrich your Analysis and save your Results.<br />Use the <i className="bi bi-window-plus"></i>&nbsp;button when available to add the view as a Panel.</span>
          </div>
        </Row> :
        <ReactSortable handle='.bi-grip-vertical' className='row px-2 pt-2 pb-1 align-content-start flex-wrap flex-grow-1' list={filteredState.map(item => ({ ...item }))} setList={newState => setList([...newState])} animation={200} delayOnTouchStart={true} delay={2}>
          {filteredState.map((item, idx) => {
            const key = item?.type === 'map' ? `${item.id}-${idx}` : item.id
            return <MemoizedDashboardWidget key={key} {...item} {...props} />
          })}
        </ReactSortable>
      }
    </div>
  )
}