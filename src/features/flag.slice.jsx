import { createSlice } from '@reduxjs/toolkit'
import md5 from '../helpers/md5';

const initialState = {
  checksum: null,
  datumIds: [],
  isActive: true
};

const flagSlice = createSlice({
  name: 'flag',
  initialState,
  reducers: {
    flagAdd(state, action) {
      let curr = [...new Set( [...state.datumIds, ...action.payload] )]
      return {
        checksum: md5(JSON.stringify(curr)+String(state.isActive)),
        datumIds: curr,
        isActive: state.isActive
      }
    },
    flagRemove(state, action) {
      let curr = state.datumIds.filter( e => !action.payload.includes(e) );
      return {
        checksum: md5(JSON.stringify(curr)+String(state.isActive)),
        datumIds: curr,
        isActive: state.isActive
      }
    },
    flagReset(state, action) {
      return initialState;
    },
    flagToggleActive(state, action) {
      return {
        ...state,
        isActive: !state.isActive,
        checksum: md5(JSON.stringify(state.curr)+String(!state.isActive))
      };
    }
  }
})

export const { flagAdd, flagRemove, flagReset, flagToggleActive } = flagSlice.actions
export default flagSlice.reducer
