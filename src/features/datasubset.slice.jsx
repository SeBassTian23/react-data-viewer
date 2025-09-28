import { createSlice } from '@reduxjs/toolkit'

import { defaults as colors } from 'plotly.js/src/components/color/attributes.js'

const initialState = [];

const datasubsetSlice = createSlice({
  name: 'datasubsets',
  initialState,
  reducers: {
    datasubsetToggled(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload) {
          const updatedItem = {
            ...item,
            isVisible: !item.isVisible
          }
          return updatedItem
        }
        return item
      })
    },
    datasubsetDblToggled(state, action) {

      return state.map((item, idx) => {
        if (item.id === action.payload) {
          const updatedItem = {
            ...item,
            isVisible: item.isVisible
          }
          return updatedItem
        }
        else {
          const updatedItem = {
            ...item,
            isVisible: !item.isVisible
          }
          return updatedItem
        }
      })
    },
    datasubsetAdded(state, action) {
      const assignedColor = colors[(state.length % colors.length + colors.length) % colors.length]
      state.push({ ...action.payload, color: assignedColor, id: crypto.randomUUID() })
    },
    datasubsetMultipleAdded(state, action) {
      let addedItems = []
      for (let i in action.payload) {
        let assignedColor = colors[(state.length + i % colors.length + colors.length) % colors.length]
        addedItems.push({ ...action.payload[i], color: assignedColor, id: crypto.randomUUID() })
      }
      return [...state, ...addedItems]
    },
    datasubsetDeleted(state, action) {
      return state.filter((item) => item.id !== action.payload)
    },
    datasubsetReset(state, action) {
      return initialState;
    },
    datasubsetShowAll(state, action) {
      return state.map(item => {
        const updatedItem = {
          ...item,
          isVisible: true
        }
        return updatedItem
      })
    },
    datasubsetHideAll(state, action) {
      return state.map(item => {
        const updatedItem = {
          ...item,
          isVisible: false
        }
        return updatedItem
      })
    },
    datasubsetEdited(state, action) {
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
    datasubsetDnD(state, action) {
      const ids = action.payload.map(item => item.id)
      const updatedState = []
      state.forEach(function (a) {
        updatedState[ids.indexOf(a.id)] = a;
      });
      return updatedState;
    }
  }
})

export const { datasubsetToggled, datasubsetDblToggled, datasubsetAdded, datasubsetMultipleAdded, datasubsetDeleted, datasubsetReset, datasubsetShowAll, datasubsetHideAll, datasubsetEdited, datasubsetDnD } = datasubsetSlice.actions
export default datasubsetSlice.reducer
