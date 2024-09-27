import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: false,
  delivery: false,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckout: (state, action) => {
      state.data = action?.payload;
    },
    editDeliveryCheckout: (state, action) => {
      state.delivery = action?.payload;
    },
    resetCheckout: (state) => {
      state.data = false;
    },
  },
});

export const { setCheckout, editDeliveryCheckout, resetCheckout } =
  checkoutSlice.actions;

export default checkoutSlice.reducer;
