import { $authApi } from ".";
import { apiRoutes } from "../config/api";

const editAccount = async (payloads) => {
  const response = await $authApi.post(apiRoutes.ACCOUNT_EDIT, payloads);
  return response?.data;
};

const getNotifications = async (page, limit) => {
  const response = await $authApi.get(apiRoutes.ACCOUNT_NOTIFICATIONS_GET, {
    params: { page, limit },
  });
  return response?.data;
};

const deleteNotification = async (notificationId) => {
  const response = await $authApi.delete(
    apiRoutes.ACCOUNT_NOTIFICATION_DELETE,
    { data: { notificationId } }
  );
  return response?.data;
};

export { deleteNotification, editAccount, getNotifications };
