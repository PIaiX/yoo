import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingLogin: false,
  isAuth: false,
  token: false,
  refreshToken: false,
  user: {},
  pushToken: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPushToken: (state, action) => {
      state.pushToken = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setLoadingLogin: (state, action) => {
      state.loadingLogin = action.payload;
    },
    setQr: (state, action) => {
      state.qr = action.payload;
    },
  },
});

export const {
  setQr,
  setLoadingLogin,
  setLoadingRefresh,
  setUser,
  setToken,
  setAuth,
  setLoginError,
  setPushToken,
  setRefreshToken,
} = authSlice.actions;

export default authSlice.reducer;
