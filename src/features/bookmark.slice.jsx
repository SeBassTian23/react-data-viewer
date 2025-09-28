import { createSlice } from '@reduxjs/toolkit'

const initialState = [];

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    bookmarkAdd(state, action) {
      state.push({ ...action.payload })
    },
    bookmarkDelete(state, action) {
      return state.filter((item) => item.id !== action.payload)
    },
    bookmarksReset(state, action) {
      return initialState;
    },
    bookmarkAddBackup(state, action) {
      return action.payload
    },
    bookmarkEdit(state, action) {
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
    }
  }
})

export const { bookmarkAdd, bookmarkDelete, bookmarksReset, bookmarkAddBackup, bookmarkEdit } = bookmarkSlice.actions
export default bookmarkSlice.reducer
