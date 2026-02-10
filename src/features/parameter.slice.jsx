import { createSlice } from '@reduxjs/toolkit'

const initialState = [];

const parameterSlice = createSlice({
  name: 'parameters',
  initialState,
  reducers: {
    parametersAdded(state, action) {
      return action.payload
    },
    parameterToggled(state, action) {
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
    parameterFilterToggled(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload) {
          const updatedItem = {
            ...item,
            isFilter: !item.isFilter
          }
          return updatedItem
        }
        return item
      })
    },
    parametersAddBackup(state, action) {
      return action.payload
    },
    parametersEdit(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload.id) {
          const { id, ...update } = action.payload;
          const updatedItem = {
            ...item,
            ...update
          }
          return updatedItem
        }
        return item
      })
    },
    parametersReset(state, action) {
      return initialState;
    }
  }
})

export const { parametersAdded, parameterToggled, parameterFilterToggled, parametersAddBackup, parametersEdit, parametersReset } = parameterSlice.actions
export default parameterSlice.reducer
