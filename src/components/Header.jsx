import axios from "axios";
import moment from "moment";
import React, { memo, useEffect, useState, useTransition } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useTranslation } from "react-i18next";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AppStore from "../assets/imgs/appstore-black.svg";
import GooglePlay from "../assets/imgs/googleplay-black.svg";
import { DADATA_TOKEN, DADATA_URL_GEO } from "../config/api";
import { getCount, getImageURL } from "../helpers/all";
import { isWork } from "../hooks/all";
import { deleteCart } from "../services/cart";
import {
  mainAffiliateEdit,
  updateAffiliate,
  updateCity,
  updateGps,
} from "../store/reducers/affiliateSlice";
import { editDeliveryCheckout } from "../store/reducers/checkoutSlice";
import DeliveryBar from "./DeliveryBar";
import ScrollToTop from "./ScrollToTop";
import MenuDelivery from "./svgs/MenuDelivery";
import MenuDocs from "./svgs/MenuDocs";
import MenuIcon from "./svgs/MenuIcon";
import MenuPhone from "./svgs/MenuPhone";
import Input from "./utils/Input";
import Select from "./utils/Select";

const Header = memo(() => {
  const { t } = useTranslation();

  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  // const favorite = useSelector((state) => state.favorite.items);
  const city = useSelector((state) => state.affiliate.city);
  const gps = useSelector((state) => state.affiliate.gps);
  const affiliate = useSelector((state) => state.affiliate.items);
  const cities = useSelector((state) => state.affiliate.cities);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const options = useSelector((state) => state.settings.options);
  const delivery = useSelector((state) => state.checkout.delivery);
  const settingsCity = useSelector((state) => state.settings.city);

  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const count = getCount(cart);
  const [list, setList] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState();
  const [isPending, startTransition] = useTransition();

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

  return (
    <>
      <header>
        <Container className="h-100">
          <nav className="h-100">
            <div className="d-flex align-items-center">
              <Link to="/" className="me-3 me-lg-5">
                <img
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
                  {!options?.multiBrand && cities && cities?.length > 0 && (
                    <a
                      onClick={() => cities?.length > 1 && setShowCity(true)}
                      className="fw-6"
                    >
                      {t(
                        cities?.length > 1
                          ? city?.options?.alias ??
                              city?.title ??
                              "Выберите город"
                          : cities[0]?.options?.view === "region" &&
                            cities[0]?.region
                          ? cities[0].region
                          : cities[0]?.options?.view === "country" &&
                            cities[0]?.country
                          ? cities[0].country
                          : cities[0]?.options?.view === "no"
                          ? ""
                          : cities[0]?.title ?? "Выберите город"
                      )}
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
                  {!gps && city?.title && (
                    <div className="no-city">
                      <p className="mb-3">
                        {t("Ваш город")} <b>{city.title}</b>?
                      </p>
                      <div className="d-flex align-items-center justify-content-center">
                        <Link
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => {
                            dispatch(updateGps(true));
                          }}
                        >
                          {t("Да")}
                        </Link>
                        <Link
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
            <ul className="text-menu d-none d-lg-flex">
              {options?.menu?.length > 0 ? (
                options.menu.map(
                  (e, index) =>
                    e?.status && (
                      <li key={index}>
                        <Link
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
                    <Link to="/contact" className="fw-6">
                      {t("Контакты")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/promo" className="fw-6">
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
                    <>
                      <div className="d-none d-lg-flex text-muted fs-08">
                        {`${t("с")} ${
                          selectedAffiliate.options.work[moment().weekday()]
                            .start
                        } ${t("до")} ${
                          selectedAffiliate.options.work[moment().weekday()].end
                        }`}
                        {selectedAffiliate.options.work[5].status &&
                        selectedAffiliate.options.work[5].status
                          ? t(", без выходных")
                          : null}
                      </div>
                    </>
                  ) : null}
                </div>
              )}

            <ul className="icons-menu">
              <li className="d-none d-lg-block">
                <Link to="/search">
                  <HiOutlineMagnifyingGlass size={25} />
                </Link>
              </li>
              <li className="d-none d-lg-block">
                <Link
                  to={
                    isAuth
                      ? user?.status === 0
                        ? "/activate"
                        : "/account"
                      : "/login"
                  }
                >
                  <HiOutlineUserCircle size={25} />
                </Link>
              </li>
              {options?.cart && (
                <li className="d-none d-lg-block">
                  <Link to="/cart" className="position-relative">
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
                    <li key={-1}>
                      <a
                        href={"tel:" + selectedAffiliate.phone[0]}
                        className="phone"
                      >
                        <span className="fw-6">
                          {selectedAffiliate.phone[0]}
                          {selectedAffiliate?.options?.work?.length > 0 &&
                          selectedAffiliate.options.work[moment().weekday()]
                            ?.start &&
                          selectedAffiliate.options.work[moment().weekday()]
                            ?.end ? (
                            <>
                              <div className="d-flex text-muted fw-4 fs-08">
                                {`${t("с")} ${
                                  selectedAffiliate.options.work[
                                    moment().weekday()
                                  ].start
                                } ${t("до")} ${
                                  selectedAffiliate.options.work[
                                    moment().weekday()
                                  ].end
                                }`}
                                {selectedAffiliate.options.work[5].status &&
                                selectedAffiliate.options.work[5].status
                                  ? t(", без выходных")
                                  : null}
                              </div>
                            </>
                          ) : null}
                        </span>
                      </a>
                    </li>
                  )}
                {options?.menu?.length > 0 ? (
                  options.menu.map(
                    (e, index) =>
                      e?.status && (
                        <li key={index}>
                          <Link
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
                      <Link to="/contact">{t("Контакты")}</Link>
                    </li>
                    <li>
                      <Link to="/contact" onClick={() => setShowMenu(false)}>
                        {t("Оплата и доставка")}
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/policy" onClick={() => setShowMenu(false)}>
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
                    <li>
                      <a
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
                        <img src={AppStore} alt="App Store" height="50" />
                      </a>
                    </li>
                  ) : /Android/i.test(navigator.userAgent) ? (
                    <li className="list-unstyled d-flex justify-content-center">
                      <a
                        href={
                          "https://play.google.com/store/apps/details?id=" +
                          (options.app?.nameAndroid?.length > 0
                            ? options.app.nameAndroid
                            : options.app.name)
                        }
                      >
                        <img src={GooglePlay} alt="Google Play" height="50" />
                      </a>
                    </li>
                  ) : (
                    <div className="list-unstyled d-flex justify-content-center">
                      {options.app?.accountApple && options.app?.titleIos && (
                        <li>
                          <a
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
                            <img src={AppStore} alt="App Store" height="35" />
                          </a>
                        </li>
                      )}
                      <li className="ms-2">
                        <a
                          href={
                            "https://play.google.com/store/apps/details?id=" +
                            (options.app?.nameAndroid?.length > 0
                              ? options.app.nameAndroid
                              : options.app.name)
                          }
                        >
                          <img src={GooglePlay} alt="Google Play" height="35" />
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

      <Modal
        size="lg"
        centered
        backdrop={city?.title ? true : "static"}
        keyboard={!!city?.title}
        className="city"
        show={showCity}
        onHide={() => setShowCity(false)}
      >
        <Modal.Body className="p-4">
          <img
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
                                  {e?.options?.alias ?? e.title}
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
                    <>
                      {item?.country && (
                        <h6 className="fw-7 p-2">{item.country}</h6>
                      )}
                      {item?.cities?.length > 0 && (
                        <div className="cities">
                          {Object.entries(
                            item.cities
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
                                  <Col
                                    md={12}
                                    key={index}
                                    className="pb-2 ps-3"
                                  >
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
                                        e.options?.alias ===
                                          city?.options?.alias
                                          ? " active"
                                          : "")
                                      }
                                    >
                                      {e?.options?.alias ?? e.title}
                                    </a>
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ))}
            </div>
            <div className="box-shadow-bottom"></div>
          </div>
        </Modal.Body>
      </Modal>
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
      <ScrollToTop count={count} />
    </>
  );
});

export default Header;
