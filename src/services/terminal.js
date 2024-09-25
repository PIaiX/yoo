import { $api } from ".";
import { apiRoutes } from "../config/api";

const terminalAuth = async (payloads) => {
  const response = await $api.post(apiRoutes.TERMINAL_AUTH, payloads);
  return response?.data;
};

const terminalNewKey = async (payloads) => {
  const response = await $api.post(apiRoutes.TERMINAL_NEW_KEY, payloads);
  return response?.data;
};

export { terminalAuth, terminalNewKey };
