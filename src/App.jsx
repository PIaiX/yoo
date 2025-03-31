import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment-timezone";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import "./assets/style.min.css";
import Holiday from "./components/Holiday";
import Loader from "./components/utils/Loader";
import YandexMetrika from "./components/YandexMetrika";
import socket from "./config/socket";
import {
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
import { getOptions } from "./services/option";
import { updateAddresses } from "./store/reducers/addressSlice";
import {
  updateAffiliate,
  updateCities,
  updateZone,
} from "./store/reducers/affiliateSlice";
import {
  setAuth,
  setLoadingLogin,
  setRefreshToken,
  setToken,
  setUser,
} from "./store/reducers/authSlice";
import { editDeliveryCheckout } from "./store/reducers/checkoutSlice";
import { updateNotification } from "./store/reducers/notificationSlice";
import {
  // resetSettings,
  // updateApiId,
  updateIp,
  updateOptions,
  updateSettingsCity,
  updateSettingsCountry,
} from "./store/reducers/settingsSlice";
import { updateStatus } from "./store/reducers/statusSlice";
import { getDelivery } from "./services/order";
import { cartZone } from "./store/reducers/cartSlice";
import CookieAccept from "./components/CookieAccept";

function App() {
  const { i18n } = useTranslation();
  const isFirstRender = useRef(true); // Флаг для отслеживания первого рендера

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const apiId = useSelector((state) => state.settings.apiId);
  const options = useSelector((state) => state.settings.options);
  // const notification = useSelector((state) => state.notification);
  const updateTime = useSelector((state) => state.settings.updateTime);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const delivery = useSelector((state) => state.checkout.delivery);
  const auth = useSelector((state) => state.auth);
  const city = useSelector((state) => state.affiliate.city);
  const zone = useSelector((state) => state.cart?.zone);
  const addressData = useSelector((state) => state.address.items);
  const cart = useSelector((state) => state.cart.items);
  console.log(cart)
  const affiliater = useSelector((state) => state.affiliate.active);
  console.log(affiliater)

  useEffect(() => {
    if (options?.themeType) {
      document.documentElement.dataset.theme = options?.themeType;
      document.documentElement.setAttribute("data-bs-theme", options.themeType);
    } else {
      document.documentElement.dataset.theme = "light";
      document.documentElement.setAttribute("data-bs-theme", "light");
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
        options.themeFontAlign &&
          setClassName("theme-font-align", options.themeFontAlign);
        options.themeFontTitle &&
          setClassName("theme-font-title", options.themeFontTitle);
        options.themeFontTitleSize &&
          setClassName("theme-font-size-title", options.themeFontTitleSize);
        options.themeFontTitleAlign &&
          setClassName("theme-font-align-title", options.themeFontTitleAlign);
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
    const getDataOptions = async () => {
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
        try {
          await axios.get("https://ip.yooapp.ru").then(({ data }) => {
            data?.ip && dispatch(updateIp(data.ip));
            !city &&
              dispatch(updateSettingsCity(data?.city ? data.city : false));
            !city &&
              dispatch(
                updateSettingsCountry(data?.country ? data.country : false)
              );
          });

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
                  updateOptions({
                    options: res.options,
                    token: res.token,
                  })
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

                if (
                  !availableDeliveryTypes.includes(delivery) &&
                  deliveryType
                ) {
                  dispatch(editDeliveryCheckout(deliveryType)); // Выбираем найденный элемент
                }
              }

              if (res?.cities?.length > 0) {
                const transformedData = res.cities.map((city) => {
                  return {
                    ...city,
                    affiliates:
                      city.relationCities && city.relationCities.length > 0
                        ? city.relationCities
                          .map((relation) => relation.affiliate)
                          .sort((a, b) => {
                            if (a.main === b.main) {
                              return 0;
                            } else if (a.main) {
                              return -1;
                            } else {
                              return 1;
                            }
                          })
                        : [],
                  };
                });

                dispatch(updateCities(transformedData));

                if (
                  transformedData?.length > 0 &&
                  transformedData[0]?.affiliates?.length > 0
                ) {
                  dispatch(
                    updateAffiliate(
                      city?.id
                        ? transformedData.find((e) => e.id === city.id)
                          ?.affiliates ?? transformedData[0].affiliates
                        : transformedData[0].affiliates
                    )
                  );
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
                  updateStatus({
                    mainYes: statusesMain,
                    mainNo: statusesMainNo,
                  })
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
            // .catch(() => dispatch(resetSettings()))
            .finally(() => setLoading(false));
        } catch (err) { }
      } else {
        if (auth?.token) {
          if (!auth?.user?.brandId) {
            return dispatch(logout());
          }
          await checkAuth()
            .then((data) => {
              dispatch(setUser(data));
            })
            .catch((err) => {
              err?.response?.status === 404 && dispatch(logout());
            });
        }
        if (auth?.user?.lang) {
          i18n.changeLanguage(languageCode(auth.user.lang));
          moment.locale(languageCode(auth.user.lang));
        }
        setLoading(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const lastUpdateTime = sessionStorage.getItem("lastUpdateTime");
        const currentTime = new Date().getTime();

        // Если прошёл 1 час (3600000 миллисекунд) с момента последнего обновления
        if (!lastUpdateTime || currentTime - lastUpdateTime > 3600000) {
          getDataOptions();
          sessionStorage.setItem("lastUpdateTime", currentTime); // Обновляем время последнего обновления
        }
      }
    };

    if (isFirstRender.current) {
      // Выполняем код только при первом рендере
      getDataOptions();
      sessionStorage.setItem("lastUpdateTime", new Date().getTime()); // Обновляем время последнего обновления
      isFirstRender.current = false; // Устанавливаем флаг в false после первого рендера
    }

    // Добавляем обработчик для события visibilitychange
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (auth?.isAuth) {
      if (!zone?.data && addressData?.length > 0) {
        const fetchDeliveryData = async () => {
          try {
            if (delivery !== "delivery" || !auth?.user?.id) throw false;
            const newAddresses = city?.title ? addressData : newAddresses[0];
            const selectedAddress =
              newAddresses?.find((e) => e.main) || newAddresses[0];

            if (!selectedAddress) throw false;

            const weight = cart.reduce((sum, item) => {
              return sum + (item.energy?.weight ?? 0) * (item.cart?.count ?? 0);
            }, 0);

            const res = await getDelivery({
              addressId: selectedAddress?.id,
              distance: true,
              weight,
            });

            dispatch(cartZone({ data: res?.zone, distance: res?.distance }));
          } catch (error) {
            if (delivery === "delivery") {
              dispatch(cartZone({ data: false, distance: false }));
            }
          }
        };

        fetchDeliveryData();
      } else if (zone?.data && delivery === "delivery") {
        dispatch(cartZone({ data: false, distance: false }));
      }

      if (auth?.user?.id) {
        socket.on("notifications/" + auth.user.id, (data) => {
          if (data) {
            dispatch(updateNotification(data));
          }
        });
      }

      apiId &&
        socket.on("logout/" + apiId, () => {
          socket.disconnect();
          setTimeout(() => window.location.reload(), 1500);
        });

      return () => {
        auth?.user?.id && socket.off("notifications/" + auth.user.id);
        apiId && socket.off("logout/" + apiId);
      };
    } else if (apiId && options?.brand?.id) {
      socket.io.opts.query = {
        brandId: options?.brand?.id,
      };
      socket.connect();

      socket.on("login/" + apiId, (response) => {
        dispatch(setUser(response.user));
        dispatch(setToken(response.token));
        dispatch(setRefreshToken(response.refreshToken));
        dispatch(updateAddresses(response?.user?.addresses ?? []));
        dispatch(setAuth(true));
        dispatch(setLoadingLogin(false));
      });
      return () => {
        socket.off("login/" + apiId);
      };
    }
  }, [auth.isAuth, apiId]);

  if (loading) {
    return <Loader full />;
  }

  return (
    <>
      <Holiday />
      <YandexMetrika />
      <AppRouter />
      <CookieAccept />
    </>
  );
}

export default App;
