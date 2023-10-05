import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Categories from '../components/Categories';
import CategoryGroup from '../components/CategoryGroup';
import NavTop from '../components/utils/NavTop';
import jsonData from "../data/categories";
import CategoryCard from '../components/CategoryCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SwiperButtonNext from '../components/utils/SwiperButtonNext';
import SwiperButtonPrev from '../components/utils/SwiperButtonPrev';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  return (
    <main>
      <section className='sec-5 mb-5'>
        <Container>
          <NavTop toBack={true} breadcrumbs={true}/>
          <Swiper
            className='categories-topSlider mb-5'
            spaceBetween={15}
            slidesPerView={6}
            speed={750}
            breakpoints={{
              576: {
                spaceBetween: 20,
                slidesPerView: 'auto',
              },
              992: {
                slidesPerView: 6,
                spaceBetween: 16,
              },
            }}
          >
            {
              (jsonData).map(obj => {
                return <SwiperSlide key={obj.id}>
                  <CategoryCard data={obj}/>
                </SwiperSlide>
              })
            }
            <SwiperButtonPrev/>
            <SwiperButtonNext/>
          </Swiper>
          <h1 className='mb-5'>Подарки на день рождения</h1>
          <Row>
            <Col lg={3}>
              <form action="">
                <fieldset>
                  <legend>Цена, ₽</legend>

                </fieldset>
                <fieldset>
                  <legend>Вид</legend>
                  
                </fieldset>
                <fieldset>
                  <legend>Характеристика</legend>
                  
                </fieldset>
              </form>
            </Col>
            <Col lg={9}>
              <div>
                <select>
                  <option value="">Рекомендуем</option>
                  <option value="">Рекомендуем</option>
                  <option value="">Рекомендуем</option>
                </select>
              </div>
              <Row lg={4}>
                <Col>
                  <ProductCard/>
                </Col>
                <Col></Col>
                <Col></Col>
                <Col></Col>
              </Row>
            </Col>
          </Row>
        </Container>

        {/* <div className="sticky-box mb-3 mb-sm-4 mb-md-5">
          <Categories/>
        </div> */}
        {/* <div className="categories-box">
          <CategoryGroup/>
          <CategoryGroup/>
        </div> */}
      </section>
    </main>
  );
};

export default Catalog;