import { apiRoutes } from "../config/api";
import { $api, $authApi } from "./index";

const getProduct = async (data) => {
  const response = await $api.get(apiRoutes.PRODUCT, {
    params: data,
  });
  return response?.data;
};

const getProducts = async (data) => {
  const response = await $api.get(apiRoutes.PRODUCTS, {
    params: data,
  });
  return response?.data;
};

const getCartProducts = async (ids) => {
  const response = await $authApi.post(apiRoutes.CART_PRODUCTS, ids);
  return response?.data;
};

const getGifts = async () => {
  const response = await $api.get(apiRoutes.PRODUCT_GIFTS);
  return response?.data;
};

const getFree = async () => {
  const response = await $api.get(apiRoutes.PRODUCT_FREE);
  return response?.data;
};

export { getProduct, getGifts, getFree, getCartProducts, getProducts };
