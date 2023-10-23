import React, { memo, useState } from "react";
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
import { IoCall, IoCloseOutline, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCount, getImageURL } from "../helpers/all";
import { editDeliveryCheckout } from "../store/reducers/checkoutSlice";
import Select from "./utils/Select";
import ScrollToTop from "./ScrollToTop";
import AppDownload from "./svgs/AppDownload";
import Phone from "../assets/imgs/phone.png";
import AppStore from "../assets/imgs/appstore-black.svg";
import GooglePlay from "../assets/imgs/googleplay-black.svg";
import { useGetBannersQuery } from "../services/home";

import Logo from '../assets/imgs/LogoBeautifulDay.svg';
// icons
import YooApp from './svgs/YooApp';
import Loupe from './svgs/Loupe';
import CartIcon from './svgs/CartIcon';
import Heart from './svgs/Heart';
import CrossIcon from './svgs/CrossIcon';
import MenuIcon from './svgs/MenuIcon';
import MenuPhone from './svgs/MenuPhone';
import MenuDelivery from './svgs/MenuDelivery';
import MenuVacancies from './svgs/MenuVacancies';
import MenuDocs from './svgs/MenuDocs';
import MenuBlog from './svgs/MenuBlog';
import MenuOffers from './svgs/MenuOffers';

const Header = memo(() => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const favorite = useSelector((state) => state.favorite.items);
  const delivery = useSelector((state) => state.checkout.delivery);
  const affiliate = useSelector((state) => state.affiliate.items);
  const options = useSelector((state) => state.settings.options);
  const banners = useGetBannersQuery();

  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [isContacts, setIsContacts] = useState(false);
  const count = getCount(cart);

  const mainAffiliate =
    affiliate?.length > 0 ? affiliate.find((e) => e.main) : false;

  return (
    <>
      <header>
        <Container className="full h-100">
          <nav className="h-100">
            <Link to="/">
              <img
                src="/logo.png"
                alt={options?.title ?? "YOOAPP"}
                className="logo"
              />

            </Link>

            <ul className="d-none d-lg-flex">
              <li>
                <Link to='/categories' className='btn-primary'>Каталог</Link>
              </li>
              <li>
                <Link to='/'>Новинки</Link>
              </li>
              <li>
                <Link to='/promo'>Акции</Link>
              </li>
            </ul>
            <form action="" className='formSearch'>
              <input type="search" />
              <Link to='/search'>
                <Loupe/>
              </Link>
              {/* <button type='submit'>
                <Loupe/>
              </button> */}
            </form>
            {mainAffiliate && mainAffiliate?.phone[0] && (
              <a href={"tel:" + mainAffiliate.phone[0]} className="phone">
                {mainAffiliate.phone[0]}
              </a>
            )}

            <ul>
              <li className="d-none d-lg-block">
                <Link to="/cart" className='btn-icon'>
                  <CartIcon />
                  {count > 0 && (
                    <span className="badge">
                      {count}
                    </span>
                  )}
                </Link>
              </li>
              {isAuth && (
                <li className="d-none d-lg-block">
                  <Link to="/account/favorites" className='btn-icon'>
                    <Heart />
                    {favorite?.length > 0 && (
                      <span className="badge">
                        {favorite?.length}
                      </span>
                    )}
                  </Link>
                </li>
              )}
              <li className='btn-primary d-none d-lg-block'>
                <Link
                  to={
                    isAuth
                      ? user?.status === 0
                        ? "/activate"
                        : "/account"
                      : "/login"
                  }
                >
                  Войти
                </Link>
              </li>
              <li className="d-lg-none">
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="btn-menu"
                >
                  {showMenu ? <CrossIcon /> : <MenuIcon />}
                </button>
              </li>
            </ul>
          </nav>
        </Container>
      </header>

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
                <img
                  src="/imgs/img.jpg"
                  alt="Beautiful Day"
                  className="menu-offer"
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
                      <Link to="/delivery" onClick={() => setShowMenu(false)}>
                        <MenuDelivery />
                        <span>Оплата и доставка</span>
                      </Link>
                    </li>
                   <li>

                    <Link to='/'>
                      <MenuBlog/>
                      <span>Новости</span>
                    </Link>
                  </li>
                  <li>
                    <Link to='/promo'>
                      <MenuOffers/>
                      <span>Акции</span>
                    </Link>
                  </li>
                  <li>
                      <Link to="/">
                        <MenuVacancies />
                        <span>Вакансии</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/">
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
      <ScrollToTop count={count} />
    </>
  );
});

export default Header;
