import { apiRoutes } from "../config/api";
import { $api } from "./index";

const getCatalog = async (data) => {
  const response = await $api.get(apiRoutes.HOME, { params: data });
  return response?.data;
};

export { getCatalog };
