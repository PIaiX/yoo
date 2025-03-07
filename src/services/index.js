import axios from "axios";
import { BASE_URL } from "../config/api";
import store from "../store";
import { refreshAuth } from "./auth";
import { ClientJS } from "clientjs";

const $api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const client = new ClientJS();

const language = client.getLanguage();

var device = {
  brand: client.getBrowser() ?? "",
  osName: client.getOS() ?? "",
  osVersion: client.getOSVersion() ?? "",
  language: language ?? "ru",
};

$api.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    device.apiId = state?.settings?.apiId;
    device.ip = state?.settings?.ip;
    config.headers.ip = state?.settings?.ip;
    config.headers.token = state?.settings?.token
      ? `API ${state.settings.token}`
      : false;
    config.headers.device = JSON.stringify(device);
    return config;
  },
  (error) => Promise.reject(error)
);

const $authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

$authApi.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    device.apiId = state?.settings?.apiId;
    device.ip = state?.settings?.ip;
    config.headers.ip = state?.settings?.ip;
    config.headers.token = state?.settings?.token
      ? `API ${state.settings.token}`
      : false;
    const token = state?.auth?.token ?? false;

    if (token) {
      config.headers.authorization = `Access ${token}`;
    }
    config.headers.device = JSON.stringify(device);
    if (state?.auth?.refreshToken) {
      config.data = { ...config.data, refreshToken: state.auth.refreshToken }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

$authApi.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;
    if (status === 401 && originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      return store
        .dispatch(refreshAuth())
        .then(() => $authApi(originalRequest));
    }
    return Promise.reject(error);
  }
);

export { $api, $authApi };
