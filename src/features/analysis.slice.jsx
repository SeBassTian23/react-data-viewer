import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  name: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  files: [],
  saveAs: "analysis",
  notes: "",
  creator: {
    name: localStorage.getItem('APP_USER_NAME'),
    email: localStorage.getItem('APP_USER_EMAIL'),
    avatar: localStorage.getItem('APP_USER_AVATAR')
  },
  app_version: __APP_VERSION__
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    analysisAddFile(state, action) {
      return {...state, ...{files: [action.payload], updated_at: new Date().toISOString()}}
    },
    analysisAppendFile(state, action) {
      return {...state, ...{files: [...state.files, action.payload], updated_at: new Date().toISOString()}}
    },
    analysisUpdate(state, action) {
      let keys = Object.keys(action.payload);
      let isUpdated = {};
      keys.forEach( key => {
        if(state[key] !== undefined && state[key] !== action.payload[key])
          isUpdated = {updated_at: new Date().toISOString(), app_version: __APP_VERSION__};
      })
      return {...state, ...action.payload, ...isUpdated}
    },
    analysisReset(state, action) {
      return {...initialState, ...{creator: {
        name: localStorage.getItem('APP_USER_NAME'),
        email: localStorage.getItem('APP_USER_EMAIL'),
        avatar: localStorage.getItem('APP_USER_AVATAR')
      }}}
    },
    analysisAddBackup(state, action) {
      return action.payload
    }
  }
})

export const { analysisAddFile, analysisAppendFile, analysisUpdate, analysisReset, analysisAddBackup } = analysisSlice.actions
export default analysisSlice.reducer
