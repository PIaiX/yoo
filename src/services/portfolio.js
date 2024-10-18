import { apiRoutes } from "../config/api";
import { $api } from "./index";

const getPortfolioOne = async (id) => {
  const response = await $api.get(apiRoutes.PORTFOLIO_ONE, { params: { id } });
  return response?.data;
};

const getPortfolio = async () => {
  const response = await $api.get(apiRoutes.PORTFOLIO);
  return response?.data;
};

export { getPortfolioOne, getPortfolio };
