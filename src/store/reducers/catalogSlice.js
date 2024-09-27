import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  home: [],
  categories: [],
  widgets: [],
  sales: [],
  updateTime: false,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    updateCatalog: (state, action) => {
      state.home = action?.payload?.home ?? [];
      state.categories = action?.payload?.categories ?? [];
      state.updateTime = moment().toISOString();
    },
    updateSales: (state, action) => {
      state.sales = action?.payload ?? [];
    },
    resetCatalog: (state) => {
      state.home = [];
      state.categories = [];
      state.sales = [];
      state.updateTime = false;
    },
  },
});

export const { updateCatalog, updateSales, resetCatalog } =
  catalogSlice.actions;

export default catalogSlice.reducer;
