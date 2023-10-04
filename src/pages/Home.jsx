import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from 'react-router-dom';
import StoriesSection from '../components/StoriesSection';
import CategoryCard from '../components/CategoryCard';
import ProductCardMini from '../components/ProductCardMini';
import Offer from '../components/Offer';
import ArticleCard from '../components/ArticleCard';
import Callback from '../components/modals/Callback';

import ArticlesMore from '../assets/imgs/articlesMore.jpg';
import ArticlesCover from '../assets/imgs/articlesCover.jpg';
import jsonData from "../data/categories";
import jsonArticles from "../data/articles";
import useIsMobile from '../hooks/isMobile';

import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide, SlidePrevButton, SlideNextButton } from 'swiper/react';
import 'swiper/css';
import SwiperButtonNext from '../components/utils/SwiperButtonNext';
import SwiperButtonPrev from '../components/utils/SwiperButtonPrev';

const Home = () => {
  const isMobileLG = useIsMobile('991px');

  return (
    <main>
      <section className='sec-1 mb-6'>
        <div className='container-md gx-0 gx-md-4'>
          <div className='row justify-content-center'>
            <div className='col-12 col-lg-11 col-xl-9 col-xxl-8'>
              <Swiper
                className='main-slider paginated'
                modules={[Pagination]}
                loop={true}
                spaceBetween={0}
                slidesPerView={1}
                initialSlide={1}
                loopedSlides={2}
                speed={750}
                pagination={{ clickable: true }}
                breakpoints={{
                  768: {
                    spaceBetween: 15,
                  },
                }}
              >
                <SwiperSlide>
                  <Link to='/promo/1'>
                    <img src="/imgs/slider-main/slide-1.webp" alt="Обновление ассортимента" className='img-fluid' loading="lazy"/>
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link to='/promo/2'>
                    <img src="/imgs/slider-main/slide-2.webp" alt="Гелевые шары" className='img-fluid' loading="lazy"/>
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link to='/promo/3'>
                    <img src="/imgs/slider-main/slide-3.webp" alt="бесплатная доставка" className='img-fluid' loading="lazy"/>
                  </Link>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <section className='sec-2 mb-6'>
        <Container className='position-relative'>
          <StoriesSection/>
        </Container>
      </section>

      {/* <Section3/> */}

      <section className='sec-catalog mb-6'>
        <Container>
          <h2 className='text-center'>Каталог подарков</h2>
          <Row xs={2} md={3} lg={4} className='justify-content-center gx-2 gy-3 g-sm-4'>
            {
              (jsonData).map(obj => {
                return <Col key={obj.id}>
                  <CategoryCard data={obj}/>
                </Col>
              })
            }
          </Row>
          <button type='button' className='btn-primary mx-auto mt-4'>показать все</button>
        </Container>
      </section>

      <section className='sec-3 mb-6'>
        <Container>
          <Row className='justify-content-end'>
            <Col xs={12} md={8} lg={6}>
              <h2 className='text-center'>Сделайте праздник по‑настоящему ярким</h2>
              <p className='text-center'>Скорее заказывайте воздушные шары, они понравятся как взрослым, так и малышам</p>
              {/* <button type='button' className='btn-info mx-auto mt-4'>Заказать</button> */}
              <Callback btnText={'Заказать'} btnClass={'btn-info mx-auto mt-4'}/>
            </Col>
          </Row>
        </Container>
      </section>

      <section className='sec-4 mb-6'>
        <Container>
          <h2 className='mb-0'>Часто заказывают</h2>
          <div className="position-relative">
            <Swiper
              className='product-slider'
              spaceBetween={10}
              slidesPerView={3}
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
              <SwiperButtonPrev/>
              <SwiperButtonNext/>
            </Swiper>
          </div>
        </Container>
      </section>

      <section className='sec-5 mb-6'>
        <Container>
          <Row className='gx-4 gy-5'>
            <Col xs={12} lg={8} xl={6}>
              <img src={ArticlesCover} alt="Cover" className='cover'/>
            </Col>
            {
              (!isMobileLG) &&
              <>
                {
                  jsonArticles.map(obj => {
                    return <Col key={obj.id} md={4} xl={3}><ArticleCard data={obj} /></Col>
                  })
                }
                <Col md={4} xl={3}>
                  <Link to='/articles' className="more">
                    <img src={ArticlesMore} alt="more" className='img'/>
                  </Link>
                </Col>
              </>
            }
          </Row>
          {
            (isMobileLG) &&
            <Swiper
              className='articles-slider'
              spaceBetween={20}
              slidesPerView={'auto'}
            >
              {
                jsonArticles.map(obj => {
                  return <SwiperSlide key={obj.id}>
                    <ArticleCard data={obj} />
                  </SwiperSlide>
                })
              }
              <SwiperSlide>
                <Link to='/articles' className="more">
                  <img src={ArticlesMore} alt="more" className='img'/>
                  </Link>
              </SwiperSlide>
            </Swiper>
          }
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
          <Link to='/promo' className='btn-primary mt-5 mx-auto'>смотреть все акции</Link>
        </Container>
      </section>
    </main>
  );
};

export default Home;