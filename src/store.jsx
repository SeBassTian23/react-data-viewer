import { configureStore } from '@reduxjs/toolkit'

import dashboardReducer from './features/dashboard.slice'
import datasubsetReducer from './features/datasubset.slice'
import parameterReducer from './features/parameter.slice'
import mapReducer from './features/map.slice'
import plotReducer from './features/plot.slice'
import thresholdReducer from './features/threshold.slice'
import bookmarkReducer from './features/bookmark.slice'
import analysisReducer from './features/analysis.slice'
import toastReducer from './features/toast.slice'
import offcanvasReducer from './features/offcanvas.slice'
import modalReducer from './features/modal.slice'

import triggerOPFSSync from './utils/opfs/triggerOPFSSync'

const opfsMiddleware = store => next => action => {
  const result = next(action);
  let state = store.getState()
  if( state?.analysis?.saveAs != '' && state?.analysis?.files.length > 0){
    triggerOPFSSync(state.analysis.saveAs + '.json', store.getState());
    console.log('trigger - save state')
  }
  return result;
};

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    datasubsets: datasubsetReducer,
    parameters: parameterReducer,
    map: mapReducer,
    plot: plotReducer,
    thresholds: thresholdReducer,
    bookmarks: bookmarkReducer,
    analysis: analysisReducer,
    toast: toastReducer,
    offcanvas: offcanvasReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(opfsMiddleware)
})

export default store