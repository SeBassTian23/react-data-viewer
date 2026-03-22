import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import colorSchemes from '../constants/color-schemes'

const initialState = [];

export const datasubsetAdded = createAsyncThunk(
  'datasubsets/datasubsetAdded',
  (payload, { getState }) => {
    const state = getState();
    const colorPalette = colorSchemes[state.user.colorScheme];
    const currentDatasubsets = state.datasubsets;

    let addItem = { ...payload };
    if (!addItem.color) {
      addItem.color = colorPalette[(currentDatasubsets.length % colorPalette.length + colorPalette.length) % colorPalette.length];
    }
    if (!addItem.id) {
      addItem.id = crypto.randomUUID();
    }
    return addItem;
  }
)

export const datasubsetMultipleAdded = createAsyncThunk(
  'datasubsets/datasubsetMultipleAdded',
  (payload, { getState }) => {
    const state = getState();
    const colorPalette = colorSchemes[state.user.colorScheme];
    const currentDatasubsets = state.datasubsets;

    let addedItems = [];
    for (let i in payload) {
      let addItem = { ...payload[i] };
      if (!addItem.color) {
        addItem.color = colorPalette[(currentDatasubsets.length + i % colorPalette.length + colorPalette.length) % colorPalette.length];
      }
      if (!addItem.id) {
        addItem.id = crypto.randomUUID();
      }
      addedItems.push(addItem);
    }
    return addedItems;
  }
)

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(datasubsetAdded.fulfilled, (state, action) => {
        return [...state, action.payload];
      })
      .addCase(datasubsetMultipleAdded.fulfilled, (state, action) => {
        return [...state, ...action.payload];
      });
  }
})

export const { datasubsetToggled, datasubsetDeleted, datasubsetsDeleted, datasubsetReset, datasubsetShowAll, datasubsetHideAll, datasubsetEdited, datasubsetDnD } = datasubsetSlice.actions
export default datasubsetSlice.reducer
