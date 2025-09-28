import { configureStore } from '@reduxjs/toolkit'

import dashboardReducer from './features/dashboard.slice'
import datasubsetReducer from './features/datasubset.slice'
import parameterReducer from './features/parameter.slice'
import mapReducer from './features/map.slice'
import plotReducer from './features/plot.slice'
import thresholdReducer from './features/threshold.slice'
import bookmarkReducer from './features/bookmark.slice'
import analysisReducer from './features/analysis.slice'

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    datasubsets: datasubsetReducer,
    parameters: parameterReducer,
    map: mapReducer,
    plot: plotReducer,
    thresholds: thresholdReducer,
    bookmarks: bookmarkReducer,
    analysis: analysisReducer
  }
})

export default store