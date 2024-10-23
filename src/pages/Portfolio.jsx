import React, { useState, useEffect, useLayoutEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProductCardMini from "../components/ProductCardMini";

// swiper
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SwiperButtonNext from "../components/utils/SwiperButtonNext";
import SwiperButtonPrev from "../components/utils/SwiperButtonPrev";
import NavTop from "../components/utils/NavTop";
import Meta from "../components/Meta";
import { getImageURL } from "../helpers/all";
import { Link, useParams } from "react-router-dom";
import { getPortfolioOne } from "../services/portfolio";
import Loader from "../components/utils/Loader";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import PortfolioItem from "../components/PortfolioItem";

const Portfolio = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { portfolioId } = useParams();

  const [portfolio, setProduct] = useState({
    loading: true,
    recommends: [],
  });
  const [medias, setMedias] = useState([]);

  useLayoutEffect(() => {
    getPortfolioOne(portfolioId)
      .then((res) => {
        setProduct({ ...res, loading: false });
        res?.medias?.length > 0 &&
          setMedias(res.medias.sort((a, b) => b.main - a.main));
      })
      .catch(() => setProduct((data) => ({ ...data, loading: false })));
  }, [portfolioId]);

  if (portfolio?.loading) {
    return <Loader full />;
  }

  if (!portfolio?.id) {
    return (
      <Empty
        text="Такого портфолио нет"
        desc="Возможно вы перепутали ссылку"
        image={() => <EmptyCatalog />}
        button={
          <Link className="btn-primary" to="/">
            Перейти на главную
          </Link>
        }
      />
    );
  }

  return (
    <main>
      <Meta
        title={portfolio?.title ?? "Портфолио"}
        description={portfolio?.description}
        image={
          medias[0]?.media
            ? getImageURL({
                path: medias[0].media,
                size: "full",
                type: "portfolio",
              })
            : false
        }
      />
      <Container>
        <NavTop
          toBack={true}
          breadcrumbs={[
            {
              title: "Портфолио",
              link: "/portfolio",
            },
            {
              title: portfolio?.title ?? "Портфолио",
            },
          ]}
        />

        <div className="productPage-photo">
          <Swiper
            className="thumbSlider"
            modules={[Thumbs, FreeMode]}
            watchSlidesProgress
            onSwiper={setThumbsSwiper}
            direction="vertical"
            loop={true}
            spaceBetween={20}
            slidesPerView={"auto"}
            freeMode={true}
          >
            {medias.map((e) => (
              <SwiperSlide>
                <img
                  src={getImageURL({
                    path: e.media,
                    type: "portfolio",
                  })}
                  alt={portfolio.title}
                  className="productPage-img"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            className="mainSlider"
            modules={[Thumbs]}
            loop={true}
            spaceBetween={20}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
          >
            {medias.map((e) => (
              <SwiperSlide>
                <img
                  src={getImageURL({
                    path: e.media,
                    size: "full",
                    type: "portfolio",
                  })}
                  alt={portfolio.title}
                  className="productPage-img"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <Row className="justify-content-between py-5">
          <Col lg={9} xxl={8}>
            <h1 className="mb-3 mb-sm-4">{portfolio.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: portfolio.content }} />
          </Col>
          {/* <Col lg={3} className="d-none d-lg-block">
            <h5 className="fs-11">Вам может быть интересно</h5>
            <ul className="news-list">
              <li>
                <h6>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  etiam fermentum viverra euismod
                </h6>
                <time className="secondary">22 Июня, 2022</time>
              </li>
              <li>
                <h6>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  etiam fermentum viverra euismod
                </h6>
                <time className="secondary">22 Июня, 2022</time>
              </li>
              <li>
                <h6>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  etiam fermentum viverra euismod
                </h6>
                <time className="secondary">22 Июня, 2022</time>
              </li>
              <li>
                <h6>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  etiam fermentum viverra euismod
                </h6>
                <time className="secondary">22 Июня, 2022</time>
              </li>
            </ul>
          </Col> */}
        </Row>
        {portfolio?.recommends?.length > 0 && (
          <section className="sec-5 mb-5">
            <Container>
              <h2>Другие примеры</h2>
              <div className="position-relative">
                <Swiper
                  className="portfolio-slider position-static"
                  modules={[Navigation, FreeMode]}
                  spaceBetween={20}
                  slidesPerView={"auto"}
                  speed={750}
                  navigation
                  freeMode={true}
                  breakpoints={{
                    576: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                      freeMode: false,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    992: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                  }}
                >
                  {portfolio.recommends.map((e) => {
                    return (
                      <SwiperSlide>
                        <PortfolioItem data={e} />
                      </SwiperSlide>
                    );
                  })}

                  <SwiperButtonPrev />
                  <SwiperButtonNext />
                </Swiper>
              </div>
            </Container>
          </section>
        )}
      </Container>
    </main>
  );
};

export default Portfolio;
