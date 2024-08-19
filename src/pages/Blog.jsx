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
import Meta from "../components/Meta";
import { useSelector } from "react-redux";

const Blog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState({ loading: true });
  const options = useSelector((state) => state.settings.options);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);

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
      <Meta
        title={
          options?.seo?.blog?.title && blog?.title
            ? generateSeoText({
                text: options.seo.blog.title,
                name: blog.title,
                site: options?.title,
              })
            : selectedAffiliate?.title && blog?.title
            ? selectedAffiliate?.title + " - " + blog.title
            : options?.title && blog?.title
            ? options.title + " - " + blog.title
            : blog?.title ?? t("Новость")
        }
        description={
          options?.seo?.blog?.description
            ? generateSeoText({
                text: options.seo.blog.description,
                name: blog.content,
                site: options?.title,
              })
            : blog?.content ??
              t(
                "Узнайте свежие новости о нашей службе доставки, новых ресторанах, акциях и специальных предложениях."
              )
        }
        image={
          blog?.media
            ? getImageURL({
                path: blog.media,
                size: "full",
                type: "blog",
              })
            : false
        }
      />
      <Container>
        <section className="article-page pt-4 pt-lg-0 mb-6">
          <div className="position-relative">
            <div
              className="blog-post-background"
              style={{
                backgroundImage: `url(${getImageURL({
                  path: blog.media,
                  size: "full",
                  type: "blog",
                })})`,
              }}
            ></div>
            <img
              className="mb-4 mb-sm-5 d-block m-auto"
              src={getImageURL({
                path: blog.media,
                size: "full",
                type: "blog",
              })}
              alt={blog.title}
            />
          </div>

          <Row className="justify-content-center">
            <Col lg={9} xxl={8}>
              <h1 className="mb-3 mb-sm-4 text-center">{blog.title}</h1>
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
