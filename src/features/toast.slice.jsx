import { createSlice, nanoid } from "@reduxjs/toolkit";

const toastReducer = createSlice({
  name: "toast",
  initialState: [],
  reducers: {
    addToast: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (message, variant = "info", header = null, icon = null, timeout = 3000 ) => ({
        payload: { id: nanoid(), message, variant, header, icon, timeout },
      }),
    },
    removeToast: (state, action) =>
      state.filter((toast) => toast.id !== action.payload),
  },
});

export const { addToast, removeToast } = toastReducer.actions;
export default toastReducer.reducer;
