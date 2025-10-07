import { createSlice } from "@reduxjs/toolkit";

const modalReducer = createSlice({
  name: "modal",
  initialState: { open: false, type: null, props: {} },
  reducers: {
    showModal: (state, action) => {
      state.open = true;
      state.type = action.payload.type;
      state.props = action.payload.props || {};
    },
    hideModal: (state) => {
      state.open = false;
      state.type = null;
      state.props = {};
    },
  },
});

export const { showModal, hideModal } = modalReducer.actions;
export default modalReducer.reducer;
