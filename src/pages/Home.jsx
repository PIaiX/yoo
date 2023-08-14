import React from 'react';
import Container from 'react-bootstrap/Container';
import {Link} from 'react-router-dom';
import StoriesSection from '../components/StoriesSection';
import ProductCardMini from '../components/ProductCardMini';
import Offer from '../components/Offer';
import Section3 from '../components/Section3';
import AppStore from '../assets/imgs/appstore-black.svg';
import GooglePlay from '../assets/imgs/googleplay-black.svg';
import Phone from '../assets/imgs/phone.png';
import { HiOutlineArrowRightCircle, HiOutlineArrowLeftCircle, HiXMark } from "react-icons/hi2";

import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Home = () => {
  return (
    <main>
      <section className='sec-1 mb-5'>
        <div className='container-md gx-0 gx-md-4'>
          <div className='row justify-content-center'>
            <div className='col-12 col-lg-11 col-xl-9 col-xxl-8'>
              <Swiper
                className='main-slider paginated'
                modules={[Navigation, Pagination]}
                loop={true}
                spaceBetween={0}
                slidesPerView={1}
                initialSlide={1}
                loopedSlides={2}
                speed={750}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  768: {
                    spaceBetween: 35,
                  },
                }}
              >
                <SwiperSlide>
                  <Link to='/'>
                    <img src="imgs/slider-main/slide-1.jpg" alt="Большие пиццы" className='img-fluid' loading="lazy"/>
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link to='/'>
                    <img src="imgs/slider-main/slide-2.jpg" alt="Фестиваль уличной еды" className='img-fluid' loading="lazy"/>
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link to='/'>
                    <img src="imgs/slider-main/slide-3.jpg" alt="Счастливые часы" className='img-fluid' loading="lazy"/>
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link to='/'>
                    <img src="imgs/slider-main/slide-2.jpg" alt="Фестиваль уличной еды" className='img-fluid' loading="lazy"/>
                  </Link>
                </SwiperSlide>
                <div className="swiper-button-prev">
                  <HiOutlineArrowLeftCircle/>
                </div>
                <div className="swiper-button-next">
                  <HiOutlineArrowRightCircle/>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <section className='sec-2 mb-5'>
        <div className='container-md px-0 px-md-4'>
          <StoriesSection/>
        </div>
      </section>

      <Section3/>

      <Container className='overflow-hidden'>
        <section className='sec-4 mb-5'>
          <h3>Заказывать стало <br className='d-lg-none'/>ещё&nbsp;удобнее!</h3>
          <div className="d-flex align-items-center mb-3 mb-lg-4">
            <button type='button' className='btn-2 fs-20 py-2 px-3 px-lg-4 me-2 me-md-3'>
              <span className='d-lg-none'>—</span>
              <span className='d-none d-lg-inline'>скидка</span>
              <span> 15%</span>
            </button>
            <p className='fs-16'>на&nbsp;первый заказ <br/>через&nbsp;приложение</p>
          </div>
          <ul className='logotips mb-3 mb-lg-5'>
            <li>
              <a href="/">
                <img src={AppStore} alt="App Store" />
              </a>
            </li>
            <li>
              <a href="/">
                <img src={GooglePlay} alt="Google Play" />
              </a>
            </li>
          </ul>
          <p>Акция действует при заказе на сумму от 1 000 ₽</p>
          <img src={Phone} alt="Phone" className='phone' />
        </section>
      </Container>

      <section className='sec-5 d-none d-md-block mb-5'>
        <Container>
          <h2>Часто заказывают</h2>
          <Swiper
            className='product-slider'
            spaceBetween={10}
            slidesPerView={'auto'}
            speed={750}
            breakpoints={{
              576: {
                spaceBetween: 20,
              },
            }}
          >
            <SwiperSlide>
              <ProductCardMini/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini/>
            </SwiperSlide>
          </Swiper>
        </Container>
      </section>

      <section className='sec-6 mb-5'>
        <Container>
          <Swiper
            className='sw-offers'
            spaceBetween={5}
            slidesPerView={'auto'}
            speed={750}
            breakpoints={{
              576: {
                slidesPerView: 'auto',
                spaceBetween: 7,
              },
              768: {
                slidesPerView: 'auto',
                spaceBetween: 10,
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
            }}
          >
            <SwiperSlide>
              <Offer blackText={false} img={"imgs/offers/offer1.jpg"} title={'Весна пришла'} subtitle={'А с ней новые вкусы роллов!'}/>
            </SwiperSlide>
            <SwiperSlide>
              <Offer blackText={false} img={"imgs/offers/offer2.jpg"} title={'Пицца «Гаваи»'} subtitle={'Улётный микс из курицы и ананаса'}/>
            </SwiperSlide>
            <SwiperSlide>
              <Offer blackText={true} img={"imgs/offers/offer3.jpg"} title={'Свежих ягод много бывает'} subtitle={'Попробуйте наш фирменный тарт — мы добавили в него ещё больше клубники!'}/>
            </SwiperSlide>
          </Swiper>
          <Link to='/promo' className='btn-30 mt-4 mx-auto'>смотреть все акции</Link>
        </Container>
      </section>
    </main>
  );
};

export default Home;