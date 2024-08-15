import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  HiOutlineCog8Tooth,
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../services/auth";
import { useTranslation } from "react-i18next";

const AccountMenu = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigaion = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="account-menu">
      <div className="box p-3 p-sm-3 d-flex align-items-center mb-2 mb-sm-2">
        <div className="icon">
          <span>
            {user.firstName ? user.firstName.slice(0, 1).toUpperCase() : "A"}
          </span>
        </div>
        <div className="flex-1">
          <h6>{t(user.firstName)}</h6>
          {/* <p>
            <a href="tel:+79198563658">+7 919 856-36-58</a>
          </p> */}
        </div>
        <Link to="settings" className="btn-settings">
          <HiOutlineCog8Tooth />
        </Link>
      </div>
      <ul className="list-unstyled row row-cols-3 gx-2 gx-sm-2 gx-md-2 mb-2">
        <li>
          <div className="box main-color text-center p-2 p-sm-2 h-100">
            <span className="fs-18">{user.point}</span>&nbsp;
            <span className="fw-6 fs-18">Б</span>
          </div>
        </li>
        <li>
          <NavLink
            to="orders"
            className="box-blue d-flex flex-column align-items-center justify-content-center p-2 p-sm-2 h-100"
          >
            <HiOutlineShoppingBag className="main-color fs-18 mb-1 mb-sm-2" />
            <div className="main-color fw-6">{t("Заказы")}</div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="addresses"
            className="box-blue d-flex flex-column align-items-center justify-content-center p-2 p-sm-2 h-100"
          >
            <HiOutlineMapPin className="main-color fs-18 mb-1 mb-sm-2" />
            <div className="main-color fw-6">{t("Адреса")}</div>
          </NavLink>
        </li>
      </ul>
      <a
        className="box-blue d-flex flex-column align-items-center justify-content-center p-2 p-sm-2 h-100 mb-2"
        onClick={() => {
          dispatch(logout());
          navigaion("/login");
        }}
      >
        <HiOutlineArrowRightOnRectangle className="main-color fs-18 mb-1 mb-sm-2" />
        <div className="main-color fw-6">{t("Выйти")}</div>
      </a>
      {/* <div className="gradient-block mb-3"></div> */}
      {/* <nav className="mb-3">
        <ul>
          <li>
            <NavLink to="notifications">
              <HiOutlineBellAlert />
              <div>Уведомления</div>
            </NavLink>
          </li>
          <li>
            <NavLink to="offers">
              <HiOutlineBolt />
              <div>Акции и промокоды</div>
            </NavLink>
          </li>
          <li>
            <NavLink to="bonus">
              <HiOutlineStar />
              <div>Бонусная программа</div>
            </NavLink>
          </li>
          <li>
            <NavLink to="payment">
              <HiOutlineCreditCard />
              <div>Способы оплаты</div>
            </NavLink>
          </li>
        </ul>
      </nav> */}
      {/* <Link to="support" className="btn-orange fs-12 w-100 rounded-3">
        <HiOutlineLifebuoy className="fs-15 me-2" />
        <div>Тех. подержка</div>
      </Link> */}
    </div>
  );
};

export default AccountMenu;
