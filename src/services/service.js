import { apiRoutes } from "../config/api";
import { $api } from "./index";

const getServices = async () => {
  const response = await $api.get(apiRoutes.SERVICES);
  return response?.data;
};

export { getServices };
