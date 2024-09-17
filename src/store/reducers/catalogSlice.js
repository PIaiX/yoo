import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
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
      state.widgets = action?.payload?.widgets ?? [];
      state.categories = action?.payload?.categories ?? [];
      state.updateTime = moment().toISOString();
    },
    updateSales: (state, action) => {
      state.sales = action?.payload ?? [];
    },
    resetCatalog: (state) => {
      state.categories = [];
      state.widgets = [];
      state.sales = [];
      state.updateTime = false;
    },
  },
});

export const { updateCatalog, updateSales, resetCatalog } =
  catalogSlice.actions;

export default catalogSlice.reducer;
