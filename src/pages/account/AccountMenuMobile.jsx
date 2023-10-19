import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RxDotFilled } from "react-icons/rx";
import Gear from '../../components/svgs/Gear';
import CartIcon from '../../components/svgs/CartIcon';
import AddressPin from '../../components/svgs/AddressPin';
import Support from '../../components/svgs/Support';

const AccountMenu = (props) => {
  return (
    <div className='account-menu'>
      <div className="box p-3 w-100 h-100 d-flex align-items-center mb-2 mb-sm-3">
        <div className='flex-1'>
          <div>
            <span>Элли</span> 
            <RxDotFilled className='primary'/>
            <a href="tel:+79198563658">+7 919 856-36-58</a>
          </div>
          <p className="dark-gray mt-2"><a href="mailto:GreatOZ@mail.com">GreatOZ@mail.com</a></p>
        </div>
        <Link to='/account/settings' className='btn-gray'>
          <Gear className="fs-15"/>
        </Link>
      </div>
      <ul className='list-unstyled row row-cols-3 gx-2 gx-sm-3 gx-md-4 mb-3'>
        <li>
          <div className="box secondary text-center p-2 p-sm-3 h-100">
            <div className='fs-18 mb-sm-1'>1002</div>
            <div className='fw-5'>Бонуса</div>
          </div>
        </li>
        <li>
          <NavLink to="orders" className="box-blue d-flex flex-column align-items-center justify-content-center p-2 p-sm-3 h-100">
            <CartIcon className='secondary fs-18 mb-1 mb-sm-2'/>
            <div className='secondary fw-5'>Заказы</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="addresses" className="box-blue d-flex flex-column align-items-center justify-content-center p-2 p-sm-3 h-100">
            <AddressPin className='secondary fs-18 mb-1 mb-sm-2'/>
            <div className='secondary fw-5'>Адреса</div>
          </NavLink>
        </li>
      </ul>
      <div className="gradient-block mb-3"></div>
      <nav className='mb-3'>
        <ul>
          <li>
            <NavLink to="favorites">
              <div>Избранное </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="notifications">
              <div>Уведомления</div>
              <span className='badge'>2</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="offers">
              <div>Акции и промокоды</div>
            </NavLink>
          </li>
          <li>
            <NavLink to="bonus">
              <div>Бонусная программа</div>
            </NavLink>
          </li>
          <li>
            <NavLink to="payment">
              <div>Способы оплаты</div>
            </NavLink>
          </li>
        </ul>
      </nav>
      <Link to="support" className='btn-secondary fs-12 w-100 rounded-3'>
        <Support className='fs-15 me-2'/>
        <div>Тех. подержка</div>
      </Link>
    </div>
  );
};

export default AccountMenu;