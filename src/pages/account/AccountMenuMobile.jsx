import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RxDotFilled } from "react-icons/rx";
import Gear from '../../components/svgs/Gear';
import CartIcon from '../../components/svgs/CartIcon';
import AddressPin from '../../components/svgs/AddressPin';
import Support from '../../components/svgs/Support';

const AccountMenu = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className='account-menu'>
      <div className="box p-3 p-sm-4 d-flex align-items-center mb-2 mb-sm-3">
        <div className="icon">
          <span>A</span>
        </div>
        <div className='flex-1'>
          <h6>Алексей</h6>
          <p><a href="tel:+79198563658">+7 919 856-36-58</a></p>
        </div>
        <Link to='settings' className='btn-settings'>
          <HiOutlineCog8Tooth/>
        </Link>
      </div>
      <ul className="list-unstyled row row-cols-3 gx-2 gx-sm-3 gx-md-4 mb-3">
        <li>
          <div className="box main-color text-center p-2 p-sm-3 h-100">
            <div className='fs-18 mb-sm-1'>1002</div>
            <div className='fw-6'>Бонуса</div>
          </div>
        </li>
        <li>
          <NavLink to="orders" className="box-blue d-flex flex-column align-items-center justify-content-center p-2 p-sm-3 h-100">
            <HiOutlineShoppingBag className='main-color fs-18 mb-1 mb-sm-2'/>
            <div className='main-color fw-6'>Заказы</div>
          </NavLink>
        </li>
        <li>
          <NavLink to="addresses" className="box-blue d-flex flex-column align-items-center justify-content-center p-2 p-sm-3 h-100">
            <HiOutlineMapPin className='main-color fs-18 mb-1 mb-sm-2'/>
            <div className='main-color fw-6'>Адреса</div>
          </NavLink>
        </li>
      </ul>
      <div className="gradient-block mb-3"></div>
      {/* <nav className="mb-3">
        <ul>
          <li>
            <NavLink to="favorites">
              <div>Избранное </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="notifications">
              <HiOutlineBellAlert/>
              <div>Уведомления</div>
              <span className='badge'>2</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="offers">
              <HiOutlineBolt/>
              <div>Акции и промокоды</div>
            </NavLink>
          </li>
          <li>
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
