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
  convertColor,
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
import { updateIp, updateOptions } from "./store/reducers/settingsSlice";
import { updateStatus } from "./store/reducers/statusSlice";

function App() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const options = useSelector((state) => state.settings.options);
  const updateTime = useSelector((state) => state.settings.updateTime);
  const cart = useSelector((state) => state.cart.items);
  const address = useSelector((state) => state.address.items);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const delivery = useSelector((state) => state.checkout.delivery);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (options?.themeType) {
      document.documentElement.dataset.theme = options?.themeType;
    }
  }, [options?.themeType]);

  const updateColor = useCallback(
    (options) => {
      if (options?.colorMain) {
        options.colorMain && setCssColor("--main-color", options.colorMain);
        options.colorMain &&
          setCssColor(
            "--main-color-outline",
            convertColor(options.colorMain, 0.1)
          );
        options.colorBtn && setCssColor("--main-color-btn", options.colorBtn);
        options.colorText &&
          setCssColor("--main-color-text", options.colorText);
        options.colorTextTitle &&
          setCssColor("--main-color-text-title", options.colorTextTitle);
        options.colorTextSubtitle &&
          setCssColor("--main-color-text-subtitle", options.colorTextSubtitle);
        options.themeFont && setClassName("theme-font", options.themeFont);
        options.themeFontSize &&
          setClassName("theme-font-size", options.themeFontSize);
        options.themeFontTitle &&
          setClassName("theme-font-title", options.themeFontTitle);
        options.themeFontTitleSize &&
          setClassName("theme-font-size-title", options.themeFontTitleSize);
      }
    },
    [options]
  );

  const updateFavicon = useCallback(
    (options) => {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = getImageURL(options);
    },
    [selectedAffiliate]
  );

  useLayoutEffect(() => {
    if (selectedAffiliate?.media) {
      updateFavicon({
        path: selectedAffiliate?.media,
        type: "affiliate",
        size: "full",
      });
    }
  }, [selectedAffiliate]);

  useLayoutEffect(() => {
    (async () => {
      if (options) {
        updateColor(options);
        updateFavicon(
          selectedAffiliate?.media
            ? {
                path: selectedAffiliate?.media,
                type: "affiliate",
                size: "full",
              }
            : {
                path: options.favicon,
                type: "all/web/favicon",
                size: "full",
              }
        );
      }
      if (!updateTime || isUpdateTime(updateTime)) {
        await axios
          .get("https://ip.yooapp.ru")
          .then(({ data }) => data?.ip && dispatch(updateIp(data.ip)));

        await getOptions()
          .then(async (res) => {
            if (res?.options) {
              updateColor(res.options);

              if (res.options.favicon) {
                updateFavicon(
                  selectedAffiliate?.media
                    ? {
                        path: selectedAffiliate?.media,
                        type: "affiliate",
                        size: "full",
                      }
                    : {
                        path: res.options.favicon,
                        type: "all/web/favicon",
                        size: "full",
                      }
                );
              }

              if (res?.options?.lang) {
                i18n.changeLanguage(languageCode(res.options.lang));
                moment.locale(languageCode(res.options.lan));
              }

              dispatch(
                updateOptions({ options: res.options, token: res.token })
              );

              const availableDeliveryTypes = [
                ...(res.options?.delivery?.status ? ["delivery"] : []),
                ...(res.options?.pickup?.status ? ["pickup"] : []),
                ...(res.options?.hall?.status ? ["hall"] : []),
                ...(res.options?.feedback?.status ? ["feedback"] : []),
              ];

              const deliveryType = availableDeliveryTypes.find((type) => {
                return res.options?.[type]?.status === true; // Проверяем статус для каждого типа
              });

              if (!availableDeliveryTypes.includes(delivery) && deliveryType) {
                dispatch(editDeliveryCheckout(deliveryType)); // Выбираем найденный элемент
              }
            }

            if (res?.cities?.length > 0) {
              const transformedData = res.cities.map((city) => {
                const { relationCities, ...rest } = city;
                return {
                  ...rest,
                  affiliates:
                    relationCities && relationCities.length > 0
                      ? relationCities.map((relation) => relation.affiliate)
                      : [],
                };
              });

              dispatch(updateCities(transformedData));

              if (
                transformedData?.length === 1 &&
                transformedData[0]?.affiliates?.length > 0
              ) {
                dispatch(updateAffiliate(transformedData[0].affiliates));
              }
            }

            // res?.tables && dispatch(updateTable(res.tables));
            res?.zones && dispatch(updateZone(res.zones));

            if (res?.statuses?.length > 0) {
              let statusesMain = res.statuses
                .filter((e) => e.main)
                .sort((a, b) => a.order - b.order);
              let statusesMainNo = res.statuses
                .filter((e) => !e.main)
                .sort((a, b) => a.order - b.order);
              dispatch(
                updateStatus({ mainYes: statusesMain, mainNo: statusesMainNo })
              );
            }

            if (auth?.token) {
              if (!auth?.user?.brandId) {
                return dispatch(logout());
              }
              await checkAuth()
                .then((data) => {
                  dispatch(setAuth(true));
                  dispatch(setUser(data));

                  if (data?.lang) {
                    i18n.changeLanguage(languageCode(data.lang));
                    moment.locale(languageCode(data.lang));
                  }

                  dispatch(updateAddresses(data?.addresses ?? []));

                  // dispatch(getFavorites());
                })
                .catch((err) => {
                  err?.response?.status === 404 && dispatch(logout());
                });
            }
          })
          .finally(() => setLoading(false));
      } else {
        if (auth?.user?.lang) {
          i18n.changeLanguage(languageCode(auth.user.lang));
          moment.locale(languageCode(auth.user.lang));
        }
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (delivery == "delivery" && auth?.user?.id) {
      const selectedAddress = address ? address.find((e) => e.main) : false;
      if (selectedAddress) {
        getDelivery({ distance: true, addressId: selectedAddress.id }).then(
          (res) => {
            res &&
              dispatch(cartZone({ data: res?.zone, distance: res?.distance }));
          }
        );
      }
    }
  }, [address, delivery, options, cart, auth?.user?.id]);

  useEffect(() => {
    if (auth.isAuth) {
      socket.on("notifications/" + auth.user.id, (data) => {
        if (data) {
          dispatch(updateNotification(data));
        }
      });
      return () => {
        socket.off("notifications/" + auth.user.id);
      };
    }
  }, [auth.isAuth]);

  if (loading) {
    return <Loader full />;
  }

  return (
    <>
      <YandexMetrika />
      <AppRouter />
    </>
  );
}

export default App;
