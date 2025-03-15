import { Map, Placemark, Polygon, YMaps } from "@pbe/react-yandex-maps";
import moment from "moment-timezone";
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  ButtonGroup,
  Col,
  Dropdown,
  Form,
  Modal,
  OverlayTrigger,
  Popover,
  Row,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useTranslation } from "react-i18next";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import {
  IoChevronDown,
  IoChevronForward,
  IoCloseOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AppStore from "../assets/imgs/appstore-black.svg";
import GooglePlay from "../assets/imgs/googleplay-black.svg";
import { customPrice, getCount, getImageURL, weekday } from "../helpers/all";
import { isWork } from "../hooks/all";
import { deleteCart } from "../services/cart";
import {
  mainAffiliateEdit,
  updateAffiliate,
  updateCity,
  updateGps,
} from "../store/reducers/affiliateSlice";
import { editDeliveryCheckout } from "../store/reducers/checkoutSlice";
import { updateStartSettings } from "../store/reducers/settingsSlice";
import DeliveryBar from "./DeliveryBar";
import ScrollToTop from "./ScrollToTop";
import MenuIcon from "./svgs/MenuIcon";
import Input from "./utils/Input";
import Loader from "./utils/Loader";
import Select from "./utils/Select";
import { mainAddressEdit } from "../store/reducers/addressSlice";
import Textarea from "./utils/Textarea";
import { useForm, useWatch } from "react-hook-form";
import useDebounce from "../hooks/useDebounce";
import { getDadataStreets } from "../services/dadata";
import { getDelivery } from "../services/order";
import { NotificationManager } from "react-notifications";

const Header = memo(() => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const city = useSelector((state) => state.affiliate.city);
  const gps = useSelector((state) => state.affiliate.gps);
  const affiliate = useSelector((state) => state.affiliate.items);
  const zones = useSelector((state) => state.affiliate.zones);
  const cities = useSelector((state) => state.affiliate.cities);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const options = useSelector((state) => state.settings.options);
  const delivery = useSelector((state) => state.checkout.delivery);
  const settingsCity = useSelector((state) => state.settings.city);
  const startSettings = useSelector((state) => state.settings.startSettings);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const count = getCount(cart);
  const [list, setList] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState();
  const [isPending, startTransition] = useTransition();
  const [showPopover, setShowPopover] = useState(false);
  const [mainAffiliate, setMainAffiliate] = useState(selectedAffiliate);
  const mapRef = useRef(null);
  const polygonsRef = useRef({});
  const dropdownRef = useRef(null);
  var locations = [];

  const [streets, setStreets] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    control,
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });
  const data = useWatch({ control });

  const streetText = useDebounce(data.full, 1000);

  if (affiliate?.length > 0 && cities?.length > 0) {
    const affiliateIds = affiliate.map((e) => e.id);

    let foundCities = cities.filter((city) =>
      city.relationCities.some((relationCity) =>
        affiliateIds.includes(relationCity.affiliateId)
      )
    );

    if (foundCities?.length > 0) {
      foundCities.forEach((city) => {
        locations.push({ city: city.title.toLowerCase() });

        if (city?.options?.settlements) {
          city.options.settlements.forEach((settlement) => {
            locations.push({ settlement: settlement.title.toLowerCase() });
          });
        }
      });
    } else {
      affiliate.forEach((e) =>
        locations.push({ city: e.options.city.toLowerCase() })
      );
    }
  }

  // Обработчик для открытия Popover
  const handleMouseEnter = () => {
    setShowPopover(true);
  };

  // Обработчик для закрытия Popover
  const handleMouseLeave = () => {
    setShowPopover(false);
  };
  const deliveryArray = [
    ...(options?.delivery?.status
      ? [{ title: t("Доставка"), value: "delivery" }]
      : []),
    ...(options?.pickup?.status
      ? [{ title: t("Самовывоз"), value: "pickup" }]
      : []),
    ...(options?.hall?.status ? [{ title: t("В зале"), value: "hall" }] : []),
  ];

  const handleChange = (value) => {
    setSearchInput(value);
    startTransition(() => {
      let searchList = [];
      list.forEach((e) => {
        e.cities.forEach(
          (e2) =>
            (e2.title.toLowerCase().includes(value.toLowerCase()) ||
              (e2.options?.alias &&
                e2.options?.alias
                  .toLowerCase()
                  .includes(value.toLowerCase()))) &&
            searchList.push(e2)
        );
      });
      setSearch(searchList);
    });
  };

  const clickAddress = useCallback(
    async (address) => {
      try {
        const isValidAddress =
          address &&
          address.data?.geo_lat &&
          address.data?.geo_lon &&
          address.data?.house;

        const commonData = {
          full: address.value ?? null,
          country: address.data.country ?? null,
          region: address.data.region ?? null,
          block: address.data.block ?? null,
          city: address.data.city ?? null,
          area: address.data.federal_district ?? null,
          street: address.data.street ?? null,
          home: address.data.house ?? null,
          apartment: address.data.flat ?? null,
          lat: address.data.geo_lat ?? null,
          lon: address.data.geo_lon ?? null,
          postal: address.data.postal_code ?? null,
          options: {
            fias_id: address.data.fias_id ?? null,
            region_fias_id: address.data.region_fias_id ?? null,
            city_fias_id: address.data.city_fias_id ?? null,
            street_fias_id: address.data.street_fias_id ?? null,
            kladr_id: address.data.kladr_id ?? null,
            region_kladr_id: address.data.region_kladr_id ?? null,
            city_kladr_id: address.data.city_kladr_id ?? null,
            street_kladr_id: address.data.street_kladr_id ?? null,
            fias_level: address.data.fias_level ?? null,
          },
        };

        if (isValidAddress) {
          const info = await getDelivery({
            distance: true,
            lat: address.data.geo_lat,
            lon: address.data.geo_lon,
          });

          if (info?.zone?.affiliateId) {
            setShowDropdown(false);

            reset({
              ...data,
              affiliate: info.zone.affiliateId,
              zone: info.zone,
              distance: info.distance,
              ...commonData,
            });
            setTimeout(() => {
              mapRef.current.setCenter([
                address.data.geo_lat,
                address.data.geo_lon,
              ]);
              mapRef.current.setZoom(17);
            }, 500);

            return true;
          }
        } else if (address?.value) {
          NotificationManager.error(t("Укажите номер дома"));
          return reset({
            ...data,
            ...commonData,
          });
        } else {
          setShowDropdown(false);
        }
      } catch (err) {
        return NotificationManager.error(
          t("Доставка на данный адрес не производится")
        );
      }
    },
    [data]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (!showDropdown) {
        setShowDropdown(true);
      }
      if ((e === "Enter" || e.key === "Enter") && streets?.length > 0) {
        clickAddress(streets[0]);
      }
    },
    [showDropdown, streets]
  );
  useEffect(() => {
    if (streetText) {
      getDadataStreets({
        query: streetText,
        locations,
        token: options.dadataToken,
      }).then((res) => {
        if (res?.data?.suggestions) {
          setStreets(res.data.suggestions);
        }
      });
    }
  }, [streetText]);

  useEffect(() => {
    // Сортируем города по алфавиту
    if (cities && cities?.length > 0) {
      if (settingsCity && !city) {
        let defaultCity = cities.find(
          (e) => e.title.toLowerCase() === settingsCity.toLowerCase()
        );
        if (defaultCity) {
          dispatch(updateCity(defaultCity));
        }
      }
      let citiesData = [...cities];
      // Группируем города по странам
      const groupedCities = citiesData.reduce((acc, city) => {
        const country = city.country;
        if (!acc[country]) {
          acc[country] = [];
        }
        acc[country].push(city);
        return acc;
      }, {});

      // Сортируем страны по алфавиту
      const sortedCountries = Object.entries(groupedCities)
        .sort(([countryA, citiesA], [countryB, citiesB]) =>
          countryA.localeCompare(countryB)
        )
        .map(([country, cities]) => ({ country, cities }));

      // Сортируем города внутри каждой страны
      const resultArray = sortedCountries.map(({ country, cities }) => ({
        country,
        cities: cities.sort((a, b) => a.title.localeCompare(b.title)),
      }));
      setList(resultArray);
    }

    if (cities && cities?.length > 1 && !city) {
      setShowCity(true);
      // if ("geolocation" in navigator) {
      //   navigator.geolocation.getCurrentPosition(
      //     async (position) => {
      //       if (
      //         position?.coords?.latitude &&
      //         position?.coords?.longitude &&
      //         DADATA_TOKEN &&
      //         DADATA_URL_GEO
      //       ) {
      //         let geo = await axios.post(
      //           DADATA_URL_GEO,
      //           JSON.stringify({
      //             lat: position.coords.latitude,
      //             lon: position.coords.longitude,
      //           }),
      //           {
      //             headers: {
      //               "Content-Type": "application/json",
      //               Accept: "application/json",
      //               Authorization: "Token " + DADATA_TOKEN,
      //             },
      //           }
      //         );
      //         if (
      //           geo?.data?.suggestions &&
      //           geo?.data?.suggestions[0]?.data?.city &&
      //           cities &&
      //           cities?.length > 0
      //         ) {
      //           let city = cities.find(
      //             (e) =>
      //               e.title.toLowerCase() ===
      //               geo.data.suggestions[0].data.city.toLowerCase()
      //           );

      //           if (city) {
      //             dispatch(updateCity(city));
      //             dispatch(deleteCart());
      //           } else {
      //             setShowCity(true);
      //           }
      //         } else {
      //           setShowCity(true);
      //         }
      //       } else {
      //         setShowCity(true);
      //       }
      //     },
      //     () => setShowCity(true)
      //   );
      // } else {
      //   setShowCity(true);
      // }
    }
  }, [cities]);

  const onSubmitAddress = useCallback((data) => {
    if (!data?.street) {
      return NotificationManager.error(t("Укажите улицу"));
    }
    if (!data?.home) {
      return NotificationManager.error(t("Укажите номер дома"));
    }
    if (!data?.zone) {
      return NotificationManager.error(
        t("Доставка на данный адрес не производится")
      );
    }
    NotificationManager.success(t("Адрес успешно добавлен"));
  }, []);

  const mapPoligone = useMemo(() => {
    return (
      <>
        {mainAffiliate?.options?.coordinates?.lat &&
          mainAffiliate?.options?.coordinates?.lon && (
            <YMaps>
              <Map
                instanceRef={mapRef}
                onLoad={() => setLoading(false)}
                state={{
                  center: [
                    mainAffiliate.options.coordinates.lat,
                    mainAffiliate.options.coordinates.lon,
                  ],
                  zoom: 11,
                }}
                width="100%"
                height="100%"
                modules={["geoObject.addon.balloon"]}
              >
                {data?.lat &&
                data?.lon &&
                data?.street &&
                data?.home &&
                delivery === "delivery" ? (
                  <Placemark
                    options={{
                      iconLayout: "default#image",
                      iconImageHref: "imgs/marker.png",
                      iconImageSize: [38, 54],
                    }}
                    geometry={[data?.lat, data?.lon]}
                  />
                ) : (
                  affiliate?.length > 0 &&
                  delivery === "pickup" &&
                  affiliate.map(
                    (e) =>
                      e?.options?.coordinates?.lat &&
                      e?.options?.coordinates?.lon && (
                        <Placemark
                          key={e.id}
                          options={
                            mainAffiliate?.id === e.id
                              ? {
                                  iconLayout: "default#image",
                                  iconImageHref: "imgs/marker.png",
                                  iconImageSize: [38, 54],
                                }
                              : {
                                  iconLayout: "default#image",
                                  iconImageHref: "imgs/marker-gray.png",
                                  iconImageSize: [38, 54],
                                }
                          }
                          geometry={[
                            e.options.coordinates.lat,
                            e.options.coordinates.lon,
                          ]}
                        />
                      )
                  )
                )}
                {zones?.length > 0 &&
                  zones.map((e) => {
                    const geodata =
                      e.data.length > 0
                        ? e.data.map((geo) => [geo[1], geo[0]])
                        : false;

                    return (
                      <Polygon
                        key={e.id}
                        id={e.id}
                        instanceRef={(ref) => (polygonsRef.current[e.id] = ref)}
                        defaultGeometry={[geodata]}
                        options={{
                          fillColor: e?.color ? e.color : "#f56057",
                          strokeColor: e?.color ? e.color : "#f56057",
                          opacity: mainAffiliate?.id === e.id ? 0.6 : 0.3,
                          strokeWidth: 2,
                          strokeStyle: "solid",
                          visible: true,
                        }}
                        properties={{
                          balloonContent: `<address class='my-info'>
                    <div class='my-info-body'>
                      <h6 class='mb-0 fw-6'>${e.title}</h6>
                      ${e.desc ? `<p>${e.desc}</p>` : ""}
                      ${
                        e.minPrice > 0
                          ? `<p>${t("Минимальная сумма заказа")} ${customPrice(
                              e.minPrice
                            )}</p>`
                          : ""
                      }
                      ${
                        e.priceFree > 0
                          ? `<p>${t("Бесплатная доставка от")} ${customPrice(
                              e.priceFree
                            )}</p>`
                          : ""
                      }
                      ${
                        e.price > 0
                          ? `<p>${t("Стоимость доставки")} ${customPrice(
                              e.price
                            )}</p>`
                          : ""
                      }
                      ${
                        e.time > 0
                          ? `<p>${t("Время доставки от")} ${e.time} ${t(
                              "мин"
                            )}</p>`
                          : ""
                      }
                    </div>
                  </address>`,
                        }}
                      />
                    );
                  })}
              </Map>
            </YMaps>
          )}
      </>
    );
  }, [
    mainAffiliate,
    delivery,
    affiliate,
    zones,
    polygonsRef,
    mapRef,
    data?.lat,
    data?.lon,
    data?.street,
    data?.home,
  ]);

  if (options?.title === "YooApp") {
    return null;
  }

  return (
    <>
      <header>
        <Container className="h-100">
          <nav className="h-100">
            <div className="user-select d-flex align-items-center">
              <Link draggable="false" to="/" className="me-2 me-xxl-3">
                <img
                  draggable="false"
                  src={
                    options?.multiBrand
                      ? getImageURL({
                          path: selectedAffiliate.media,
                          type: "affiliate",
                          size: "full",
                        })
                      : options?.logo
                      ? getImageURL({
                          path: options.logo,
                          type: "all/web/logo",
                          size: "full",
                        })
                      : "/logo.png"
                  }
                  alt={options?.title ?? "YOOAPP"}
                  className="logo"
                />
                {/* <span className="ms-3 logo-name">
                {options?.title ?? "YOOAPP"}
              </span> */}
              </Link>
              <ul className="text-menu">
                <li>
                  {!options?.multiBrand &&
                    cities &&
                    cities?.length > 0 &&
                    cities[0]?.options?.view !== "no" && (
                      <a
                        onClick={() => cities?.length > 1 && setShowCity(true)}
                        className="fw-6"
                      >
                        <div className="btn btn-sm btn-light rounded-7">
                          {t(
                            cities?.length > 1
                              ? city?.options?.alias?.length > 0
                                ? city.options.alias
                                : city?.title ?? "Выберите город"
                              : cities[0]?.options?.view === "region" &&
                                cities[0]?.region
                              ? cities[0].region
                              : cities[0]?.options?.view === "country" &&
                                cities[0]?.country
                              ? cities[0].country
                              : cities[0]?.title ?? "Выберите город"
                          )}
                        </div>
                      </a>
                    )}
                  {options?.multiBrand && affiliate?.length > 0 && (
                    <a onClick={() => setShowBrand(true)} className="fw-6">
                      {t(
                        selectedAffiliate?.title ??
                          selectedAffiliate?.full ??
                          "Выберите бренд"
                      )}
                    </a>
                  )}
                  {!gps && city?.title && cities?.length > 1 && (
                    <div className="no-city">
                      <p className="mb-3">
                        {t("Ваш город")} <b>{city.title}</b>?
                      </p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          draggable="false"
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => {
                            dispatch(updateGps(true));
                          }}
                        >
                          {t("Да")}
                        </Link>
                        <Link
                          draggable="false"
                          className="btn btn-sm btn-light"
                          onClick={() => setShowCity(true)}
                        >
                          {t("Нет")}
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
                {deliveryArray?.length > 0 && !options?.hideDeliverySelect && (
                  <li className="d-none d-sm-inline-flex">
                    <Select
                      className="fw-5"
                      data={deliveryArray}
                      value={delivery}
                      onClick={(e) => dispatch(editDeliveryCheckout(e.value))}
                    />
                  </li>
                )}
              </ul>
            </div>
            <ul className="user-select text-menu d-none d-lg-flex">
              {options?.menu && options?.menu?.length > 0 ? (
                [...options.menu]
                  .sort((a, b) => a.order - b.order)
                  .map(
                    (e, index) =>
                      e?.status && (
                        <li key={index}>
                          <Link
                            draggable="false"
                            target={e?.link ? "_blank" : ""}
                            to={e?.link ?? e.page}
                            // className={e.type == "dark" ? "btn-primary" : ""}
                            className="fw-6"
                          >
                            {t(e.title)}
                          </Link>
                        </li>
                      )
                  )
              ) : (
                <>
                  <li>
                    <Link draggable="false" to="/contact" className="fw-6">
                      {t("Контакты")}
                    </Link>
                  </li>
                  <li>
                    <Link draggable="false" to="/promo" className="fw-6">
                      {t("Акции")}
                    </Link>
                  </li>
                </>
              )}
            </ul>
            {selectedAffiliate &&
              selectedAffiliate?.phone &&
              selectedAffiliate?.phone[0] && (
                <div>
                  <a
                    href={"tel:" + selectedAffiliate.phone[0]}
                    className="phone"
                  >
                    <span className="fw-6">{selectedAffiliate.phone[0]}</span>
                  </a>
                  {selectedAffiliate?.options?.work?.length > 0 &&
                  selectedAffiliate.options.work[moment().weekday()]?.start &&
                  selectedAffiliate.options.work[moment().weekday()]?.end ? (
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <OverlayTrigger
                        trigger={[]}
                        show={showPopover}
                        className="ms-2"
                        key="bottom"
                        placement="bottom"
                        overlay={
                          <Popover id="popover-positioned-bottom">
                            <Popover.Header className="fs-09 fw-6 text-center">
                              {t("Режим работы")}
                            </Popover.Header>
                            <Popover.Body>
                              {selectedAffiliate.options.work?.length > 0 &&
                                selectedAffiliate.options.work.map(
                                  (e, index) => (
                                    <p
                                      className={
                                        "d-flex mb-1" +
                                        (index === weekday
                                          ? " fw-6 text-main"
                                          : "")
                                      }
                                    >
                                      <b style={{ width: 25 }}>
                                        {moment.weekdaysShort(index + 1)}:
                                      </b>
                                      {`${t("с")} ${e.start} ${t("до")} ${
                                        e.end
                                      }`}
                                    </p>
                                  )
                                )}
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <a className="d-none d-lg-block text-muted fs-08 text-center">
                          {moment.weekdaysShort(moment().weekday() + 1)}:&nbsp;
                          {t("с")}&nbsp;
                          <b className="text-main">
                            {selectedAffiliate.options.work[weekday].start}
                          </b>
                          &nbsp;
                          {t("до")}&nbsp;
                          <b className="text-main">
                            {selectedAffiliate.options.work[weekday].end}
                          </b>
                        </a>
                      </OverlayTrigger>
                    </div>
                  ) : null}
                </div>
              )}

            <ul className="icons-menu">
              <li className="d-none d-lg-block">
                <Link draggable="false" to="/search">
                  <HiOutlineMagnifyingGlass size={25} />
                </Link>
              </li>
              <li className="d-none d-lg-block">
                <Link
                  draggable="false"
                  to={
                    isAuth
                      ? user?.status === 0
                        ? "/activate"
                        : "/account"
                      : "/login"
                  }
                >
                  {!options?.holiday &&
                    (moment().format("MM") === "12" ||
                      moment().format("MM") == "01" ||
                      moment().format("MM") == "02") && (
                      <img
                        draggable="false"
                        src="/imgs/cap.png"
                        className="cap"
                      />
                    )}
                  <HiOutlineUserCircle size={25} />
                  {(notification?.message > 0 || notification?.order > 0) && (
                    <span className="position-absolute top-100 start-100 translate-middle badge rounded-pill">
                      {notification.message +
                        notification.order +
                        notification.notification}
                    </span>
                  )}
                </Link>
              </li>
              {options?.cart && (
                <li className="d-none d-lg-block">
                  <Link
                    draggable="false"
                    to="/cart"
                    className="position-relative"
                  >
                    <HiOutlineShoppingBag size={25} />
                    {count > 0 && (
                      <span className="position-absolute top-100 start-100 translate-middle badge rounded-pill">
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              )}
              {/* {isAuth && (
                <li className="d-none d-lg-block">
                  <Link to="/account/favorites" className="position-relative">
                    <HiOutlineHeart size={25} />
                    {favorite?.length > 0 && (
                      <span className="position-absolute top-100 start-100 translate-middle badge rounded-pill">
                        {favorite?.length}
                      </span>
                    )}
                  </Link>
                </li>
              )} */}
              <li className="d-lg-none">
                <button
                  draggable={false}
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="btn-menu"
                >
                  {showMenu ? <IoCloseOutline /> : <MenuIcon />}
                </button>
              </li>
              {/* <li>
                <Select
                  value="ru"
                  data={[
                    {
                      value: "ru",
                      title: "русский",
                      image: ruFlag,
                    },
                    {
                      value: "en",
                      title: "english",
                      image: engFlag,
                    },
                  ]}
                />
              </li> */}
            </ul>
          </nav>
        </Container>
      </header>

      <DeliveryBar />

      <Offcanvas
        className="offcanvas-menu"
        show={showMenu}
        onHide={() => setShowMenu(false)}
        placement={"end"}
      >
        <Offcanvas.Body>
          <Container className="h-100">
            {deliveryArray?.length > 0 && !options?.hideDeliverySelect && (
              <Select
                className="mb-3"
                data={deliveryArray}
                value={delivery}
                onClick={(e) => dispatch(editDeliveryCheckout(e.value))}
              />
            )}
            <nav>
              <ul>
                {selectedAffiliate &&
                  selectedAffiliate?.phone &&
                  selectedAffiliate?.phone[0] && (
                    <>
                      <li key={0}>
                        <a
                          draggable="false"
                          href={"tel:" + selectedAffiliate.phone[0]}
                          className="phone"
                        >
                          <span className="fw-6">
                            {selectedAffiliate.phone[0]}
                          </span>
                        </a>
                      </li>
                      <li>
                        <OverlayTrigger
                          trigger={["click", "focus"]}
                          rootClose
                          className="ms-2"
                          key="bottom"
                          placement="auto"
                          overlay={
                            <Popover id="popover-positioned-bottom">
                              <Popover.Header className="fs-09 fw-6 text-center">
                                {t("Режим работы")}
                              </Popover.Header>
                              <Popover.Body>
                                {selectedAffiliate.options.work?.length > 0 &&
                                  selectedAffiliate.options.work.map(
                                    (e, index) => (
                                      <p
                                        className={
                                          "d-flex mb-1" +
                                          (index === weekday
                                            ? " fw-6 text-main"
                                            : "")
                                        }
                                      >
                                        <b style={{ width: 25 }}>
                                          {moment.weekdaysShort(index + 1)}:
                                        </b>
                                        {`${t("с")} ${e.start} ${t("до")} ${
                                          e.end
                                        }`}
                                      </p>
                                    )
                                  )}
                              </Popover.Body>
                            </Popover>
                          }
                        >
                          <a
                            draggable="false"
                            className="d-flex text-muted fw-4 fs-08"
                          >
                            {moment.weekdaysShort(moment().weekday() + 1)}
                            :&nbsp;
                            {t("с")}&nbsp;
                            <b className="text-main">
                              {selectedAffiliate.options.work[weekday].start}
                            </b>
                            &nbsp;{t("до")}&nbsp;
                            <b className="text-main">
                              {selectedAffiliate.options.work[weekday].end}
                            </b>
                          </a>
                        </OverlayTrigger>
                      </li>
                    </>
                  )}
                {options?.menu && options?.menu?.length > 0 ? (
                  options.menu.map(
                    (e, index) =>
                      e?.status && (
                        <li key={index}>
                          <Link
                            draggable="false"
                            to={e?.link ?? e.page}
                            onClick={() => setShowMenu(false)}
                          >
                            {t(e.title)}
                          </Link>
                        </li>
                      )
                  )
                ) : (
                  <>
                    <li>
                      <Link draggable="false" to="/contact">
                        {t("Контакты")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        draggable="false"
                        to="/contact"
                        onClick={() => setShowMenu(false)}
                      >
                        {t("Оплата и доставка")}
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    draggable="false"
                    to="/policy"
                    onClick={() => setShowMenu(false)}
                  >
                    {t("Политика конфиденциальности")}
                  </Link>
                </li>
              </ul>
            </nav>
            {options?.app?.name && (
              <div>
                <p className="mt-4 justify-content-center d-flex">
                  {t("Заказывайте через приложение")}
                </p>
                <ul className="list-unstyled d-flex justify-content-center mt-2">
                  {/iPhone|iPad/i.test(navigator.userAgent) &&
                  options.app?.accountApple &&
                  options.app.titleIos ? (
                    <li key={0}>
                      <a
                        target="_blank"
                        href={
                          "https://apps.apple.com/ru/app/" +
                          (options.app?.titleIos?.length > 0
                            ? options.app.titleIos
                            : options.app?.nameIos?.length > 0
                            ? options.app.nameIos
                            : options.app.name) +
                          (options.app?.accountApple
                            ? "/id" + options.app.accountApple
                            : "")
                        }
                      >
                        <img
                          draggable="false"
                          src={AppStore}
                          alt="App Store"
                          height="50"
                        />
                      </a>
                    </li>
                  ) : /Android/i.test(navigator.userAgent) ? (
                    <li
                      key={0}
                      className="list-unstyled d-flex justify-content-center"
                    >
                      <a
                        target="_blank"
                        href={
                          "https://play.google.com/store/apps/details?id=" +
                          (options.app?.nameAndroid?.length > 0
                            ? options.app.nameAndroid
                            : options.app.name)
                        }
                      >
                        <img
                          draggable="false"
                          src={GooglePlay}
                          alt="Google Play"
                          height="50"
                        />
                      </a>
                    </li>
                  ) : (
                    <div
                      key={0}
                      className="list-unstyled d-flex justify-content-center"
                    >
                      {options.app?.accountApple && options.app?.titleIos && (
                        <li>
                          <a
                            target="_blank"
                            href={
                              "https://apps.apple.com/ru/app/" +
                              (options.app?.titleIos?.length > 0
                                ? options.app.titleIos
                                : options.app?.nameIos?.length > 0
                                ? options.app.nameIos
                                : options.app.name) +
                              (options.app?.accountApple
                                ? "/id" + options.app.accountApple
                                : "")
                            }
                          >
                            <img
                              draggable="false"
                              src={AppStore}
                              alt="App Store"
                              height="35"
                            />
                          </a>
                        </li>
                      )}
                      <li className="ms-2">
                        <a
                          target="_blank"
                          href={
                            "https://play.google.com/store/apps/details?id=" +
                            (options.app?.nameAndroid?.length > 0
                              ? options.app.nameAndroid
                              : options.app.name)
                          }
                        >
                          <img
                            draggable="false"
                            src={GooglePlay}
                            alt="Google Play"
                            height="35"
                          />
                        </a>
                      </li>
                    </div>
                  )}
                </ul>
              </div>
            )}

            {!options?.branding && (
              <div className="justify-content-center mt-4 d-flex">
                <a href="https://yooapp.ru" target="_blank">
                  <div>
                    <span className="text-muted  me-1">
                      {t("Разработано на платформе")}
                    </span>
                    <b>yooapp</b>
                  </div>
                </a>
              </div>
            )}
          </Container>
        </Offcanvas.Body>
      </Offcanvas>

      {!startSettings && !!city?.title && !showCity && (
        <Modal
          size="lg"
          centered
          fullscreen="sm-down"
          backdrop="static"
          keyboard={false}
          className="city"
          show={!startSettings}
          onHide={() => dispatch(updateStartSettings(true))}
        >
          <Modal.Body className="p-0">
            <Row className="gx-0">
              <Col md={7}>
                <div className="map-header">
                  {loading && <Loader />}
                  {mapPoligone}
                </div>
              </Col>
              <Col md={5} className="p-3">
                <ToggleButtonGroup
                  size="sm"
                  type="radio"
                  className="mb-3 w-100"
                  name="delivery"
                  defaultValue={delivery}
                  onChange={(e) => {
                    reset({});
                    dispatch(editDeliveryCheckout(e));
                  }}
                >
                  {deliveryArray.map((e) => (
                    <ToggleButton
                      key={e.value}
                      id={"radio-" + e.value}
                      value={e.value}
                    >
                      {e.title}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <div className="fs-09 fw-6 d-flex align-items-center justify-content-between mb-3">
                  <span>Ваш город</span>
                  <a className="text-main" onClick={() => setShowCity(true)}>
                    {city?.title} <IoChevronDown />
                  </a>
                </div>
                {delivery === "pickup" ? (
                  <ul className="list-unstyled pe-1 scroll-custom mb-3 affiliates-list-modal">
                    {affiliate.map((e) => (
                      <a
                        key={e.id}
                        onClick={() => {
                          setMainAffiliate(e);
                          mapRef.current.setCenter([
                            e.options.coordinates.lat,
                            e.options.coordinates.lon,
                          ]);
                          mapRef.current.setZoom(15);
                        }}
                        className={mainAffiliate?.id === e.id ? "active" : ""}
                      >
                        <li className="mb-3">
                          <label className="d-flex flex-row align-items-start">
                            <div className={"me-2" + (e.title ? " mt-1" : "")}>
                              <input
                                type="radio"
                                name="mainAffiliate"
                                defaultChecked={mainAffiliate?.id === e.id}
                                onChange={() => setMainAffiliate(e)}
                              />
                            </div>
                            <div>
                              <b>{e.title ?? e.full}</b>
                              {e.title && <p className="fs-09">{e.full}</p>}
                            </div>
                          </label>
                        </li>
                      </a>
                    ))}
                  </ul>
                ) : (
                  <div className="mb-3 pe-1 scroll-custom affiliates-list-modal">
                    <div className="mb-2 position-relative">
                      <Input
                        required
                        errors={errors}
                        label={t("Адрес")}
                        onKeyDown={(e) => onKeyDown(e)}
                        onClick={() => setShowDropdown(true)}
                        type="search"
                        autoComplete="off"
                        name="full"
                        className="input-sm"
                        placeholder={t("Введите адрес")}
                        register={register}
                        validation={{
                          required: t("Обязательное поле"),
                          maxLength: {
                            value: 250,
                            message: t("Максимум 250 символов"),
                          },
                        }}
                      />
                      {showDropdown && streets?.length > 0 && (
                        <Dropdown.Menu
                          ref={dropdownRef}
                          show
                          className="w-100 select-options"
                        >
                          {!data?.home && (
                            <div className="fs-08 text-danger p-2 px-3">
                              {t("Выберите адрес с номером дома")}
                            </div>
                          )}
                          {streets.map(
                            (item, key) =>
                              item && (
                                <Dropdown.Item
                                  onClick={() => clickAddress(item)}
                                  key={key}
                                >
                                  {item.value}
                                </Dropdown.Item>
                              )
                          )}
                        </Dropdown.Menu>
                      )}
                    </div>
                    {!data?.private && (
                      <Row className="gx-2">
                        <Col md={6}>
                          <div className="mb-2">
                            <Input
                              className="input-sm"
                              required
                              errors={errors}
                              label={t("Подъезд")}
                              name="entrance"
                              register={register}
                              validation={{
                                required: t("Обязательное поле"),
                                maxLength: {
                                  value: 20,
                                  message: t("Максимум 20 символов"),
                                },
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-2">
                            <Input
                              className="input-sm"
                              required
                              errors={errors}
                              label={t("Квартира")}
                              name="apartment"
                              register={register}
                              validation={{
                                required: t("Обязательное поле"),
                                maxLength: {
                                  value: 20,
                                  message: t("Максимум 20 символов"),
                                },
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-2">
                            <Input
                              className="input-sm"
                              required
                              errors={errors}
                              label={t("Этаж")}
                              type="number"
                              name="floor"
                              register={register}
                              validation={{
                                required: t("Обязательное поле"),
                                maxLength: {
                                  value: 20,
                                  message: t("Максимум 20 символов"),
                                },
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-2">
                            <Input
                              className="input-sm"
                              errors={errors}
                              label={t("Код домофона")}
                              name="code"
                              register={register}
                              validation={{
                                maxLength: {
                                  value: 30,
                                  message: t("Максимум 30 символов"),
                                },
                              }}
                            />
                          </div>
                        </Col>
                      </Row>
                    )}
                    <Form.Check className="mb-2 mt-2">
                      <Form.Check.Input
                        type="checkbox"
                        name="private"
                        id="private"
                        value={true}
                        {...register("private")}
                      />
                      <Form.Check.Label htmlFor="private" className="ms-2">
                        {t("Частный дом")}
                      </Form.Check.Label>
                    </Form.Check>

                    <Textarea
                      className="input-sm"
                      label={t("Комментарий")}
                      name="comment"
                      placeholder={t("Введите комментарий (Необязательно)")}
                      errors={errors}
                      register={register}
                      validation={{
                        maxLength: {
                          value: 1500,
                          message: t("Максимум 1500 символов"),
                        },
                      }}
                    />
                  </div>
                )}
                {delivery === "delivery" ? (
                  <button
                    className="btn btn-primary w-100"
                    draggable={false}
                    disabled={
                      !isValid ||
                      showDropdown ||
                      (data?.private && (!data?.street || !data?.home))
                    }
                    onClick={handleSubmit(onSubmitAddress)}
                  >
                    Добавить адрес
                  </button>
                ) : (
                  <button
                    disabled={!!!mainAffiliate}
                    className="btn btn-primary w-100"
                    onClick={() => dispatch(mainAffiliateEdit(mainAffiliate))}
                  >
                    Закажу здесь
                  </button>
                )}
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      )}

      {cities?.length > 1 && (
        <Modal
          size="lg"
          centered
          fullscreen="sm-down"
          backdrop={city?.title ? true : "static"}
          keyboard={!!city?.title}
          className="city"
          show={showCity}
          onHide={() => setShowCity(false)}
        >
          <Modal.Body className="p-4">
            <img
              draggable={false}
              src={
                options?.logo
                  ? getImageURL({
                      path: options.logo,
                      type: "all/web/logo",
                      size: "full",
                    })
                  : "/logo.png"
              }
              alt={options?.title ?? "YOOAPP"}
              className="logo mb-4"
            />

            {city?.title && (
              <button
                draggable={false}
                type="button"
                className="btn-close close"
                aria-label="Close"
                onClick={() => setShowCity(false)}
              ></button>
            )}
            <div>
              <Input
                name="search"
                type="search"
                placeholder={t("Поиск...")}
                className="mb-3"
                onChange={handleChange}
                value={searchInput}
              />
            </div>
            <div className="box-shadow">
              <div className="box-shadow-top"></div>
              <div className="search-box">
                {searchInput?.length > 0 && search && search?.length > 0
                  ? search.length > 0 && (
                      <div className="cities">
                        {Object.entries(
                          search
                            .sort((a, b) => a.title.localeCompare(b.title))
                            .reduce((acc, city) => {
                              const firstLetter = city.title[0].toUpperCase();
                              if (!acc[firstLetter]) {
                                acc[firstLetter] = [];
                              }
                              acc[firstLetter].push(city);
                              return acc;
                            }, {})
                        ).map(([letter, cities]) => (
                          <div key={letter} className="cities-box">
                            <b className="d-block cities-box-letter text-main">
                              {letter}
                            </b>
                            <Row>
                              {cities.map((e, index) => (
                                <Col md={12} key={index} className="pb-2 ps-3">
                                  <a
                                    onClick={() => {
                                      dispatch(updateAffiliate(e.affiliates));
                                      dispatch(updateCity(e));
                                      dispatch(updateGps(true));
                                      dispatch(deleteCart());
                                      setShowCity(false);
                                    }}
                                    className={
                                      "py-2 fw-6" +
                                      (e.title === city?.title &&
                                      e.options?.alias === city?.options?.alias
                                        ? " active"
                                        : "")
                                    }
                                  >
                                    {e?.options?.alias?.length > 0
                                      ? e.options.alias
                                      : e.title}
                                  </a>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        ))}
                      </div>
                    )
                  : list?.length > 0 &&
                    list.map((item) => (
                      <React.Fragment key={item.country}>
                        {item?.country && (
                          <h6 className="fw-7 p-2">{item.country}</h6>
                        )}
                        {item?.cities?.length > 0 && (
                          <div className="cities">
                            {Object.entries(
                              item.cities
                                .sort((a, b) => a.title.localeCompare(b.title))
                                .reduce((acc, city) => {
                                  const firstLetter =
                                    city.title[0].toUpperCase();
                                  if (!acc[firstLetter]) {
                                    acc[firstLetter] = [];
                                  }
                                  acc[firstLetter].push(city);
                                  return acc;
                                }, {})
                            ).map(([letter, cities]) => (
                              <div key={letter} className="cities-box">
                                <b className="d-block cities-box-letter text-main">
                                  {letter}
                                </b>
                                <Row>
                                  {cities.map((e, index) => (
                                    <Col
                                      md={12}
                                      key={index}
                                      className="pb-2 ps-3"
                                    >
                                      <a
                                        onClick={() => {
                                          dispatch(
                                            updateAffiliate(e.affiliates)
                                          );
                                          dispatch(updateCity(e));
                                          dispatch(updateGps(true));
                                          dispatch(deleteCart());
                                          setShowCity(false);
                                        }}
                                        className={
                                          "py-2 fw-6" +
                                          (e.title === city?.title &&
                                          e.options?.alias ===
                                            city?.options?.alias
                                            ? " active"
                                            : "")
                                        }
                                      >
                                        {e?.options?.alias?.length > 0
                                          ? e.options.alias
                                          : e.title}
                                      </a>
                                    </Col>
                                  ))}
                                </Row>
                              </div>
                            ))}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
              </div>
              {/* <div className="box-shadow-bottom"></div> */}
            </div>
          </Modal.Body>
        </Modal>
      )}
      {affiliate?.length > 1 && (
        <Modal
          size="lg"
          centered
          className="brand"
          show={showBrand}
          backdrop={city?.title ? true : "static"}
          keyboard={!!city?.title}
          onHide={() => setShowBrand(false)}
        >
          <Modal.Body className="p-4">
            {city?.title && (
              <button
                draggable={false}
                type="button"
                className="btn-close close"
                aria-label="Close"
                onClick={() => setShowBrand(false)}
              ></button>
            )}
            <h5 className="fw-7 mb-4">{t("Выберите заведение")}</h5>
            <div className="search-box">
              {affiliate?.length > 0 && (
                <Row>
                  {affiliate.map((e, index) => (
                    <Col md={6} key={index} className="pb-3">
                      <a
                        onClick={() => {
                          dispatch(mainAffiliateEdit(e));
                          dispatch(deleteCart());
                          setShowBrand(false);
                        }}
                        className={
                          "brand-item" +
                          (e.id === selectedAffiliate?.id ? " active" : "")
                        }
                      >
                        <Row className="align-items-center">
                          {e.media && (
                            <Col xs="auto">
                              <img
                                src={getImageURL({
                                  path: e.media,
                                  type: "affiliate",
                                  size: "full",
                                })}
                                alt={options?.title ?? "YOOAPP"}
                                className="logo"
                              />
                            </Col>
                          )}
                          <Col>
                            <div className="fw-7 mb-1">
                              {e?.title ? e.title : e.full}
                            </div>

                            <div>
                              {e.status === 0 ? (
                                <span className="text-danger">
                                  {t("Сейчас закрыто")}
                                </span>
                              ) : e?.options?.work &&
                                e?.options?.work[moment().weekday()].start &&
                                e?.options?.work[moment().weekday()].end ? (
                                isWork(
                                  e?.options?.work[moment().weekday()].start,
                                  e?.options?.work[moment().weekday()].end
                                ) ? (
                                  <span className="text-muted">
                                    {t("Работает c")}{" "}
                                    {e?.options?.work[moment().weekday()].start}{" "}
                                    {t("до")}{" "}
                                    {e?.options?.work[moment().weekday()].end}
                                  </span>
                                ) : (
                                  <span className="text-danger">
                                    {t("Сейчас закрыто")}
                                  </span>
                                )
                              ) : e?.desc ? (
                                <span className="text-muted">{e.desc}</span>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </a>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Modal.Body>
        </Modal>
      )}
      <ScrollToTop />
    </>
  );
});

export default Header;
