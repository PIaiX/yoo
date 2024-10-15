import axios from "axios";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import "./assets/style.min.css";
import Loader from "./components/utils/Loader";
import YandexMetrika from "./components/YandexMetrika";
import socket from "./config/socket";
import { addSpacesToNumber, generateToken } from "./helpers/all";
import AppRouter from "./routes/AppRouter";
// import { getFavorites } from "./services/favorite";
import { Badge, Button } from "react-bootstrap";
import { IoEllipse } from "react-icons/io5";
import { QRCode } from "react-qrcode-logo";
import Empty from "./components/Empty";
import EmptyWork from "./components/empty/work";
import Meta from "./components/Meta";
import { Timer } from "./helpers/timer";
import { terminalAuth, terminalNewKey } from "./services/terminal";
import { setAuth, setToken } from "./store/reducers/authSlice";
import { editDeliveryCheckout } from "./store/reducers/checkoutSlice";
import {
  updateApiId,
  updateIp,
  updateOptions,
  updateStart,
} from "./store/reducers/settingsSlice";

function App() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [key, setKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingNewKey, setLoadingNewKey] = useState(false);
  const [endTimer, setEndTimer] = useState(false);
  const settings = useSelector((state) => state.settings);
  const user = useSelector((state) => state.auth.user);
  const delivery = useSelector((state) => state.checkout.delivery);

  // useEffect(() => {
  //   if (options?.themeType) {
  //     document.documentElement.dataset.theme = options?.themeType;
  //   }
  // }, [options?.themeType]);

  // const updateColor = useCallback(
  //   (options) => {
  //     if (options?.colorMain) {
  //       options.colorMain && setCssColor("--main-color", options.colorMain);
  //       options.colorMain &&
  //         setCssColor(
  //           "--main-color-outline",
  //           convertColor(options.colorMain, 0.1)
  //         );
  //       options.colorBtn && setCssColor("--main-color-btn", options.colorBtn);
  //       options.colorText &&
  //         setCssColor("--main-color-text", options.colorText);
  //       options.colorTextTitle &&
  //         setCssColor("--main-color-text-title", options.colorTextTitle);
  //       options.colorTextSubtitle &&
  //         setCssColor("--main-color-text-subtitle", options.colorTextSubtitle);
  //       options.themeFont && setClassName("theme-font", options.themeFont);
  //       options.themeFontSize &&
  //         setClassName("theme-font-size", options.themeFontSize);
  //       options.themeFontTitle &&
  //         setClassName("theme-font-title", options.themeFontTitle);
  //       options.themeFontTitleSize &&
  //         setClassName("theme-font-size-title", options.themeFontTitleSize);
  //     }
  //   },
  //   [options]
  // );

  // const updateFavicon = useCallback(
  //   (options) => {
  //     let link = document.querySelector("link[rel~='icon']");
  //     if (!link) {
  //       link = document.createElement("link");
  //       link.rel = "icon";
  //       document.getElementsByTagName("head")[0].appendChild(link);
  //     }
  //     link.href = getImageURL(options);
  //   },
  //   [selectedAffiliate]
  // );

  // useLayoutEffect(() => {
  //   if (selectedAffiliate?.media) {
  //     updateFavicon({
  //       path: selectedAffiliate?.media,
  //       type: "affiliate",
  //       size: "full",
  //     });
  //   }
  // }, [selectedAffiliate]);

  useLayoutEffect(() => {
    (async () => {
      setLoading(true); // Запускаем индикатор загрузки

      try {
        // 1. Получение IP-адреса
        const ipResponse = await axios.get("https://ip.yooapp.ru");
        const ip = ipResponse.data?.ip;
        if (ip) {
          dispatch(updateIp(ip));
        }

        // 2. Генерация API ID (если нужно)
        let apiId = settings?.apiId;
        if (!apiId || apiId.length === 0) {
          apiId = generateToken(50);
          dispatch(updateApiId(apiId));
        }

        // 3. Авторизация на терминале
        const terminalAuthResponse = await terminalAuth(apiId); // Передаем apiId
        if (terminalAuthResponse) {
          const { terminal, options, token } = terminalAuthResponse;
          if (terminal?.key) {
            setKey(terminal.key);
          }
          if (options) {
            dispatch(updateOptions({ terminal, options, token }));
          }
        }
      } catch (error) {
        console.error("Ошибка при выполнении функций:", error);
      } finally {
        setLoading(false); // Останавливаем индикатор загрузки
      }
    })();
  }, []);

  const onSubmit = useCallback(() => {
    setLoadingNewKey(true);
    terminalNewKey()
      .then(
        (res) => res?.terminal?.key && setKey(res.terminal.key),
        setEndTimer(false)
      )
      .finally(() => setLoadingNewKey(false));
  }, []);

  useEffect(() => {
    if (settings?.apiId) {
      socket.io.opts.query = {
        brandId: user.brandId ?? false,
        userId: user.id ?? false,
      };
      socket.connect();
      socket.emit("create", "id" + settings.apiId);
      socket.on("auth", (data) => {
        if (data?.options) {
          dispatch(
            updateOptions({
              terminal: data.terminal,
              options: data.options,
              token: data.token,
            })
          );
        } else if (data?.key) {
          setKey(data.key);
        }
      });
      socket.on("login", (data) => {
        if (data?.user && data?.token) {
          dispatch(setUser(data.user));
          dispatch(setToken(data.token));
          dispatch(setAuth(true));
        }
      });
      return () => {
        socket.off("auth");
        socket.off("login");
      };
    }
  }, [settings?.apiId, user]);

  if (loading) {
    return <Loader full />;
  }

  if ((!settings?.options || !settings?.terminal) && key) {
    return (
      <>
        <Meta title={t("Активируйте терминал")} />
        <div className="align-items-center vh-100 justify-content-center d-flex">
          <div className="member">
            <div className="d-flex justify-content-center">
              <QRCode
                size={250}
                className="qr"
                value={key}
                viewBox={`0 0 250 250`}
              />
            </div>
            <div className="fw-8 key mt-4 mb-3 text-center">
              {addSpacesToNumber(key)}
            </div>
            <div className="fw-8 h5 mb-3 text-center">
              {t("Подтвердите и активируйте терминал")}
            </div>
            <p className="fw-6 mb-2 d-flex align-items-start">
              <Badge pill bg="dark" className="me-3">
                1
              </Badge>
              Зайдите в аккаунт YooApp
            </p>
            <p className="fw-6 mb-2 d-flex align-items-start">
              <Badge pill bg="dark" className="me-3">
                2
              </Badge>
              Перейдите в Маркет {">"} Киоск YooApp {">"} Терминалы
            </p>
            <p className="fw-6 mb-4 d-flex align-items-start">
              <Badge pill bg="dark" className="me-3">
                3
              </Badge>
              Добавьте терминал указав данный код
            </p>
            <Button
              type="submit"
              variant="primary"
              disabled={!endTimer}
              onClick={() => onSubmit()}
              className={"w-100 rounded-3" + (loadingNewKey ? " loading" : "")}
            >
              {endTimer ? (
                "Обновить код"
              ) : (
                <>
                  {t("Обновить код через")}{" "}
                  <Timer onEnd={() => setEndTimer(true)} /> {"сек"}
                </>
              )}
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (!settings?.terminal?.status) {
    return (
      <Empty
        text={t("Терминал временно не работает")}
        desc={t("Подходите немного позже")}
        image={() => <EmptyWork />}
      />
    );
  }

  if (settings?.start) {
    return (
      <>
        <Meta title={t("Добро пожаловать")} />
        <div className="start d-flex flex-column vh-100 justify-content-between">
          <div>
            <div className="fw-7 h1 mb-3">{t("Закажите без очереди")}</div>
            <p className="fw-6 mb-2 d-flex align-items-center justify-content-center text-muted">
              Order here <IoEllipse size={8} className="mx-3 text-primary" />{" "}
              Ordene aquí <IoEllipse size={8} className="mx-3 text-primary" />{" "}
              在这里订购
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <img src="imgs/empty-product-image.png" />
          </div>
          <div>
            <Button
              variant="primary"
              onClick={() => dispatch(updateStart(false))}
              className="rounded-5 m-auto"
            >
              Сделать заказ
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (!delivery) {
    return (
      <>
        <Meta title={t("Выберите способ получения")} />
        <div className="start d-flex flex-column vh-100 justify-content-between">
          <div>
            <div className="fw-7 h1 mb-3">{t("Выберите способ получения")}</div>
            <p className="fw-6 mb-2 d-flex align-items-center justify-content-center text-muted">
              Order type <IoEllipse size={8} className="mx-3 text-primary" />{" "}
              Tipo de pedido{" "}
              <IoEllipse size={8} className="mx-3 text-primary" /> 订单类别
            </p>
          </div>
          <div className="start-delivery">
            <a onClick={() => dispatch(editDeliveryCheckout("hall"))}>В зале</a>
            <a onClick={() => dispatch(editDeliveryCheckout("pickup"))}>
              С собой
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <YandexMetrika />
      <AppRouter />
    </>
  );
}

export default App;
