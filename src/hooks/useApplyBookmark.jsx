import { useDispatch } from 'react-redux';

import { dashboardAddMultiplePanels } from '../features/dashboard.slice'
import { datasubsetMultipleAdded, datasubsetReset } from '../features/datasubset.slice'
import { mapApplySettings } from '../features/map.slice'
import { parametersAddBackup } from '../features/parameter.slice'
import { plotUpdate } from '../features/plot.slice'
import { thresholdAddBackup } from '../features/threshold.slice'
import { getSingleDatumByField } from '../modules/database'
import useToast from "../hooks/useToast";

export function useApplyBookmark() {

  const dispatch = useDispatch()

  const toast = useToast();

  const applyBookmark = (id) => {

    let analysis = getSingleDatumByField(id, 'id', 'bookmarks');

    if (analysis && analysis.store !== undefined) {
      if (analysis.store.dashboard !== undefined)
        dispatch(dashboardAddMultiplePanels(analysis.store.dashboard))
      if (analysis.store.datasubsets !== undefined) {
        dispatch(datasubsetReset())
        dispatch(datasubsetMultipleAdded(analysis.store.datasubsets))
      }
      if (analysis.store.map !== undefined)
        dispatch(mapApplySettings(analysis.store.map))
      if (analysis.store.parameters !== undefined)
        dispatch(parametersAddBackup(analysis.store.parameters))
      if (analysis.store.plot !== undefined)
        dispatch(plotUpdate(analysis.store.plot))
      if (analysis.store.thresholds !== undefined)
        dispatch(thresholdAddBackup(analysis.store.thresholds))

      toast.info("Selected bookmark applied", "Bookmark", "bi-journal-bookmark-fill")
    }
    else {
      toast.error("Failed to apply bookmark", "Bookmark", "bi-journal-bookmark-fill")
    }
  }

  return applyBookmark
}