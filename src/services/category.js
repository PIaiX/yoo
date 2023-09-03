import { apiRoutes } from "../config/api";
import { $api } from "./index";

const getCategory = async (data) => {
  const response = await $api.get(apiRoutes.CATEGORY_ONE, { params: data });
  return response?.data;
};

const getCategories = async () => {
  const response = await $api.get(apiRoutes.CATEGORY_ALL);
  return response?.data;
};

export { getCategory, getCategories };
