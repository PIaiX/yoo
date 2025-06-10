import axios from "axios";
import { ClientJS } from "clientjs";
import { apiRoutes, BASE_URL } from "../config/api";
import { languageCode } from "../helpers/all";
import store from "../store";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
const client = new ClientJS();
const language = client.getLanguage();
// Обработчик для обновления токена
let isRefreshing = false;
let failedRequests = [];
var device = {
  brand: client.getBrowser() ?? "",
  osName: client.getOS() ?? "",
  osVersion: client.getOSVersion() ?? "",
  language: languageCode(language),
  lang: languageCode(language),
  brandId: null
};

const processFailedRequests = (error, token = null) => {
  failedRequests.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedRequests = [];
};

api.interceptors.response.use(
  (response) => {
    // Если пришел новый токен - сохраняем
    if (response.data?.newToken) {
      const { newToken, tokenExpires } = response.data;
      store.dispatch({ type: "auth/setToken", payload: newToken });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос /check
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Если уже обновляем токен - ставим в очередь
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequests.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.authorization = `Access ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Пытаемся обновить токен
        const { data } = await api.get(apiRoutes.AUTH_CHECK);

        if (data.newToken) {
          originalRequest.headers.authorization = `Access ${data.newToken}`;
          processFailedRequests(null, data.newToken);
          return api(originalRequest);
        }

        // Если новый токен не пришел - разлогиниваем
        store.dispatch({ type: "auth/setAuth", payload: false });
        store.dispatch({ type: "auth/setUser", payload: false });
        store.dispatch({ type: "auth/setToken", payload: false });
        return Promise.reject(error);
      } catch (err) {
        store.dispatch({ type: "auth/setAuth", payload: false });
        store.dispatch({ type: "auth/setUser", payload: false });
        store.dispatch({ type: "auth/setToken", payload: false });
        processFailedRequests(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Обработка 403 (запрещено)
    if (error.response?.status === 403) {
      store.dispatch({ type: "auth/setAuth", payload: false });
      store.dispatch({ type: "auth/setUser", payload: false });
      store.dispatch({ type: "auth/setToken", payload: false });
    }

    return Promise.reject(error);
  }
);

// Добавляем токен к запросам
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    device.lang = state.auth?.user?.lang ? state.auth?.user?.lang : device.lang
    device.apiId = state?.settings?.apiId ?? null;
    device.ip = state?.settings?.ip;
    config.headers.ip = state?.settings?.ip;
    config.headers.versionapi = 'v2'
    config.headers.device = JSON.stringify(device);
    config.headers.token = state?.settings?.token
      ? `API ${state.settings.token}`
      : false;
    const token = state?.auth?.token ?? false;

    if (token) {
      config.headers.authorization = `Access ${token}`;
    }


    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
