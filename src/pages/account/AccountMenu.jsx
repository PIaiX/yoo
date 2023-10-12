import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  HiOutlineArrowRightOnRectangle,
  HiOutlineHeart,
  // HiOutlineStar,
  // HiOutlineCreditCard,
  // HiOutlineBellAlert,
  // HiOutlineBolt,
  // HiOutlineLifebuoy,
} from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { logout } from "../../services/auth";

const AccountMenu = (props) => {
  const dispatch = useDispatch();
  const navigaion = useNavigate();

  return (
    <nav className="account-nav">
      <ul>
        <li>
          <NavLink to="orders">
            <HiOutlineShoppingBag />
            <div>Заказы</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="addresses">
            <HiOutlineMapPin />
            <div>Адреса</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="favorites">
            <HiOutlineHeart />
            <div>Избранное</div>
          </NavLink>
        </li>
        <li>
          <a
            onClick={() => {
              dispatch(logout());
              navigaion("/login");
            }}
          >
            <HiOutlineArrowRightOnRectangle />
            <div>Выйти</div>
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
