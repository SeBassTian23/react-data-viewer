import {useState, useEffect, Fragment} from 'react'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

import widgets from '../../constants/widgets'
import { useAddDashboardPanel } from '../../hooks/useAddDashboardPanel';

export default function SidebarPanelMenuItems({darkmode}) {

  const addDashboardPanel = useAddDashboardPanel();

  const [dashboardMenuInactive, setDashboardMenuInactive] = useState(false);

  useEffect(() => {
    if (location.pathname === "/")
      setDashboardMenuInactive(false)
    else
      setDashboardMenuInactive(true)
  }, [location.pathname])

  return (<DropdownButton size="sm" as={ButtonGroup} className='column-dropdown' variant={darkmode ? "outline-light" : "outline-dark"} align="end" disabled={dashboardMenuInactive} title={<><i className="bi bi-window-plus" /> Panels</>}>
    {[
      { header: 'General', category: 'general' },
      { header: 'Statistics', category: 'statistics' },
      { header: 'Continuous/Numerical', category: 'statistics_numerical' },
      { header: 'Categorical/Count', category: 'statistics_category' },
      { header: 'Clustering', category: 'cluster' }
    ].map((wdgt, idx, arr) => <Fragment key={idx}>
      <Dropdown.Header>{wdgt.header}</Dropdown.Header>
      {widgets.filter(itm => itm.category === wdgt.category).map((itm, idx) => <Dropdown.Item key={idx} title={itm.tooltip || 'Add Panel'} onClick={() => addDashboardPanel(itm.type)}><i className={`bi ${itm.icon || "bi-clipboard-data"}`} /> {itm.name}</Dropdown.Item>)}
      {idx < arr.length - 1 && <Dropdown.Divider />}
    </Fragment>)}
  </DropdownButton>)
}