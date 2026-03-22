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
import flagReducer from './features/flag.slice'
import userReducer from './features/user.slice'

import triggerOPFSSync from './utils/opfs/triggerOPFSSync'

const opfsMiddleware = store => next => action => {
  const result = next(action);
  let state = store.getState();
  if( state?.analysis?.saveAs != '' && state?.analysis?.files.length > 0 && !action.type.endsWith('Reset')){
    let opfsState = {...state}
    delete opfsState.user
    triggerOPFSSync(state.analysis.saveAs + '.json', opfsState);
  }
  return result;
};

const localStorageMiddleware = store => next => action => {
  const result = next(action);
  if(action.type == "user/updateProfile"){
    if(localStorage.getItem('APP_USER_COOKIES')){
      for(let key in action.payload){
        const value = action.payload[key]
        switch (key) {
          case 'allowCookies':
            localStorage.setItem('APP_USER_COOKIES', 1)
            break;
          case 'avatar':
            localStorage.setItem('APP_USER_AVATAR', value)
            break;
          case 'colorScheme':
            localStorage.setItem('APP_USER_COLOR_PALETTE', value || 'default')
            break;
          case 'email':
            localStorage.setItem('APP_USER_EMAIL', value)
            break;
          case 'enableGravatar':
            localStorage.setItem('APP_USER_GRAVATAR', value)
            break;
          case 'name':
            localStorage.setItem('APP_USER_NAME', value)
            break;
        
          default:
            break;
        }
      }
    }
    else{
      localStorage.clear()
    }
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
    flags: flagReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(localStorageMiddleware)
      .concat(opfsMiddleware)
})

export default store