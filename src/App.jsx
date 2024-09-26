import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
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
import {
  addSpacesToNumber,
  convertColor,
  generateToken,
  getImageURL,
  isUpdateTime,
  languageCode,
  setClassName,
  setCssColor,
} from "./helpers/all";
import AppRouter from "./routes/AppRouter";
import { checkAuth, logout } from "./services/auth";
// import { getFavorites } from "./services/favorite";
import { getOptions } from "./services/option";
import { getDelivery } from "./services/order";
import { updateAddresses } from "./store/reducers/addressSlice";
import {
  updateAffiliate,
  updateCities,
  // updateTable,
  updateZone,
} from "./store/reducers/affiliateSlice";
import { setAuth, setUser } from "./store/reducers/authSlice";
import { cartZone } from "./store/reducers/cartSlice";
import { editDeliveryCheckout } from "./store/reducers/checkoutSlice";
import { updateNotification } from "./store/reducers/notificationSlice";
import {
  updateApiId,
  updateIp,
  updateMember,
  updateOptions,
} from "./store/reducers/settingsSlice";
import { updateStatus } from "./store/reducers/statusSlice";
import Input from "./components/utils/Input";
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import { terminalAuth, terminalNewKey } from "./services/terminal";
import { Button } from "react-bootstrap";
import Meta from "./components/Meta";
import QRCode from "react-qr-code";
import { Timer } from "./helpers/timer";

function App() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [key, setKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingNewKey, setLoadingNewKey] = useState(false);
  const [endTimer, setEndTimer] = useState(false);
  const settings = useSelector((state) => state.settings);
  const cart = useSelector((state) => state.cart.items);
  const address = useSelector((state) => state.address.items);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const delivery = useSelector((state) => state.checkout.delivery);
  const auth = useSelector((state) => state.auth);

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
    if (!settings?.apiId || settings?.apiId?.length === 0) {
      dispatch(updateApiId(generateToken(50)));
    }
    terminalAuth()
      .then((res) => {
        res.key && setKey(res.key);
        res.options && dispatch(updateOptions({ options: res.options }));
      })
      .finally(() => setLoading(false));
    // (async () => {

    //   if (options) {
    //     updateColor(options);
    //     updateFavicon(
    //       selectedAffiliate?.media
    //         ? {
    //             path: selectedAffiliate?.media,
    //             type: "affiliate",
    //             size: "full",
    //           }
    //         : {
    //             path: options.favicon,
    //             type: "all/web/favicon",
    //             size: "full",
    //           }
    //     );
    //   }
    //   if (!updateTime || isUpdateTime(updateTime)) {
    //     await axios
    //       .get("https://ip.yooapp.ru")
    //       .then(({ data }) => data?.ip && dispatch(updateIp(data.ip)));

    //     await getOptions()
    //       .then(async (res) => {
    //         if (res?.options) {
    //           updateColor(res.options);

    //           if (res.options.favicon) {
    //             updateFavicon(
    //               selectedAffiliate?.media
    //                 ? {
    //                     path: selectedAffiliate?.media,
    //                     type: "affiliate",
    //                     size: "full",
    //                   }
    //                 : {
    //                     path: res.options.favicon,
    //                     type: "all/web/favicon",
    //                     size: "full",
    //                   }
    //             );
    //           }

    //           if (res?.options?.lang) {
    //             i18n.changeLanguage(languageCode(res.options.lang));
    //             moment.locale(languageCode(res.options.lan));
    //           }

    //           dispatch(
    //             updateOptions({ options: res.options, token: res.token })
    //           );

    //           const availableDeliveryTypes = [
    //             ...(res.options?.delivery?.status ? ["delivery"] : []),
    //             ...(res.options?.pickup?.status ? ["pickup"] : []),
    //             ...(res.options?.hall?.status ? ["hall"] : []),
    //             ...(res.options?.feedback?.status ? ["feedback"] : []),
    //           ];

    //           const deliveryType = availableDeliveryTypes.find((type) => {
    //             return res.options?.[type]?.status === true; // Проверяем статус для каждого типа
    //           });

    //           if (!availableDeliveryTypes.includes(delivery) && deliveryType) {
    //             dispatch(editDeliveryCheckout(deliveryType)); // Выбираем найденный элемент
    //           }
    //         }

    //         if (res?.cities?.length > 0) {
    //           const transformedData = res.cities.map((city) => {
    //             const { relationCities, ...rest } = city;
    //             return {
    //               ...rest,
    //               affiliates:
    //                 relationCities && relationCities.length > 0
    //                   ? relationCities.map((relation) => relation.affiliate)
    //                   : [],
    //             };
    //           });

    //           dispatch(updateCities(transformedData));

    //           if (
    //             transformedData?.length === 1 &&
    //             transformedData[0]?.affiliates?.length > 0
    //           ) {
    //             dispatch(updateAffiliate(transformedData[0].affiliates));
    //           }
    //         }

    //         // res?.tables && dispatch(updateTable(res.tables));
    //         res?.zones && dispatch(updateZone(res.zones));

    //         if (res?.statuses?.length > 0) {
    //           let statusesMain = res.statuses
    //             .filter((e) => e.main)
    //             .sort((a, b) => a.order - b.order);
    //           let statusesMainNo = res.statuses
    //             .filter((e) => !e.main)
    //             .sort((a, b) => a.order - b.order);
    //           dispatch(
    //             updateStatus({ mainYes: statusesMain, mainNo: statusesMainNo })
    //           );
    //         }

    //         if (auth?.token) {
    //           if (!auth?.user?.brandId) {
    //             return dispatch(logout());
    //           }
    //           await checkAuth()
    //             .then((data) => {
    //               dispatch(setAuth(true));
    //               dispatch(setUser(data));

    //               if (data?.lang) {
    //                 i18n.changeLanguage(languageCode(data.lang));
    //                 moment.locale(languageCode(data.lang));
    //               }

    //               dispatch(updateAddresses(data?.addresses ?? []));

    //               // dispatch(getFavorites());
    //             })
    //             .catch((err) => {
    //               err?.response?.status === 404 && dispatch(logout());
    //             });
    //         }
    //       })
    //       .finally(() => setLoading(false));
    //   } else {
    //     if (auth?.user?.lang) {
    //       i18n.changeLanguage(languageCode(auth.user.lang));
    //       moment.locale(languageCode(auth.user.lang));
    //     }
    //     setLoading(false);
    //   }
    // })();
  }, []);

  // useEffect(() => {
  //   if (delivery == "delivery" && auth?.user?.id) {
  //     const selectedAddress = address ? address.find((e) => e.main) : false;
  //     if (selectedAddress) {
  //       getDelivery({ distance: true, addressId: selectedAddress.id }).then(
  //         (res) => {
  //           res &&
  //             dispatch(cartZone({ data: res?.zone, distance: res?.distance }));
  //         }
  //       );
  //     }
  //   }
  // }, [address, delivery, options, cart, auth?.user?.id]);

  // useEffect(() => {
  //   if (auth.isAuth) {
  //     socket.on("notifications/" + auth.user.id, (data) => {
  //       if (data) {
  //         dispatch(updateNotification(data));
  //       }
  //     });
  //     return () => {
  //       socket.off("notifications/" + auth.user.id);
  //     };
  //   }
  // }, [auth.isAuth]);

  const onSubmit = useCallback(() => {
    setLoadingNewKey(true);
    terminalNewKey()
      .then((res) => res.key && setKey(res.key), setEndTimer(false))
      .finally(() => setLoadingNewKey(false));
  }, []);

  useEffect(() => {
    if (settings?.apiId) {
      socket.io.opts.query = settings.apiId;
      socket.connect();
      socket.on("terminal", (data) => {
        if (data?.options) {
          dispatch(updateOptions({ options: data.options }));
        } else if (data?.key) {
          setKey(data.key);
        }
      });
      return () => {
        socket.off("terminal");
      };
    }
  }, [settings?.options]);

  if (loading) {
    return <Loader full />;
  }

  if (!settings?.options) {
    return (
      <main className="py-lg-0">
        <Meta title={t("Активируйте терминал")} />
        <section className="align-items-center vh-100 justify-content-center d-flex">
          <div className="member">
            <div className="d-flex justify-content-center">
              <QRCode
                size={150}
                className="qr"
                value={key}
                viewBox={`0 0 150 150`}
              />
            </div>
            <div class="fw-8 key mt-4 mb-3 text-center">
              {addSpacesToNumber(key)}
            </div>
            <div class="fw-7 h5 mb-3">
              {t("Подтвердите и активируйте терминал")}
            </div>
            <p className="fw-6 mb-2">1. Зайдите в аккаунт YooApp</p>
            <p className="fw-6 mb-2">
              2. Перейдите в Маркет {">"} Киоск YooApp {">"} Терминалы
            </p>
            <p className="fw-6 mb-4">3. Добавьте терминал указав данный код</p>
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
        </section>
      </main>
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
