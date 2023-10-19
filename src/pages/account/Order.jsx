import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OrderItem from '../../components/OrderItem';
import { RxDotFilled } from "react-icons/rx";
import AccountTitleReturn from '../../components/AccountTitleReturn';

const Order = () => {
  return (
    <section >
      <AccountTitleReturn link={'/account/orders'} title={'Заказ № 3471'}/>

      <Row>
        <Col lg={8} className='mb-4 mb-lg-0'>
          <ul className='order-list'>
            <li><OrderItem/></li>
            <li><OrderItem/></li>
            <li><OrderItem/></li>
          </ul>
        </Col>
        <Col lg={4}>
          <div className="box">
            <div className="p-2 p-xl-3">
              <p className='fs-09 d-flex align-items-center mb-3'>
                <span>Оформлен</span>
                <span className='dark-gray ms-3'>10:00 12&nbsp;Авг&nbsp;2023</span>
              </p>
              <div class="w-fit bg-success success rounded-3 px-1 mb-3">Готовится</div>
              <div className='order-card-delivery'>
                <span>Самовывоз</span> 
                <RxDotFilled className='primary'/>
              </div>
              <address className='d-block fs-09 dark-gray'>Филиал — ул. Фучика 89, д 1</address>

              <div className="mt-4 mb-1">
                <RxDotFilled className='primary'/>
                <span>Комментарий</span>
              </div>
              <textarea disabled className='fs-09 fw-3' value={'Перезвоните пожалуйста, уточню детали'}></textarea>
              
              <div className="fs-09 d-flex justify-content-between mt-3">
                <p>Стоимость товаров</p>
                <p>20 960 ₽</p>
              </div>
              <div className="fs-09 dark-gray d-flex justify-content-between mt-2">
                <p>Скидка</p>
                <p>199 ₽</p>
              </div>
              <div className="fs-09 d-flex justify-content-between mt-2">
                <p>Доставка</p>
                <p className="secondary">бесплатно</p>
              </div>
            </div>
            <hr className='my-0'/>
            <div className="p-2 px-xl-3 d-flex justify-content-between">
              <p className='fs-11'>Итоговая сумма</p>
              <p>1 880 ₽</p>
            </div>
            <div className='success bg-success p-2 px-xl-3 w-100'>Списано 33 бонуса</div>
            <div className="p-2 px-xl-3">
              <p className="fs-09 secondary">34 бонуса будут начислены за этот заказ</p>
              <button type='submit' disabled className='btn-secondary w-100 mt-2'>Отменить заказ</button>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default Order;