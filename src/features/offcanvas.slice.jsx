import { createSlice } from "@reduxjs/toolkit";

const offcanvasReducer = createSlice({
  name: "offcanvas",
  initialState: { open: false, title: "", url: "", anchor: null },
  reducers: {
    showOffcanvas: (state, action) => {
      state.open = true;
      state.title = action.payload.title;
      state.url = action.payload.url;
      state.anchor = action.payload.url.split('#')[1] || null;
    },
    hideOffcanvas: (state) => {
      state.open = false;
      state.title = "";
      state.url = "";
      state.anchor = null
    },
  },
});

export const { showOffcanvas, hideOffcanvas } = offcanvasReducer.actions;
export default offcanvasReducer.reducer;
