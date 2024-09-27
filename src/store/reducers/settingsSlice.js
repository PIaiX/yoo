import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  isConnected: true,
  ip: "0.0.0.0",
  start: true,
  apiId: false,
  token: false,
  terminal: false,
  options: false,
  filter: [],
  updateTime: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateStart: (state, action) => {
      state.start = action.payload;
    },
    updateApiId: (state, action) => {
      state.apiId = action.payload;
    },
    updateConnect: (state, action) => {
      state.isConnected = action.payload;
    },
    updateOptions: (state, action) => {
      return {
        ...state,
        updateTime: moment().toISOString(),
        options: { ...(action.payload?.options ?? initialState.options) },
        terminal: { ...(action.payload?.terminal ?? initialState.terminal) },
        token: action.payload?.token,
      };
    },
    updateIp: (state, action) => {
      state.ip = action.payload;
    },
    updateFilter: (state, action) => {
      if (action?.payload?.categoryId) {
        let categoryIndex =
          state?.filter?.length > 0
            ? state.filter.findIndex(
                (e) => e.categoryId === action.payload.categoryId
              )
            : -1;

        if (categoryIndex != -1) {
          state.filter[categoryIndex] = action.payload;
        } else if (state?.filter?.length > 0) {
          state.filter.push(action.payload);
        } else {
          state.filter = [action.payload];
        }
      }
    },
    removeFilter: (state) => {
      state.filter = [];
    },
  },
});

export const {
  updateStart,
  updateConnect,
  updateOptions,
  updateIp,
  updateFilter,
  removeFilter,
  updateApiId,
} = settingsSlice.actions;

export default settingsSlice.reducer;
