import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingLogin: false,
  isAuth: false,
  token: false,
  refreshToken: false,
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
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
} = authSlice.actions;

export default authSlice.reducer;
