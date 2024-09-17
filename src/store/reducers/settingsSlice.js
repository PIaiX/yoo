import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  isConnected: true,
  ip: "0.0.0.0",
  token: false,
  options: {
    name: "ru.yooapp.app",
    title: "YooApp",
    authType: "email",
    qrType: "phone",
    multiBrand: false,
    supportVisible: false,
    colorBtn: "#009640",
    payments: {
      card: true,
      cash: true,
      online: false,
    },
    colorMain: "#009640",
    versionIos: "0.0.1",
    versionAndroid: "0.0.1",
    colorMainBg: "#4caf50",
    giftVisible: false,
    promoVisible: true,
    themeProductImage: 0,
    themeProduct: 0,
    themeAddition: 0,
    profilePointVisible: true,
    productEnergyVisible: true,
  },
  filter: [],
  updateTime: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateConnect: (state, action) => {
      state.isConnected = action.payload;
    },
    updateOptions: (state, action) => {
      return {
        ...state,
        updateTime: moment().toISOString(),
        options: { ...(action.payload?.options ?? initialState.options) },
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
  updateConnect,
  updateOptions,
  updateIp,
  updateFilter,
  removeFilter,
} = settingsSlice.actions;

export default settingsSlice.reducer;
