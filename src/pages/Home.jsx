import React from "react";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import AppStore from "../assets/imgs/appstore-black.svg";
import GooglePlay from "../assets/imgs/googleplay-black.svg";
import Phone from "../assets/imgs/phone.png";
import Offer from "../components/Offer";
import Catalog from "../components/Catalog";
import { useSelector } from "react-redux";
import { Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import Meta from "../components/Meta";
import Loader from "../components/utils/Loader";
import { getImageURL } from "../helpers/all";
import { useGetHomeQuery } from "../services/home";
import Widgets from "../components/Widgets";
import StoriesSection from "../components/StoriesSection";

const Home = () => {
  const home = useGetHomeQuery();
  const options = useSelector((state) => state.settings.options);

  if (home?.isLoading) {
    return <Loader full />;
  }

  return (
    <main>
      <Meta
        title={options?.title ?? "Главная"}
        description={options?.description}
      />
      {home?.data?.banners?.length > 0 && (
        <section className="sec-1 mb-6">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-11 col-lg-9 col-xl-8">
                <Swiper
                  className="main-slider paginated"
                  modules={[Pagination]}
                  loop={true}
                  spaceBetween={15}
                  slidesPerView={1}
                  initialSlide={0}
                  loopedSlides={1}
                  centeredSlides={true}
                  speed={750}
                  pagination={{ clickable: true }}
                >
                  {home.data.banners.map((e, index) => (
                    <SwiperSlide key={index}>
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
      {home?.data?.stories?.length > 0 && (
        <section className="sec-2 mb-6">
          <Container className="position-relative">
            <StoriesSection data={home.data.stories} />
          </Container>
        </section>
      )}

      {home?.data?.widgets?.length > 0 && <Widgets data={home.data.widgets} />}

      {home?.data?.categories && <Catalog data={home.data.categories} />}

      {options?.appYes && (
        <Container className="overflow-hidden">
          <section className="sec-4 mb-5">
            <h3>
              Заказывать стало <br className="d-lg-none" />
              ещё&nbsp;удобнее!
            </h3>
            <div className="d-flex align-items-center mb-3 mb-lg-4">
              <button
                type="button"
                className="btn-2 fs-20 py-2 px-3 px-lg-4 me-2 me-md-3"
              >
                <span className="d-lg-none">—</span>
                <span className="d-none d-lg-inline">скидка</span>
                <span> 15%</span>
              </button>
              <p className="fs-16">
                на&nbsp;первый заказ <br />
                через&nbsp;приложение
              </p>
            </div>
            <ul className="logotips mb-3 mb-lg-5">
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
            <p>Акция действует при заказе на сумму от 1 000 ₽</p>
            <img src={Phone} alt="Phone" className="phone" />
          </section>
        </Container>
      )}

      {home?.data?.sales?.length > 0 && (
        <section className="sec-6 mt-5 mb-5">
          <Container>
            <Swiper
              className="sw-offers"
              spaceBetween={20}
              slidesPerView={"auto"}
              speed={750}
              breakpoints={{
                576: {
                  slidesPerView: "auto",
                },
                768: {
                  slidesPerView: "auto",
                },
                992: {
                  slidesPerView: 3,
                },
              }}
            >
              {home.data.sales.map((e, index) => (
                <SwiperSlide key={index}>
                  <Offer data={e} />
                </SwiperSlide>
              ))}
            </Swiper>

            <Link to="/promo" className="btn-primary mt-4 mt-sm-5 mx-auto">
              Смотреть все акции
            </Link>
          </Container>
        </section>
      )}
    </main>
  );
};

export default Home;
