import { apiRoutes } from "../config/api";
import { $authApi } from "./index";

const createOrder = async (data) => {
  const response = await $authApi.post(apiRoutes.ORDER_CREATE, data);
  return response;
};
const getDelivery = async (data) => {
  const response = await $authApi.get(apiRoutes.ORDER_DELIVERY, {
    params: data,
  });
  return response?.data;
};
const getOrder = async (orderId) => {
  if (!orderId) {
    return false;
  }
  const response = await $authApi.get(apiRoutes.ACCOUNT_ORDER_GET, {
    params: { id: orderId },
  });
  return response?.data;
};
const getOrders = async (page, limit) => {
  const response = await $authApi.get(apiRoutes.ACCOUNT_ORDERS_GET, {
    params: { page, limit },
  });
  console.log(response.data)
  return response?.data;
};

export { getOrder, getOrders, createOrder, getDelivery };
