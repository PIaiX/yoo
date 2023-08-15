import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from 'react-router-dom';
import NavTop from '../components/utils/NavTop';
import Gifts from '../components/utils/Gifts';
import { HiOutlineTrash, HiXMark } from "react-icons/hi2";
import CartItem from '../components/CartItem';

const Cart = () => {
  return (
    <main>
      <Container>
        <NavTop toBack={true} breadcrumbs={false}/>
        <form className='cart'>
          <Row className='g-4 g-xxl-5'>
            <Col xs={12} lg={8}>
              <h1 className='text-center text-lg-start'>Вы добавили 3 товара</h1>
              <div className="cart-filter">
                <label>
                  <input type="checkbox"/>
                  <span className='fs-11 ms-2'>Все <span className='d-none d-sm-inline'>товары</span></span>
                </label>
                <button type='button' className='d-flex align-items-center dark-gray ms-auto'>
                  <HiOutlineTrash className='fs-15 me-1 me-sm-2'/>
                  <span className='d-md-none'>Удалить</span>
                  <span className='d-none d-md-inline fs-11 ms-1'>Удалить выбранные</span>
                </button>
                <button type='button' className='btn-9 py-1 ms-4 ms-sm-5'>Очистить</button>
              </div>

              <ul className='list-unstyled'>
                <li><CartItem/></li>
                <li><CartItem/></li>
                <li><CartItem/></li>
                <li><CartItem/></li>
              </ul>
            </Col>
            <Col xs={12} lg={4}>
              <div className='main-color fs-11 mb-1'>Комментарий</div>
              <textarea rows="3" defaultValue={'Уберите, пожалуйста, лук'} className='mb-4'></textarea>

              <div className='fs-11 mb-1'>Промокод</div>
              <fieldset className='promoCode mb-5'>
                <input type="text" />
                <button type='button' className='btn-primary'>Применить</button>
                <button type='button' className='clear'>
                  <HiXMark/>
                </button>
              </fieldset>

              <div className="d-flex justify-content-between my-2">
                <span>Стоимость товаров</span>
                <span>1 880 ₽</span>
              </div>
              <div className="d-flex justify-content-between my-2">
                <span>Доставка</span>
                <span className='main-color'>бесплатно</span>
              </div>
              <hr className='my-3'/>
              <div className="d-flex justify-content-between mb-5">
                <span className='fw-6 fs-11'>Итоговая сумма</span>
                <span className='fw-6'>1 880 ₽</span>
              </div>

              <Gifts/>

              <div className='bg-main-01 main-color p-2 fw-6 text-center w-100 rounded-3 mt-3'>34 бонуса будут начислены за этот заказ</div>
              <Link to='/checkout' className='btn-secondary mt-3 w-100'>
                <span className='fw-4'>Перейти к оформлению</span>
              </Link>
            </Col>
          </Row>
        </form>
      </Container>
    </main>
  );
};

export default Cart;