import { useEffect, useState } from 'react'

import SidebarNavigation from './SidebarNavigation'
import SidebarTabs from './SidebarTabs'
import SidebarFooter from './SidebarFooter'

export default function Sidebar(props) {

  const [analysisModal, setAnalysisModal] = useState(false);
  const [modalImport, setModalImport] = useState(false);
  const [togglesidebar, setTogglesidebar] = useState(true);
  const [userModal, setUserModal] = useState(false);

  return (
    <>
      <SidebarNavigation 
        toggle={togglesidebar}
        setToggle={setTogglesidebar}
        analysisModal={analysisModal}
        setAnalysisModal={setAnalysisModal}
        modalImport={modalImport}
        setModalImport={setModalImport}
        userModal={userModal}
        setUserModal={setUserModal}
        {...props}
      />
      <aside className={`flex-column flex-shrink-0 vh-100 border-end pt-2 ${!togglesidebar ? 'd-none' : 'd-flex'}`} id="dv-sidebar" >
        <SidebarTabs show={togglesidebar} setTogglesidebar={setTogglesidebar} setAnalysisModal={setAnalysisModal} modalImport={modalImport} setModalImport={setModalImport} {...props} />
        <SidebarFooter {...props} />
      </aside>
    </>
  )
}
