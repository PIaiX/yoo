import axios from "axios";
import { apiRoutes, BASE_URL } from "../config/api";
import store from "../store";
import { logout, refreshAuth } from "./auth";
import { ClientJS } from "clientjs";
import { setRefreshToken, setToken } from "../store/reducers/authSlice";


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
  lang: language ?? "ru",
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
let isRefreshing = false; // Флаг для отслеживания процесса обновления токена
let failedQueue = []; // Очередь для запросов, ожидающих обновления токена

// Функция для обработки очереди запросов
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
      config.data = { ...config.data, refreshToken: state.auth.refreshToken };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ответов
$authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если запрос НЕ для обновления токена и статус 401
    if (
      error.response?.status === 401 &&
      !originalRequest._isRetry &&
      originalRequest.url !== apiRoutes.AUTH_REFRESH // Важно: исключаем запрос refresh
    ) {
      if (isRefreshing) {
        // Если токен уже обновляется, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Access ${token}`;
            return $authApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        // Обновляем токен
        const { token, refreshToken } = await refreshAuth();

        // Обновляем заголовки для исходного запроса
        originalRequest.headers.Authorization = `Access ${token}`;

        // Сохраняем новые токены в хранилище
        store.dispatch(setToken(token));
        store.dispatch(setRefreshToken(refreshToken));

        // Повторяем исходный запрос с новым токеном
        return $authApi(originalRequest);
      } catch (refreshError) {
        // Если обновление токена не удалось
        if (refreshError.response?.status === 401 || refreshError.response?.status === 403 || error.response?.status === 500) {
          store.dispatch(logout()); // Выход из аккаунта
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        processQueue(null, token); // Обрабатываем очередь
      }
    }

    // Обработка 403
    if (error.response?.status === 403 || error.response?.status === 500) {
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export { $api, $authApi };