import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Meta from "../../components/Meta";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/utils/Loader";
import SupportForm from "../../components/support";
import socket from "../../config/socket";
import { createMessage, getMessages } from "../../services/message";
import { updateNotification } from "../../store/reducers/notificationSlice";

const Support = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.auth.isAuth);
  const timer = useRef(0);
  const timerSend = useRef(0);
  const userId = useSelector((state) => state.auth.user.id);

  const [messages, setMessages] = useState({
    show: false,
    loading: true,
    chapter: null,
    items: state ?? [],
  });
  const { control, handleSubmit, setValue, reset } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });
  const data = useWatch({ control });

  useEffect(() => {
    if (timerSend.current === 0 && data?.text?.length > 0) {
      timerSend.current = 1;
      socket.emit("message/print", { client: true, adminId: userId });
      setTimeout(() => {
        timerSend.current = 0;
      }, 3000);
    }
  }, [data?.text]);

  useEffect(() => {
    if (isAuth) {
      dispatch(updateNotification({ message: -1 }));
      getMessages()
        .then((res) => {
          reset({
            bookId: res?.book?.id,
            chapterId: res?.chapter?.id,
          });
          setMessages({ loading: false, ...res });
        })
        .catch(() => setMessages((prev) => ({ ...prev, loading: false })));

      socket.on("message/user/" + userId, (data) => {
        if (data) {
          setMessages((prev) => ({
            ...prev,
            items: [data, ...prev.items],
          }));
        }
      });
      socket.on("message/view/" + userId, (data) => {
        if (data == "admin") {
          setMessages((prev) => ({
            ...prev,
            items: prev.items.map((e) => {
              if (!e?.memberId) {
                e.view = true;
              }
              return e;
            }),
          }));
        }
      });

      socket.on("message/print/" + userId, () => {
        if (timer.current === 0) {
          timer.current = 1;
          setTimeout(() => {
            timer.current = 0;
          }, 5000);
        }
      });

      return () => {
        socket.off("message/user/" + userId);
        socket.off("message/view/" + userId);
        socket.off("message/print/" + userId);
      };
    }
  }, [isAuth]);

  const onNewMessage = useCallback(
    (data) => {
      data.text = data.text.trim();
      createMessage(data);
      setValue("text", "");
    },
    [messages]
  );

  if (messages?.loading) {
    return <Loader full />;
  }

  return (
    <>
      <Meta title={t("Чат с поддержкой")} />

      <SupportForm
        placeholder={t("Введите сообщение")}
        emptyText={t("Нет сообщений")}
        data={messages?.items?.length > 0 ? messages.items : []}
        form={data}
        onChange={(e) => setValue("text", e)}
        onSubmit={handleSubmit(onNewMessage)}
      />
    </>
  );
};

export default Support;
