import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from 'react-router-dom';
import NavTop from '../components/utils/NavTop';
import Gifts from '../components/utils/Gifts';
import { HiOutlineTrash, HiXMark } from "react-icons/hi2";
import CartItem from '../components/CartItem';
import ProductCard from '../components/ProductCard';

// swiper
import { Navigation, Thumbs, FreeMode } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Cart = () => {
  return (
    <main>
      <Container>
        <NavTop toBack={true} breadcrumbs={true}/>
        <form className='cart mb-6'>
          <Row className='g-4 g-xxl-5'>
            <Col xs={12} lg={8}>
              <h1 className='text-center text-lg-start'>Вы добавили 3 товара</h1>
              <div className="cart-filter">
                <label>
                  <input type="checkbox"/>
                  <span className='ms-2'>Все <span className='d-none d-sm-inline'>товары</span></span>
                </label>
                <button type='button' className='d-flex align-items-center dark-gray ms-auto'>
                  <HiOutlineTrash className='fs-15 me-1 me-sm-2'/>
                  <span className='d-md-none'>Удалить</span>
                  <span className='d-none d-md-inline ms-1'>Удалить выбранные</span>
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
              <div className="cart-box">
                <div className='main-color fs-11 mb-1'>Комментарий</div>
                <textarea rows="3" defaultValue={'Уберите, пожалуйста, лук'} className='fs-09 mb-4'></textarea>

                <div className='fs-11 mb-1'>Промокод</div>
                <fieldset className='promoCode mb-4'>
                  <input type="text" />
                  <button type='button' className='btn-secondary'>Применить</button>
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
                  <span className='secondary'>бесплатно</span>
                </div>

                <Gifts/>
                <hr className='my-3'/>
                <div className="fs-11 fw-6 d-flex justify-content-between mb-3">
                  <span>Итоговая сумма</span>
                  <span>1 880 ₽</span>
                </div>

                <Link to='/checkout' className='btn-primary w-100'>
                  <span className='fw-4'>Перейти к оформлению</span>
                </Link>

                <div className='fs-09 bg-secondary secondary p-2 fw-5 text-center w-100 rounded-2 mt-3'>34 бонуса будут начислены за этот заказ</div>
              </div>
            </Col>
          </Row>
        </form>
        <section className='mb-6'>
          <h5>Добавьте к заказу</h5>
          <Swiper
            className=""
            modules={[Navigation]}
            spaceBetween={15}
            slidesPerView={2}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              576: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              992: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1200: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
            }}
          >
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
          </Swiper>
        </section>
      </Container>
    </main>
  );
};

export default Cart;