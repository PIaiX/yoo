import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// swiper
import { Link, useParams } from "react-router-dom";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Loader from "../components/utils/Loader";
import { getImageURL } from "../helpers/all";
import { getBlog } from "../services/blog";

const Blog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState({ loading: true });

  useEffect(() => {
    getBlog(blogId)
      .then((res) => setBlog({ loading: false, ...res }))
      .catch(() => setBlog({ loading: false, data: false }));
  }, []);

  if (blog?.loading) {
    return <Loader full />;
  }

  if (!blog?.id) {
    return (
      <Empty
        text="Новостей нет"
        desc="Новости скоро появится"
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
      <Container>
        <section className="article-page pt-4 pt-lg-0 mb-6">
          <img
            className="mb-4 mb-sm-5 d-block m-auto"
            src={getImageURL({ path: blog.media, size: "full", type: "blog" })}
            alt={blog.title}
          />
          <Row className="justify-content-between">
            <Col lg={9} xxl={8}>
              <h1 className="mb-3 mb-sm-4">{blog.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
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
        </section>

        {/* <section className="sec-5 mb-5">
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
        </section> */}
      </Container>
    </main>
  );
};

export default Blog;
