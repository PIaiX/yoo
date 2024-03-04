import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProductCardMini from "../components/ProductCardMini";

// swiper
import { Navigation, Thumbs, FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SwiperButtonNext from "../components/utils/SwiperButtonNext";
import SwiperButtonPrev from "../components/utils/SwiperButtonPrev";

const About = () => {
  return (
    <main>
      <Container>
        <section className="article-page pt-4 pt-lg-0 mb-6">
          <img
            src="/images/img1.jpg"
            alt="Заголовок новости"
            className="article-page-imgMain mb-4 mb-sm-5"
          />

          <Row className="justify-content-between">
            <Col lg={9} xxl={8}>
              <h1 className="mb-3 mb-sm-4">Заголовок новости</h1>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias
              </p>
              <p>
                Excepturi sint occaecati cupiditate non provident, similique
                sunt in culpa qui officia deserunt mollitia animi, id est
                laborum et dolorum fuga.
              </p>
              <p>
                Et harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere possimus.Et
                harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere possimus.Et
                harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere
                possimus.Excepturi sint occaecati cupiditate non provident,
                similique sunt in culpa qui officia deserunt mollitia animi, id
                est laborum et dolorum fuga.
              </p>
              <img src="/images/img1.jpg" alt="Заголовок новости" />
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias
              </p>
              <p>
                Excepturi sint occaecati cupiditate non provident, similique
                sunt in culpa qui officia deserunt mollitia animi, id est
                laborum et dolorum fuga.
              </p>
              <p>
                Et harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere possimus.Et
                harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere possimus.Et
                harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere
                possimus.Excepturi sint occaecati cupiditate non provident,
                similique sunt in culpa qui officia deserunt mollitia animi, id
                est laborum et dolorum fuga.
              </p>
            </Col>
            <Col lg={3} className="d-none d-lg-block">
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
            </Col>
          </Row>
        </section>

        <section className="sec-5 mb-5">
          <Container>
            <h2>Обратите внимание</h2>
            <div className="position-relative">
              <Swiper
                className="product-slider position-static"
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
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  992: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                }}
              >
                <SwiperSlide>
                  <ProductCardMini />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductCardMini />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductCardMini />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductCardMini />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductCardMini />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductCardMini />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductCardMini />
                </SwiperSlide>
                <SwiperSlide>
                  <ProductCardMini />
                </SwiperSlide>
                <SwiperButtonPrev />
                <SwiperButtonNext />
              </Swiper>
            </div>
          </Container>
        </section>
      </Container>
    </main>
  );
};

export default About;
