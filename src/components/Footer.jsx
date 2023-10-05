import React from 'react';
import Container from 'react-bootstrap/Container';
import useIsMobile from '../hooks/isMobile';
import LogoWhite from '../assets/imgs/LogoBeautifulDayWhite.svg';
import LogoTextWhite from '../assets/imgs/logo-text-white.svg';
import AppStore from '../assets/imgs/appstore.svg';
import GooglePlay from '../assets/imgs/googleplay.svg';
import {Link, NavLink} from 'react-router-dom';
import HomeIcon from './svgs/HomeIcon';
import CatalogIcon from './svgs/CatalogIcon';
import FlameIcon from './svgs/FlameIcon';
import CartIcon from './svgs/CartIcon';
import UserIcon from './svgs/UserIcon';

const Footer = () => {
  const isMobileLG = useIsMobile('991px');

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
                <NavLink to='/login'>
                  <UserIcon/>
                  <div className="text"><span>Аккаунт</span></div>
                </NavLink>
              </li>
            </ul>
          </nav>
          : <div className='desktop'>
            <img src={LogoWhite} alt="yoo.app" className='logo'/>

            <nav className='ms-5 me-auto'>
              <ul className="list-unstyled d-flex">
                <li>
                  <Link to='/'>Каталог</Link>
                </li>
                <li className='ms-4'>
                  <Link to='/'>Оплата и доставка</Link>
                </li>
                <li className='ms-4'>
                  <Link to='/contacts'>Контакты</Link>
                </li>
              </ul>
              <Link to='/' className='d-block mt-3'>Политика конфиденциальности</Link>
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
};

export default Footer;