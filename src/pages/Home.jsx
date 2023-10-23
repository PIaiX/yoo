
import React from "react";
import Container from "react-bootstrap/Container";
import {
  HiOutlineArrowLeftCircle,
  HiOutlineArrowRightCircle,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import AppStore from "../assets/imgs/appstore-black.svg";
import GooglePlay from "../assets/imgs/googleplay-black.svg";
import Phone from "../assets/imgs/phone.png";
import Offer from "../components/Offer";
// import ProductCardMini from "../components/ProductCardMini";
import Catalog from "../components/Catalog";
// import StoriesSection from "../components/StoriesSection";
import { useSelector } from "react-redux";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperButtonNext from '../components/utils/SwiperButtonNext';
import SwiperButtonPrev from '../components/utils/SwiperButtonPrev';

import ArticlesMore from '../assets/imgs/articlesMore.jpg';
import ArticlesCover from '../assets/imgs/articlesCover.jpg';
import jsonData from "../data/categories";
import jsonArticles from "../data/articles";
import useIsMobile from '../hooks/isMobile';

import Empty from "../components/Empty";
import Meta from "../components/Meta";
import Loader from "../components/utils/Loader";
import { getImageURL } from "../helpers/all";
import {
  useGetCategoriesQuery,
  useGetSalesQuery,
  useGetBannersQuery,
} from "../services/home";

const Home = () => {
  const banners = useGetBannersQuery();
  const sales = useGetSalesQuery();
  const categories = useGetCategoriesQuery();
  const options = useSelector((state) => state.settings.options);

  if (categories.isLoading || sales.isLoading || banners.isLoading) {
    return <Loader full />;
  }

  if (!Array.isArray(categories.data) || categories.data.length <= 0) {
    return (
      <Empty
        text="Нет товаров"
        desc="Временно товары отсуствуют"
        image={() => <EmptyCatalog />}
        button={
          <a
            className="btn-primary"
            onclick={() => {
              location.reload();
              return false;
            }}
          >
            Обновить страницу
          </a>
        }
      />
    );
  }
  const isMobileLG = useIsMobile('991px');

  return (
    <main>
      <Meta title="Главная" />
      {banners?.data?.items?.length > 0 && (
        <section className="sec-1 mb-6">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-11 col-xl-9 col-xxl-8">
                <Swiper
                  className="main-slider paginated"
                  modules={[Pagination]}
                  loop={true}
                  spaceBetween={15}
                  slidesPerView={1}
                  initialSlide={1}
                  loopedSlides={2}
                  speed={750}
                  pagination={{ clickable: true }}
                >
                  {banners.data.items.map((e) => (
                    <SwiperSlide>
                      <Link>
                        <img
                          src={getImageURL({
                            path: e?.medias,
                            type: "banner",
                            size: "full",
                          })}
                          alt={e?.title}
                          className="img-fluid"
                        />
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className='sec-2 mb-6'>
        <Container className='position-relative'>
          <StoriesSection/>
        </Container>
      </section>

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
              spaceBetween={15}
              slidesPerView={'auto'}
              speed={750}
              breakpoints={{
                576: {
                  spaceBetween: 20,
                  slidesPerView: 'auto',
                },
                992: {
                  slidesPerView: 3,
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
      {sales?.data?.items?.length > 0 && (
        <section className="sec-6 mb-5">
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
              {sales.data.items.map((e) => (
                <SwiperSlide>
                  <Offer data={e} />
                </SwiperSlide>
              ))}
            </Swiper>

            <Link to="/promo" className="btn-primary mt-4 mt-sm-5 mx-auto">
            смотреть все акции

            </Link>
          </Container>
        </section>
      )}
    </main>
  );
};

export default Home;
