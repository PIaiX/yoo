import { createAsyncThunk } from "@reduxjs/toolkit";
import { $api, $authApi } from ".";
import { apiRoutes } from "../config/api";
import { resetAddresses, updateAddresses } from "../store/reducers/addressSlice";
import socket from "../config/socket";
import { setAuth, setLoadingLogin, setRefreshToken, setToken, setUser } from "../store/reducers/authSlice";
import { resetCart } from "../store/reducers/cartSlice";
import { resetCheckout } from "../store/reducers/checkoutSlice";
import { NotificationManager } from "react-notifications";
import store from "../store";

const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  thunkAPI.dispatch(setLoadingLogin(true))
  try {
    const response = await $api.post(apiRoutes.AUTH_LOGIN, data);

    if (response?.data?.user && response?.data?.token && response.data?.refreshToken) {

      thunkAPI.dispatch(setUser(response.data.user))
      thunkAPI.dispatch(setToken(response.data.token))
      thunkAPI.dispatch(setRefreshToken(response.data.refreshToken));
      thunkAPI.dispatch(updateAddresses(response?.data?.user?.addresses ?? []))

      thunkAPI.dispatch(setAuth(true))

      socket.io.opts.query = { brandId: response.data.user.brandId ?? false, userId: response.data.user.id ?? false }
      socket.connect()

      // thunkAPI.dispatch(getFavorites())
    }
    thunkAPI.dispatch(setLoadingLogin(false))
    return response?.data;
  } catch (error) {
    error?.response?.data?.error && typeof error?.response?.data?.error === "string" && NotificationManager.error(
      error.response.data.error
    )
    thunkAPI.dispatch(setLoadingLogin(false))
  }
});

const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    socket.disconnect()
    const response = await $authApi.post(apiRoutes.AUTH_LOGOUT).finally(async () => {
      thunkAPI.dispatch(setAuth(false))
      thunkAPI.dispatch(setUser(false))
      thunkAPI.dispatch(setToken(false))
      thunkAPI.dispatch(setRefreshToken(false));
      thunkAPI.dispatch(resetCart())
      thunkAPI.dispatch(resetAddresses())
      thunkAPI.dispatch(resetCheckout())
    });

    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const checkAuth = async () => {
  const response = await $authApi.post(apiRoutes.AUTH_CHECK)
  if (response && response.status === 200) {
    socket.io.opts.query = { brandId: response.data.brandId ?? false, userId: response.data.id ?? false }
    socket.connect()
  }
  return response?.data
}



const refreshAuth = async () => {
  try {
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;

    // Отправляем запрос с явным указанием refreshToken
    const response = await $authApi.post(apiRoutes.AUTH_REFRESH, {
      refreshToken: refreshToken,
    });

    if (!response.data?.token || !response.data?.refreshToken) {
      throw new Error("Invalid tokens received");
    }

    return {
      token: response.data.token,
      refreshToken: response.data.refreshToken,
    };
  } catch (error) {
    throw error;
  }
};
const authRegister = async (params) => {
  const response = await $api.post(apiRoutes.AUTH_REGISTRATION, params);
  return response?.data;
};

const authActivate = async (data) => {
  const response = await $authApi.post(apiRoutes.AUTH_ACTIVATE, data);
  return response?.data;
};

const authActivateEmail = async (key) => {
  const response = await $api.post(apiRoutes.AUTH_ACTIVATE_EMAIL, { key });
  return response?.data;
};

const authEditPhone = async (data) => {
  const response = await $authApi.post(apiRoutes.AUTH_EDIT_PHONE, data);
  return response?.data;
};

const authEditPassword = async (params) => {
  const response = await $authApi.post(apiRoutes.AUTH_EDIT_PASSWORD, params);
  return response?.data;
};

const authNewKeyActivate = async (params) => {
  const response = await $authApi.post(apiRoutes.AUTH_NEW_KEY_ACTIVATE, params);
  return response?.data;
};

const authPasswordRecovery = async (params) => {
  const response = await $api.post(apiRoutes.AUTH_RECOVERY, params);
  return response?.data;
};

const authEditEmail = async (data) => {
  const response = await $authApi.post(apiRoutes.AUTH_EDIT_EMAIL, data);
  return response?.data;
};
const authNewKeyRecovery = async (params) => {
  const data = await $authApi.post(apiRoutes.AUTH_NEW_KEY_RECOVERY, params);
  return data;
};
const authQrGenerate = async (payloads) => {
  const response = await $api.post(apiRoutes.AUTH_QR_GENERATE, payloads);
  return response?.data;
};

export {
  authQrGenerate,
  authActivate,
  authActivateEmail,
  authEditEmail,
  authNewKeyActivate,
  authEditPassword,
  authEditPhone,
  authPasswordRecovery,
  authNewKeyRecovery,
  authRegister,
  checkAuth,
  login,
  logout,
  refreshAuth,
};
