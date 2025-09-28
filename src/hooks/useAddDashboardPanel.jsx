import { useDispatch } from "react-redux";
import { dashboardAddPanel } from '../features/dashboard.slice';

import widgets from '../constants/widgets'

export function useAddDashboardPanel() {
  const dispatch = useDispatch();

  return (type) => {

    let itm = widgets.find( (itm) => itm.type === type )

    if(itm)
      dispatch(dashboardAddPanel({
        content: itm.content || null,
        linkTo: null,
        title: itm.name,
        type
      }))
  };
}
           