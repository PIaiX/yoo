import axios from "axios";
import React, { memo, useEffect, useState, useTransition } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  HiOutlineArrowLeftCircle,
  HiOutlineDevicePhoneMobile,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoCall, IoClose, IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AppStore from "../assets/imgs/appstore-black.svg";
import GooglePlay from "../assets/imgs/googleplay-black.svg";
import Phone from "../assets/imgs/phone.png";
import { DADATA_TOKEN, DADATA_URL_GEO } from "../config/api";
import { getCount, getImageURL } from "../helpers/all";
import { useGetBannersQuery } from "../services/home";
import { setUser } from "../store/reducers/authSlice";
import { editDeliveryCheckout } from "../store/reducers/checkoutSlice";
import DeliveryBar from "./DeliveryBar";
import ScrollToTop from "./ScrollToTop";
import AppDownload from "./svgs/AppDownload";
import MenuDelivery from "./svgs/MenuDelivery";
import MenuDocs from "./svgs/MenuDocs";
import MenuIcon from "./svgs/MenuIcon";
import MenuPhone from "./svgs/MenuPhone";
import YooApp from "./svgs/YooApp";
import Input from "./utils/Input";
import Select from "./utils/Select";

const Header = memo(() => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const favorite = useSelector((state) => state.favorite.items);
  const affiliate = useSelector((state) => state.affiliate.items);
  const options = useSelector((state) => state.settings.options);
  const delivery = useSelector((state) => state.checkout.delivery);
  const banners = useGetBannersQuery();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [isContacts, setIsContacts] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const count = getCount(cart);
  const [list, setList] = useState([]);

  const defaultCityOptions = user?.options ?? null;
  const mainAffiliate =
    affiliate?.length > 0
      ? defaultCityOptions?.city && defaultCityOptions?.citySave
        ? affiliate.find(
            (e) =>
              e.options.city.toLowerCase() ===
              defaultCityOptions.city.toLowerCase()
          )
        : affiliate.find((e) => e.main)
      : false;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value) => {
    setSearchInput(value);
    startTransition(() => {
      let searchList = [];
      Object.values(list).forEach((e) => {
        e.forEach(
          (e2) =>
            e2.options.city.toLowerCase().includes(value.toLowerCase()) &&
            searchList.push(e2)
        );
      });
      setSearch(searchList);
    });
  };

  useEffect(() => {
    if (affiliate?.length > 0) {
      var data = [];

      affiliate.forEach((e) => {
        let country = e.options.country.toLowerCase();
        if (!data[country]) {
          data[country] = [e];
        } else {
          let isCity = data[country].find(
            (item) =>
              item.options.city.toLowerCase() === e.options.city.toLowerCase()
          );
          if (!isCity) {
            data[country].push(e);
          }
        }
      });

      data.sort(function (a, b) {
        if (a.options.city.toLowerCase() < b.options.city.toLowerCase()) {
          return -1;
        }
        if (a.options.city.toLowerCase() > b.options.city.toLowerCase()) {
          return 1;
        }
        return 0;
      });

      setList(data);
    }
    if (
      affiliate?.length > 1 &&
      !defaultCityOptions?.city &&
      "geolocation" in navigator
    ) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        if (
          position?.coords?.latitude &&
          position?.coords?.longitude &&
          DADATA_TOKEN &&
          DADATA_URL_GEO
        ) {
          let geo = await axios.post(
            DADATA_URL_GEO,
            JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }),
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Token " + DADATA_TOKEN,
              },
            }
          );
          if (
            geo?.data?.suggestions &&
            geo?.data?.suggestions[0]?.data?.city &&
            affiliate?.length > 0
          ) {
            let city = affiliate.find(
              (e) =>
                e.options.city.toLowerCase() ===
                geo.data.suggestions[0].data.city.toLowerCase()
            );
            if (city) {
              dispatch(
                setUser({
                  ...user,
                  options: {
                    ...user.options,
                    city: city.options.city,
                  },
                })
              );
            }
          }
        }
      });
    }
  }, []);

  return (
    <>
      <header>
        <Container className="h-100">
          <nav className="h-100">
            <div className="d-flex align-items-center">
              <Link to="/" className="me-3 me-lg-5">
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
                  className="logo"
                />
                {/* <span className="ms-3 logo-name">
                {options?.title ?? "YOOAPP"}
              </span> */}
              </Link>
              <ul className="text-menu">
                <li>
                  {affiliate.length > 0 && (
                    <a
                      onClick={() => affiliate?.length > 1 && setShowCity(true)}
                      className="fw-6"
                    >
                      {affiliate?.length > 1
                        ? defaultCityOptions?.city ??
                          mainAffiliate?.options?.city ??
                          "Выберите город"
                        : mainAffiliate?.options?.city ?? ""}
                    </a>
                  )}
                  {!defaultCityOptions?.citySave &&
                    defaultCityOptions?.city && (
                      <div className="no-city">
                        <p className="mb-3">
                          Ваш город <b>{defaultCityOptions.city}</b> город?
                        </p>
                        <div className="d-flex align-items-center justify-content-center">
                          <Link
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => {
                              dispatch(
                                setUser({
                                  ...user,
                                  options: {
                                    ...user.options,
                                    citySave: true,
                                  },
                                })
                              );
                            }}
                          >
                            Да
                          </Link>
                          <Link
                            className="btn btn-sm btn-light"
                            onClick={() => setShowCity(true)}
                          >
                            Нет
                          </Link>
                        </div>
                      </div>
                    )}
                </li>
                <li className="d-none d-sm-inline-flex">
                  <Select
                    className="fw-5"
                    data={[
                      {
                        value: "delivery",
                        title: "Доставка",
                      },
                      {
                        value: "pickup",
                        title: "Самовывоз",
                      },
                    ]}
                    value={delivery}
                    onClick={(e) => dispatch(editDeliveryCheckout(e.value))}
                  />
                </li>
              </ul>
            </div>
            <ul className="text-menu d-none d-lg-flex">
              {options?.menu?.length > 0 ? (
                options.menu.map(
                  (e) =>
                    e?.status && (
                      <li>
                        <Link
                          to={e?.link ?? e.page}
                          // className={e.type == "dark" ? "btn-primary" : ""}
                          className="fw-6"
                        >
                          {e.title}
                        </Link>
                      </li>
                    )
                )
              ) : (
                <>
                  {/* <li>
                    <Link to="/categories" className="fw-6">
                      Меню
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="fw-6">
                      Доставка и оплата
                    </Link>
                  </li> */}
                  <li>
                    <Link to="/contact" className="fw-6">
                      Контакты
                    </Link>
                  </li>
                  <li>
                    <Link to="/promo" className="fw-6">
                      Акции
                    </Link>
                  </li>
                </>
              )}
            </ul>
            {mainAffiliate &&
              mainAffiliate?.options?.phone &&
              mainAffiliate?.options?.phone[0] && (
                <a
                  href={"tel:" + mainAffiliate.options.phone[0]}
                  className="phone"
                >
                  <HiOutlineDevicePhoneMobile className="fs-12" />
                  <span className="ms-1">{mainAffiliate.options.phone[0]}</span>
                </a>
              )}

            <ul className="icons-menu">
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
              {isAuth && (
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
              )}
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

      <DeliveryBar sum={2500} />

      <Offcanvas
        className="offcanvas-menu"
        show={showMenu}
        onHide={() => setShowMenu(false)}
        placement={"end"}
      >
        <Offcanvas.Body>
          <Container className="h-100">
            {isContacts ? (
              <div className="h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex mb-4">
                    <button
                      type="button"
                      onClick={() => setIsContacts(false)}
                      className="main-color-60 fs-12 d-flex align-items-center"
                    >
                      <HiOutlineArrowLeftCircle className="fs-14" />
                      <span className="ms-1">Назад</span>
                    </button>
                    <h5 className="flex-1 text-center fs-12 fw-6 mb-0 me-5">
                      Контакты
                    </h5>
                  </div>
                  <h5 className="fs-12 fw-6 mb-4">
                    ООО “Вкусные решения”, г. Казань
                  </h5>
                  <div className="box fs-12">
                    <ul className="list-unstyled">
                      <li className="mb-4">
                        <h6 className="mb-2">Авиастроительный</h6>
                        <address className="mb-2">
                          <span className="main-color">•</span> ул. Белинского,
                          1
                        </address>
                        <p className="main-color mt-2">Доставка и самовывоз</p>
                        <p>08:00 — 00:00</p>
                        <p className="main-color mt-2">Ресторан</p>
                        <p>08:00 — 00:00</p>
                      </li>
                    </ul>
                    <button type="button" className="btn-green rounded w-100">
                      Посмотреть на карте
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="fs-12 btn-6 w-100 rounded justify-content-start mt-3"
                  >
                    <IoCall className="fs-15 me-2" />
                    <span>Позвонить</span>
                  </button>
                  <button
                    type="button"
                    className="fs-12 btn-secondary w-100 rounded justify-content-start mt-2"
                  >
                    <IoLogoWhatsapp className="fs-15 me-2" />
                    <span>Написать в WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {banners?.data?.items?.length > 0 && (
                  <img
                    src={getImageURL({
                      path: banners.data.items[0].medias,
                      type: "banner",
                      size: "full",
                    })}
                    alt="Большие пиццы"
                    className="menu-offer"
                  />
                )}
                <Select
                  className="my-3"
                  data={[
                    {
                      value: "delivery",
                      title: "Доставка",
                    },
                    {
                      value: "pickup",
                      title: "Самовывоз",
                    },
                  ]}
                  value={delivery}
                  onClick={(e) => dispatch(editDeliveryCheckout(e.value))}
                />
                <nav>
                  <ul>
                    <li>
                      <Link to="/contact" onClick={() => setShowMenu(false)}>
                        <MenuPhone />
                        <span>Контакты</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" onClick={() => setShowMenu(false)}>
                        <MenuDelivery />
                        <span>Оплата и доставка</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/policy" onClick={() => setShowMenu(false)}>
                        <MenuDocs />
                        <span>Политика конфиденциальности</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
                <a href="https://yooapp.ru/" target="_blank">
                  <p className="gray text-center mt-4 mt-md-5">
                    Разработано на платформе
                  </p>
                  <p className="text-center mt-2">
                    <YooApp />
                  </p>
                </a>
              </>
            )}
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
      {options?.appYes && (
        <button
          type="button"
          className="appOffer"
          onClick={() => setShowApp(true)}
        >
          <AppDownload />
        </button>
      )}

      <Offcanvas
        className="offcanvas-app"
        show={showApp}
        onHide={() => setShowApp(false)}
        placement={"top"}
      >
        <Offcanvas.Body>
          <Container className="h-100">
            <section className="sec-4 row">
              <div className="col-12 col-md-7">
                <h3>
                  Заказывать стало <br className="d-lg-none" />
                  ещё&nbsp;удобнее!
                </h3>
                <div className="d-flex align-items-center mb-3 mb-lg-4">
                  <button
                    type="button"
                    className="btn-2 fs-20 py-2 px-3 px-lg-4 me-2 me-md-3"
                  >
                    <span className="d-lg-none">—</span>
                    <span className="d-none d-lg-inline">скидка</span>
                    <span> 15%</span>
                  </button>
                  <p className="fs-16">
                    на&nbsp;первый заказ <br />
                    через&nbsp;приложение
                  </p>
                </div>
                <ul className="logotips mb-3 mb-lg-5">
                  <li>
                    <a href="/">
                      <img src={AppStore} alt="App Store" />
                    </a>
                  </li>
                  <li>
                    <a href="/">
                      <img src={GooglePlay} alt="Google Play" />
                    </a>
                  </li>
                </ul>
                <p>Акция действует при заказе на сумму от 1 000 ₽</p>
              </div>
              <div className="d-none d-md-block col-5">
                <img src={Phone} alt="Phone" className="phone" />
              </div>
            </section>
            <button
              type="button"
              onClick={() => setShowApp(false)}
              className="offcanvas-app-close"
            >
              <IoClose />
            </button>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
      <Modal
        size="lg"
        centered
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

          <button
            type="button"
            className="btn-close close"
            aria-label="Close"
            onClick={() => setShowCity(false)}
          ></button>
          <div>
            <Input
              name="search"
              type="search"
              placeholder="Поиск..."
              className="mb-3"
              onChange={handleChange}
              value={searchInput}
            />
          </div>
          <div className="search-box">
            {searchInput.length > 0 && search && search?.length > 0 ? (
              <Row>
                {search.map((e, index) => (
                  <Col md={4} key={index} className="pb-3">
                    <a
                      onClick={() => {
                        dispatch(
                          setUser({
                            ...user,
                            options: {
                              ...user.options,
                              citySave: true,
                              city: e.options.city,
                            },
                          })
                        );
                        setShowCity(false);
                      }}
                      className={
                        "p-2 fw-6" +
                        (e.options.city === defaultCityOptions?.city
                          ? " active"
                          : "")
                      }
                    >
                      {e.options.city}
                    </a>
                  </Col>
                ))}
              </Row>
            ) : (
              Object.keys(list)?.length > 0 &&
              Object.keys(list).map((title) => (
                <>
                  <h6 className="fw-7 p-2">
                    {title[0].toUpperCase() + title.slice(1)}
                  </h6>
                  {list[title]?.length > 0 && (
                    <Row>
                      {list[title].map((e, index) => (
                        <Col md={4} key={index} className="pb-3">
                          <a
                            onClick={() => {
                              dispatch(
                                setUser({
                                  ...user,
                                  options: {
                                    ...user.options,
                                    citySave: true,
                                    city: e.options.city,
                                  },
                                })
                              );
                              setShowCity(false);
                            }}
                            className={
                              "p-2 fw-6" +
                              (e.options.city === defaultCityOptions?.city
                                ? " active"
                                : "")
                            }
                          >
                            {e.options.city}
                          </a>
                        </Col>
                      ))}
                    </Row>
                  )}
                </>
              ))
            )}
          </div>
        </Modal.Body>
      </Modal>
      <ScrollToTop count={count} />
    </>
  );
});

export default Header;
