import React from 'react';
import OrderCard from '../../components/OrderCard';
import useIsMobile from '../../hooks/isMobile';
import NavPagination from '../../components/NavPagination';
import AccountTitleReturn from '../../components/AccountTitleReturn';

const Orders = () => {
  const isMobileLG = useIsMobile('991px');

  return (
    <section className='sec-orders'>
      {
        (isMobileLG)
        ? <AccountTitleReturn link={'/account'} title={'Заказы'}/>
        : <div className="order-card top">
          <div className='order-card-num'>№</div>
          <div className='order-card-time'>Время заказа</div>
          <div className='order-card-status'>Статус</div>
          <div className='order-card-delivery'>Способ доставки</div>
          <div className='order-card-price'>Стоимость</div>
          <div className='order-card-btn'></div>
        </div>
      }
      
      <ul className='row row-cols-1 row-cols-sm-2 row-cols-lg-1 gy-3 gx-2 g-md-4 g-lg-0'>
        <li><OrderCard/></li>
        <li><OrderCard/></li>
        <li><OrderCard/></li>
        <li><OrderCard/></li>
      </ul>
      
      <div className="p-3">
        <NavPagination/>
      </div>
    </section>
  );
};

export default Orders;