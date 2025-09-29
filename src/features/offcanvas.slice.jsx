import { createSlice } from "@reduxjs/toolkit";

const offcanvasReducer = createSlice({
  name: "offcanvas",
  initialState: { open: false, title: "", url: "" },
  reducers: {
    showOffcanvas: (state, action) => {
      state.open = true;
      state.title = action.payload.title;
      state.url = action.payload.url;
    },
    hideOffcanvas: (state) => {
      state.open = false;
      state.title = "";
      state.url = "";
    },
  },
});

export const { showOffcanvas, hideOffcanvas } = offcanvasReducer.actions;
export default offcanvasReducer.reducer;
