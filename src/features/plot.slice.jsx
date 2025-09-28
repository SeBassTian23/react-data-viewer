import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const plotSlice = createSlice({
  name: 'plot',
  initialState,
  reducers: {
    plotReset(state, action) {
      return initialState
    },
    plotUpdate(state, action) {
      return { ...action.payload }
    }
  }
})

export const { plotReset, plotUpdate } = plotSlice.actions
export default plotSlice.reducer