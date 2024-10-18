import { apiRoutes } from "../config/api";
import { $api } from "./index";

const getProjects = async () => {
  const response = await $api.get(apiRoutes.PROJECTS);
  return response?.data;
};

export { getProjects };
