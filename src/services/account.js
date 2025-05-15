import api from ".";
import { apiRoutes } from "../config/api";

const editAccount = async (payloads) => {
  const response = await api.post(apiRoutes.ACCOUNT_EDIT, payloads);
  return response?.data;
};

const getNotifications = async (page, limit) => {
  const response = await api.get(apiRoutes.ACCOUNT_NOTIFICATIONS_GET, {
    params: { page, limit },
  });
  return response?.data;
};

const deleteNotification = async (notificationId) => {
  const response = await api.delete(
    apiRoutes.ACCOUNT_NOTIFICATION_DELETE,
    { data: { notificationId } }
  );
  return response?.data;
};

export { deleteNotification, editAccount, getNotifications };
