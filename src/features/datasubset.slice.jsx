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
    datasubsetAdded(state, action) {
      let addItem = { ...action.payload}
      if(!action.payload?.color)
        addItem.color = colors[(state.length % colors.length + colors.length) % colors.length]
      if(!action.payload?.id)
        addItem.id = crypto.randomUUID() 
      return [...state, addItem]
    },
    datasubsetMultipleAdded(state, action) {
      let addedItems = []
      for (let i in action.payload) {
        let addItem = { ...action.payload[i] }
        if(!action.payload[i]?.color)
          addItem.color = colors[(state.length + i % colors.length + colors.length) % colors.length]
        if(!action.payload[i]?.id)
          addItem.id = crypto.randomUUID()         
        addedItems.push(addItem)
      }
      return [...state, ...addedItems]
    },
    datasubsetDeleted(state, action) {
      return state.filter((item) => item.id !== action.payload)
    },
    datasubsetsDeleted(state, action) {
      return state.filter((item) => !action.payload.includes(item.id))
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
      const ids = action.payload
      const updatedState = []
      state.forEach(function (a) {
        updatedState[ids.indexOf(a.id)] = a;
      });
      return updatedState;
    }
  }
})

export const { datasubsetToggled, datasubsetAdded, datasubsetMultipleAdded, datasubsetDeleted, datasubsetsDeleted, datasubsetReset, datasubsetShowAll, datasubsetHideAll, datasubsetEdited, datasubsetDnD } = datasubsetSlice.actions
export default datasubsetSlice.reducer
