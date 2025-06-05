import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    hasShownSubscriptionModal: false,
  },
  reducers: {
    setHasShownSubscriptionModal(state, action) {
      state.hasShownSubscriptionModal = action.payload;
    },
  },
});
export const { setHasShownSubscriptionModal } = uiSlice.actions;
export default uiSlice.reducer;
