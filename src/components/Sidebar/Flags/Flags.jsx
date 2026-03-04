import { useState, useEffect, useCallback, Fragment } from 'react'

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'

import FlagItem from './FlagItem'

import { useDispatch, useSelector } from 'react-redux';
import { flagToggleActive } from '../../../features/flag.slice'

import useHelp from '../../../hooks/useHelp';
import useFlagData from '../../../hooks/useFlagData';

import DatumOffCanvas from '../../Main/DatumOffCanvas'
import useGetFilteredData from '../../../hooks/useGetFilteredData';

export default function Flags(props) {

  const parameters = useSelector(state => state.parameters);
  const flags = useSelector(state => state.flags);

  const [flagged, setFlagged] = useState([]);
  const [collapsed, setCollapsed] = useState(new Set());

  const help = useHelp();
  const flag = useFlagData();
  const dispatch = useDispatch();
  const {getFilteredData } = useGetFilteredData();

  const handleClickHelp = useCallback( ()=>{
    help.open("Help | Flag Data", "help/md/data-flag.md")
  },[] )

  const handleClickReset = useCallback(() => flag.resetFlags(), [] )

  useEffect(() => {
    setFlagged( getFilteredData('flags').data() )
  }, [flags.checksum])

  const [datumid, setDatumid] = useState(null)
  const [datumstate, setDatumstate] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const showDatum = (id) => {
    setDatumid(id)
    setDatumstate(true)
  }  

  const hideDatum = () => setDatumstate(false);

  const handleClickToggleCollapse = useCallback((pmID) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(pmID) ? next.delete(pmID) : next.add(pmID);
      return next;
    });
  }, []);

  const handleClickToggleActivity = () => {
    dispatch(flagToggleActive())
  };

  return (
    <>
      <Row id='dv-flags'>
        <Col sm={12} className="my-2 border-bottom d-flex justify-content-between align-items-center fw-bold">
          Flagged Data
          <Button variant={null} onClick={handleClickHelp}><i className='bi bi-question-circle' /></Button>
        </Col>
        <Col sm={12}>
          <ButtonToolbar aria-label="Flags Menu">
            <ButtonGroup size='sm' className="me-2" aria-label="Flags">
              <Button variant='outline-secondary' onClick={handleClickToggleActivity} disabled={!flagged.length > 0}><i className={flags.isActive? 'bi bi-toggle-on' : 'bi bi-toggle-off'} /> Active</Button>
              <Button variant='outline-secondary' onClick={handleClickReset} disabled={!flagged.length > 0}><i className='bi bi-x-circle' /> Reset</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>

      <Row className={`h-100 overflow-auto${(flagged.length === 0) ? ' align-items-center' : ''}`}>
        <Col sm={12} className='p-0'>
          {flagged.length === 0 && <div className='text-center text-muted'>
              <i className='bi bi-flag text-muted fs-1' />
              <p className='small'>Flagged Data</p>
            </div>
          }
          {flagged.length > 0 && [...new Set(flagged.map(itm => itm.parameter))].map((pmID, idx) => {
              const param = parameters.find(itm => itm.id == pmID);
              const isCollapsed = collapsed.has(pmID);
              
              return (<Fragment key={idx}>
              <div className='px-2 small mt-2 fw-bold border-bottom' role='button' onClick={() => handleClickToggleCollapse(pmID)}>
                <i className={`bi bi-chevron-${isCollapsed ? 'right' : 'down'}`} /> {param.alias || param.name}
              </div>
              {!isCollapsed && (
                <ListGroup as="ul" variant="flush" className={flags.isActive? '' : 'opacity-50'}>
                  {flagged.map((el, idx) => {
                    if (pmID == el.parameter)
                      return <FlagItem key={idx} index={idx} {...el} onClick={() => showDatum(el.datumId)} />;
                  })}
                </ListGroup>
              )}
              </Fragment>)
            })
          } 
        </Col>
      </Row>
      <DatumOffCanvas onHide={hideDatum} show={datumstate} datumid={datumid} darkmode={`${props.darkmode}`} />
    </>
  )
}