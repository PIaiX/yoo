import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  HiOutlineArrowRightOnRectangle,
  HiOutlineHeart,
} from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { logout } from "../../services/auth";
import { useTranslation } from "react-i18next";

const AccountMenu = () => {
  const dispatch = useDispatch();
  const navigaion = useNavigate();
  const { t } = useTranslation();

  return (
    <nav className="account-nav">
      <ul>
        <li>
          <NavLink to="orders">
            <HiOutlineShoppingBag />
            <div>{t("Заказы")}</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="addresses">
            <HiOutlineMapPin />
            <div>{t("Адреса")}</div>
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="favorites">
            <HiOutlineHeart />
            <div>{t('Избранное')}</div>
          </NavLink>
        </li> */}
        <li>
          <a
            onClick={() => {
              dispatch(logout());
              navigaion("/login");
            }}
          >
            <HiOutlineArrowRightOnRectangle />
            <div>{t("Выйти")}</div>
          </a>
        </li>
        {/* <li>
          <NavLink to="bonus">
            <HiOutlineStar/>
            <div>Бонусная программа</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="payment">
            <HiOutlineCreditCard/>
            <div>Способы оплаты</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="support">
            <HiOutlineLifebuoy/>
            <div>Тех. подержка</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="notifications">
            <HiOutlineBellAlert/>
            <div>Уведомления</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="offers">
            <HiOutlineBolt/>
            <div>Акции и промокоды</div>
          </NavLink>
        </li> */}
      </ul>
    </nav>
  );
};

export default AccountMenu;
