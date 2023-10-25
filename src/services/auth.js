import { createAsyncThunk } from "@reduxjs/toolkit";
import { $api, $authApi } from ".";
import { apiRoutes } from "../config/api";
import { updateAddresses } from "../store/reducers/addressSlice";
import socket from "../config/socket";

const login = createAsyncThunk("auth/login", async (payloads, thunkAPI) => {
  try {
    const response = await $api.post(apiRoutes.AUTH_LOGIN, payloads);
    if (response?.data) {
      response.data?.user?.addresses?.length > 0 &&
        thunkAPI.dispatch(updateAddresses(response.data.user.addresses));

      if (thunkAPI.getState?.favorite?.items?.length > 0) {
        thunkAPI.dispatch(getFavorites());
      }
    }

    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await $api.post(apiRoutes.AUTH_LOGOUT);
    socket.disconnect();
    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const checkAuth = async () => {
  const response = await $authApi.post(apiRoutes.AUTH_CHECK);
  if (response && response.status === 200) {
    socket.io.opts.query = {
      brandId: response.data.brandId ?? false,
      userId: response.data.id ?? false,
    };
    socket.connect();
  }
  return response?.data;
};

const refreshAuth = createAsyncThunk("auth/refresh", async (_, thunkAPI) => {
  try {
    const response = await $authApi.post(apiRoutes.AUTH_REFRESH);
    return response?.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

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
export {
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
