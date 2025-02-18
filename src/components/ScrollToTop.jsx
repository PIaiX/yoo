import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SupportForm from "./support";
import Loader from "./utils/Loader";
import socket from "../config/socket";
import { createMessage, getMessages } from "../services/message";
import { updateNotification } from "../store/reducers/notificationSlice";
import useIsMobile from "../hooks/isMobile";
import { HiOutlineChevronDoubleUp } from "react-icons/hi2";
import { IoChatbubbleEllipses, IoClose } from "react-icons/io5";

const ScrollToTop = memo(() => {
  const messageCount = useSelector((state) => state.notification?.message);
  const [visible, setVisible] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isMobile = useIsMobile("991px");
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
  const isValid = !isMobile && isAuth && pathname.indexOf("account") === -1;

  const { control, handleSubmit, setValue, reset } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });

  const data = useWatch({ control });
  const toggleVisible = useCallback(() => {
    if (window.scrollY > 250) {
      setVisible(true);
    } else if (window.scrollY <= 250) {
      setVisible(false);
    }
  }, []);

  const toTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", toggleVisible, true);
    return () => {
      document.removeEventListener("scroll", toggleVisible, true);
    };
  });

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
    if (isValid && showChat) {
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
  }, [isValid, showChat]);

  const onNewMessage = useCallback(
    (data) => {
      data.text = data.text.trim();
      createMessage(data);
      setValue("text", "");
    },
    [messages]
  );

  return (
    (isValid || visible) && (
      <nav className="sidebar">
        <ul>
          {isValid && (
            <li>
              {showChat && (
                <div className="chat-bar">
                  <SupportForm
                    className="sidebar-chat"
                    placeholder={t("Введите сообщение")}
                    emptyText={t("Нет сообщений")}
                    data={messages?.items?.length > 0 ? messages.items : []}
                    form={data}
                    onChange={(e) => setValue("text", e)}
                    onSubmit={handleSubmit(onNewMessage)}
                  />
                </div>
              )}
              <button
                className="position-relative"
                type="button"
                onClick={() => setShowChat(!showChat)}
              >
                {showChat ? <IoClose /> : <IoChatbubbleEllipses />}
                {messageCount > 0 && (
                  <span className="badge">{messageCount}</span>
                )}
              </button>
            </li>
          )}
          {visible && (
            <li>
              <button type="button" onClick={toTop}>
                <HiOutlineChevronDoubleUp />
              </button>
            </li>
          )}
        </ul>
      </nav>
    )
  );
});

export default ScrollToTop;
