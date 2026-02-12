import { createSlice } from '@reduxjs/toolkit'

const initialState = [];

const thresholdSlice = createSlice({
  name: 'thresholds',
  initialState: [],
  reducers: {
    thresholdAdd(state, action) {
      if (action.payload.name !== '' && (action.payload.min !== null || action.payload.max !== null))
        state.push({ ...action.payload, id: crypto.randomUUID(), isSelected: true })
    },
    thresholdDelete(state, action) {
      return state.filter((item) => item.id !== action.payload)
    },
    thresholdEdit(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload?.id) {
          const updatedItem = {
            ...item,
            min: action.payload.min || item.min,
            max: action.payload.max || item.max
          }
          console.log(updatedItem)
          return updatedItem
        }
        return item
      })
    },
    thresholdToggle(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload) {
          const updatedItem = {
            ...item,
            isSelected: !item.isSelected
          }
          return updatedItem
        }
        return item
      })
    },
    thresholdsReset(state, action) {
      return initialState;
    },
    thresholdAddBackup(state, action) {
      return action.payload
    },
  }
})

export const { thresholdAdd, thresholdDelete, thresholdEdit, thresholdToggle, thresholdsReset, thresholdAddBackup } = thresholdSlice.actions
export default thresholdSlice.reducer
