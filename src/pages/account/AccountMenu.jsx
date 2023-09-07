import React from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  // HiOutlineStar,
  // HiOutlineCreditCard,
  // HiOutlineBellAlert,
  // HiOutlineBolt,
  // HiOutlineLifebuoy,
} from "react-icons/hi2";

const AccountMenu = (props) => {
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
