import React, { memo } from "react";
import Container from "react-bootstrap/Container";
import useIsMobile from '../hooks/isMobile';
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import AppStore from "../assets/imgs/appstore.svg";
import GooglePlay from "../assets/imgs/googleplay.svg";
import LogoTextWhite from "../assets/imgs/logo-text-white.svg";

import { getCount } from "../helpers/all";

import LogoWhite from '../assets/imgs/LogoBeautifulDayWhite.svg';
import BellIcon from "./svgs/BellIcon";

import CartIcon from "./svgs/CartIcon";
import FlameIcon from "./svgs/FlameIcon";
import UserIcon from "./svgs/UserIcon";
import HomeIcon from './svgs/HomeIcon';
import CatalogIcon from './svgs/CatalogIcon';

const Footer = memo(() => {
  const isMobileLG = useIsMobile('991px');
  const isAuth = useSelector((state) => state.auth.isAuth);
  const cart = useSelector((state) => state.cart.items);
  const options = useSelector((state) => state.settings.options);
  const count = getCount(cart);

  return (
    <footer>
      <Container className='h-100'>
        {
          (isMobileLG)
          ? <nav className='h-100 mobile'>
            <ul>
              <li>
                <NavLink to='/'>
                  <HomeIcon/>
                  <div className="text">
                    <span>Главная</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink to='/menu'>
                  <CatalogIcon/>
                  <div className="text"><span>Каталог</span></div>
                </NavLink>
              </li>
              <li>
                <NavLink to='/promo'>
                  <FlameIcon/>
                  <div className="text"><span>Акции</span></div>
                </NavLink>
              </li>
              <li>
                <NavLink to='/cart'>
                  <CartIcon/>
                  <div className="text"><span>Корзина</span></div>
                </NavLink>
              </li>
              <li>
                <NavLink to={isAuth ? "/account" : "/login"}>
                  <UserIcon />
                  <div className="text fs-09">
                    <span>Аккаунт</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </nav>
          : <div className='desktop'>
            <img src={LogoWhite} alt={options?.title ?? "YOOAPP"} className='logo'/>

            <nav>
              <ul className="list-unstyled d-flex">
                <li>
                  <Link to='/'>Меню</Link>
                </li>
                <li className='ms-4'>
                  <Link to='/'>Вакансии</Link>
                </li>
                <li className='ms-4'>
                  <Link to='/contacts'>Контакты</Link>
                </li>
              </ul>
              <Link to='/' className='d-block mt-4'>Политика конфиденциальности</Link>
            </nav>

            <div>
              <div>Разработано на платформе</div>
              <img src={LogoTextWhite} alt="yoo.app" className='d-block mt-2'/>
            </div>
          </div>
        }
      </Container>
    </footer>
  );
});

export default Footer;
