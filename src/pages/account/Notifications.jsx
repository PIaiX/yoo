import React, { useLayoutEffect, useState } from "react";
import LiNotification from "../../components/LiNotification";
import AccountTitleReturn from "../../components/AccountTitleReturn";
import { getNotifications } from "../../services/account";
import { updateNotification } from "../../store/reducers/notificationSlice";
import { useDispatch } from "react-redux";
import EmptyNotifications from "../../components/empty/notifications";
import Empty from "../../components/Empty";
import { useTranslation } from "react-i18next";
import Loader from "../../components/utils/Loader";

const Notifications = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState({
    loading: true,
    items: [],
  });

  const onLoad = () => {
    dispatch(updateNotification({ notification: -1 }));
    getNotifications()
      .then((res) => {
        res?.notifications?.items &&
          setNotifications({ loading: false, ...res.notifications });
      })
      .catch(() => setNotifications({ ...notifications, loading: false }));
  };

  useLayoutEffect(() => {
    onLoad();
  }, []);

  if (notifications?.loading) {
    return <Loader />;
  }

  if (!Array.isArray(notifications.items) || notifications.items.length <= 0) {
    return (
      <Empty
        mini
        text={t("Уведомлений нет")}
        image={() => <EmptyNotifications />}
      />
    );
  }
  return (
    <section className="notifications">
      <AccountTitleReturn link={"/account"} title={t("Уведомления")} />
      <ul className="notifications-list">
        {notifications?.items?.length > 0 &&
          notifications.items.map((e) => <LiNotification data={e} />)}
      </ul>
    </section>
  );
};

export default Notifications;
