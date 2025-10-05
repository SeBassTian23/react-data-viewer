import { createSlice } from '@reduxjs/toolkit'

const initialState = [];

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    dashboardAddPanel(state, action) {
      state.unshift({ ...action.payload, id: crypto.randomUUID(), size: { sm: 6, md: 4, lg: 4, xl: 4 }, chosen: false, selected: false, notes: null })
    },
    dashboardAddMultiplePanels(state, action) {
      return action.payload || []
    },
    dashboardEditPanel(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload.id) {
          const updatedItem = {
            ...item,
            content: action.payload.content || item.content
          }
          return updatedItem
        }
        return item
      })
    },
    dashboardEditPanelNotes(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload.id) {
          const updatedItem = {
            ...item,
            notes: action.payload || null
          }
          return updatedItem
        }
        return item
      })
    },
    dashboardResetPanel(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload.id) {
          const updatedItem = {
            ...item,
            content: null
          }
          return updatedItem
        }
        return item
      })
    },
    dashboardEditTitlePanel(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload.id) {
          const updatedItem = {
            ...item,
            title: action.payload.title || 'Untitled'
          }
          return updatedItem
        }
        return item
      })
    },
    dashboardToggleSizePanel(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload.id) {
          const updatedItem = {
            ...item,
            size: action.payload.size
          }
          return updatedItem
        }
        return item
      })
    },
    dashboardSetPanelSize(state, action) {
      return state.map((item, idx) => {
        if (item.id === action.payload.id) {
          const updatedItem = {
            ...item,
            size: action.payload.size
          }
          return updatedItem
        }
        return item
      })
    },
    dashboardDeletePanel(state, action) {
      return state.filter((item, idx) => item.id !== action.payload)
    },
    dashboardReset(state, action) {
      return initialState;
    },
    dashboardDnDPanel(state, action) {
      const ids = action.payload
      const updatedState = []
      state.forEach(function (a) {
        updatedState[ids.indexOf(a.id)] = a;
      });
      return updatedState;
    }
  }
})

export const { dashboardAddPanel, dashboardAddMultiplePanels, dashboardEditPanel, dashboardEditPanelNotes, dashboardResetPanel, dashboardEditTitlePanel, dashboardToggleSizePanel, dashboardSetPanelSize, dashboardDeletePanel, dashboardReset, dashboardDnDPanel } = dashboardSlice.actions
export default dashboardSlice.reducer
