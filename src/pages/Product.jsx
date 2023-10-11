import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../components/ProductCard';
import SelectImitation from '../components/utils/SelectImitation';
import CountInput from '../components/utils/CountInput';

// icons & images
import Corner from '../components/svgs/Corner';
import { HiOutlineInformationCircle, HiOutlineShoppingBag, HiPlus, HiMinus } from "react-icons/hi2";
import NavTop from '../components/utils/NavTop';

// swiper
import { Navigation, Thumbs, FreeMode } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Product = () => {
  const [isRemove, setIsRemove] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <main>
      <Container>
        <NavTop toBack={true} breadcrumbs={true}/>

        <form className='productPage mb-6'>
          <Row className='gx-4 gx-xxl-5'>
            <Col xs={12} lg={3}>
            <div className="productPage-photo">
                    <Swiper
                      className="thumbSlider"
                      modules={[Thumbs, FreeMode]}
                      watchSlidesProgress
                      onSwiper={setThumbsSwiper}
                      direction="vertical"
                      loop={true}
                      spaceBetween={20}
                      slidesPerView={'auto'}
                      freeMode={true}
                    >
                      <SwiperSlide>
                        <img src="/imgs/product.jpg" alt="Какой-то подарок" className='productPage-img'/>
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src="/imgs/product.jpg" alt="Какой-то подарок" className='productPage-img'/>
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src="/imgs/product.jpg" alt="Какой-то подарок" className='productPage-img'/>
                      </SwiperSlide>
                    </Swiper>
                    <Swiper 
                      className="mainSlider"
                      modules={[Thumbs]} 
                      loop={true}
                      spaceBetween={20}
                      thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    >
                      <SwiperSlide>
                        <img src="/imgs/product.jpg" alt="Какой-то подарок" className='productPage-img'/>
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src="/imgs/product.jpg" alt="Какой-то подарок" className='productPage-img'/>
                      </SwiperSlide>
                      <SwiperSlide>
                        <img src="/imgs/product.jpg" alt="Какой-то подарок" className='productPage-img'/>
                      </SwiperSlide>
                    </Swiper>
                    {/* <BtnFav/> */}
                  </div>
            </Col>
            <Col xs={12} md={6} lg={6} className='d-flex flex-column justify-content-between'>
              <div>
                <h1 className='mb-0'>Какой-то подарок</h1>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio molestiae culpa porro velit. Omnis culpa quae magnam tempore perferendis unde, odit ex dicta perspiciatis minus reprehenderit eligendi incidunt fugit ipsa?</p>
              </div>

              <div className='productPage-price'>
                <div>
                  <div className='fs-12'>650 ₽</div>
                  <div className='gray fs-09 text-decoration-line-through'> 650 </div>
                </div>
                <button type='button' className='btn-primary ms-3'>Заказать</button>
                <CountInput/>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className='mt-3mt-sm-4 mt-md-0'>
              <div className="box">
                <h6 className='secondary'>Доставка:</h6>
                <p className='fs-09 dark-gray'>По Казани осуществляется по договорённости с курьером. Минимальная сумма заказа 400 ₽</p>
                <p className='fs-09 dark-gray'>По России через компанию CDEK или почтой России</p>
                <h6 className="mt-4 secondary">Самовывоз:</h6>
                <p className='fs-09 dark-gray'>Магазин по адресу: Татарстан, Казань, Рашида Вагопова 3</p>
                <h6 className="mt-4 secondary">Оплата:</h6>
                <p className='fs-09 dark-gray'>Наличными или онлайн банковской картой</p>
              </div>
            </Col>
          </Row>
        </form>

        <section className='d-none d-md-block mb-5'>
          <h4>Вам пригодится</h4>
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

export default Product;