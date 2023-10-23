
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
import CartIcon from '../../components/svgs/CartIcon';
import AddressPin from '../../components/svgs/AddressPin';
import Star from '../../components/svgs/Star';
import Support from '../../components/svgs/Support';
import Bell from '../../components/svgs/Bell';
import Promo from '../../components/svgs/Promo';
import CardIcon from '../../components/svgs/CardIcon';


const AccountMenu = (props) => {
  const dispatch = useDispatch();
  const navigaion = useNavigate();

  return (
    <nav className="account-nav">
      <ul>
        <li>
          <NavLink to="orders">
            <CartIcon/>
            <div>Заказы</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="addresses">
            <AddressPin/>
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
            <Star/>
            <div>Бонусы</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="payment">
            <CardIcon/>
            <div>Способы оплаты</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="support">
            <Support/>
            <div>Тех.&nbsp;подержка</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="notifications">
            <Bell/>
            <div>Уведомления</div>
            <span className='badge'>12</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="offers">
            <Promo/>
            <div>Акции</div>
          </NavLink>
        </li> */}
      </ul>
    </nav>
  );
};

export default AccountMenu;
