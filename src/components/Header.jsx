import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import useIsMobile from "../hooks/isMobile";
import SelectImitation from "./utils/SelectImitation";
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineUserCircle,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineArrowLeftCircle,
} from "react-icons/hi2";
import Logo from "../assets/imgs/logo.svg";
import delivery from "../assets/imgs/delivery_icon.svg";
import ruFlag from "../assets/imgs/flags/rus.jpg";
import engFlag from "../assets/imgs/flags/eng.jpg";
import MenuIcon from "./svgs/MenuIcon";
import MenuPhone from "./svgs/MenuPhone";
import MenuDelivery from "./svgs/MenuDelivery";
import MenuVacancies from "./svgs/MenuVacancies";
import MenuDocs from "./svgs/MenuDocs";
import { IoCloseOutline, IoCall } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";
import YooApp from "./svgs/YooApp";
import { useSelector } from "react-redux";
import { memo } from "react";
import { getCount } from "../helpers/all";

const Header = memo(() => {
  const { cart, auth } = useSelector((state) => state);
  const isMobileLG = useIsMobile("991px");
  const [showMenu, setShowMenu] = useState(false);
  const [isContacts, setIsContacts] = useState(false);
  const count = getCount(cart.items);

  return (
    <>
      <header>
        <Container className="h-100">
          <nav className="h-100">
            <Link to="/">
              <img src={Logo} alt="yoo.app" className="logo" />
            </Link>
            {!isMobileLG && (
              <>
                <ul className="btns-menu">
                  <li className="d-none d-xxl-block">
                    <SelectImitation
                      optionsArr={[
                        {
                          value: 1,
                          label: "Доставка",
                          icon: delivery,
                          defaultChecked: true,
                        },
                        {
                          value: 2,
                          label: "Самовывоз",
                          icon: delivery,
                          defaultChecked: false,
                        },
                      ]}
                    />
                  </li>
                  <li className="ms-3">
                    <Link to="/menu" className="btn-primary py-2">
                      Меню
                    </Link>
                  </li>
                </ul>
                <ul className="text-menu">
                  <li>
                    <Link to="/">Доставка и оплата</Link>
                  </li>
                  <li>
                    <Link to="/">О нас</Link>
                  </li>
                </ul>
                <a href="tel:+7987987-78-78" className="phone">
                  <HiOutlineDevicePhoneMobile className="fs-15" />
                  <span className="fs-11 ms-2">+7 987 987-78-78</span>
                </a>
              </>
            )}

            <ul className="icons-menu">
              <li>
                <SelectImitation
                  btnClass={"borderless"}
                  imgClass={"round"}
                  optionsArr={[
                    {
                      value: 1,
                      label: "русский",
                      icon: ruFlag,
                      defaultChecked: true,
                    },
                    {
                      value: 2,
                      label: "english",
                      icon: engFlag,
                      defaultChecked: false,
                    },
                  ]}
                />
              </li>
              {!isMobileLG ? (
                <>
                  <li>
                    <Link to={auth.isAuth ? "/account" : "/login"}>
                      <HiOutlineUserCircle />
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className="position-relative">
                      <HiOutlineShoppingBag />
                      {count > 0 && (
                        <span className="position-absolute top-100 start-100 translate-middle badge rounded-pill">
                          {count}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link to="/">
                      <HiOutlineHeart />
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="btn-menu"
                  >
                    {showMenu ? <IoCloseOutline /> : <MenuIcon />}
                  </button>
                </li>
              )}
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
                  src="imgs/slider-main/slide-1.jpg"
                  alt="Большие пиццы"
                  className="menu-offer"
                />
                <nav>
                  <ul>
                    <li>
                      <button type="button" onClick={() => setIsContacts(true)}>
                        <MenuPhone />
                        <span>Контакты</span>
                      </button>
                    </li>
                    <li>
                      <Link to="/">
                        <MenuDelivery />
                        <span>Оплата и доставка</span>
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

                <p className="gray text-center mt-4 mt-md-5">
                  Разработано на платформе
                </p>
                <p className="text-center mt-2">
                  <YooApp />
                </p>
              </>
            )}
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
});

export default Header;
