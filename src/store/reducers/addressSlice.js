import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.items = state.items.map((e) => {
        e.main = false;
        return e;
      });
      state.items.push({ ...action?.payload, main: true });
    },
    updateAddress: (state, action) => {
      if (action?.payload.main) {
        state.items = state.items.map((e) => {
          e.main = false;
          return e;
        });
        state.items = state.items.map((e) => {
          if (e.id === action?.payload?.id) {
            e = action?.payload;
          }
          return e;
        });
      }
    },
    mainAddressEdit: (state, action) => {
      state.items = state.items.map((e) => {
        e.main = e.id === action?.payload?.id;
        return e;
      });
    },
    updateAddresses: (state, action) => {
      state.items = action.payload;
    },
    deleteAddressSlice: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action?.payload);
    },
    resetAddresses: (state) => {
      state.items = [];
      state.cache = false;
    },
  },
});

export const {
  setAddress,
  updateAddress,
  mainAddressEdit,
  updateAddresses,
  deleteAddressSlice,
  resetAddresses,
} = addressSlice.actions;

export default addressSlice.reducer;
