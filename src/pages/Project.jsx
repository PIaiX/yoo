import React, { useLayoutEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ProductCard from "../components/ProductCard";

// icons & images
import { Link, useParams } from "react-router-dom";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Meta from "../components/Meta";
import Loader from "../components/utils/Loader";
import NavTop from "../components/utils/NavTop";
import { customPrice, getImageURL } from "../helpers/all";
import { getProduct } from "../services/product";

// swiper
import { useSelector } from "react-redux";
import "swiper/css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Callback from "../components/modals/Callback";
import SwiperButtonNext from "../components/utils/SwiperButtonNext";
import SwiperButtonPrev from "../components/utils/SwiperButtonPrev";

const Project = () => {
  const [featuresShow, setFeaturesShow] = useState(false);
  const options = useSelector((state) => state.settings.options);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [show, setShow] = useState(false);
  const { productId } = useParams();

  const [product, setProduct] = useState({
    loading: true,
    item: {},
    recommends: [],
  });

  var [data, setData] = useState({
    cart: {
      data: {
        modifiers: {},
        additions: [],
        wishes: [],
      },
    },
  });

  useLayoutEffect(() => {
    getProduct(productId)
      .then((res) => {
        setProduct({ ...res, loading: false });
      })
      .catch(() => setProduct((data) => ({ ...data, loading: false })));
  }, [productId]);

  if (product?.loading) {
    return <Loader full />;
  }

  if (!product?.id) {
    return (
      <Empty
        text="Такого товара нет"
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
        title={product?.title ?? "Товар"}
        description={product?.description}
        image={
          product?.medias[0]?.media
            ? getImageURL({
                path: product.medias[0].media,
                size: "full",
                type: "product",
              })
            : false
        }
      />
      <Container>
        <NavTop
          toBack={true}
          breadcrumbs={[
            {
              title: "Проекты",
              link: "/projects",
            },
            {
              title: product?.title ?? "Нет названия",
            },
          ]}
        />
        <form className="productPage mb-4 mb-md-5">
          <Row className="gx-4 gx-xl-5">
            <Col xs={12} lg={9}>
              <Row md={2} className="h-100">
                <Col>
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
                      <SwiperSlide>
                        <img
                          src={getImageURL({
                            path: product.medias,
                            size: "full",
                          })}
                          alt={product.title}
                          className="productPage-img"
                        />
                      </SwiperSlide>
                    </Swiper>
                    <Swiper
                      className="mainSlider"
                      modules={[Thumbs]}
                      loop={true}
                      spaceBetween={20}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                    >
                      <SwiperSlide>
                        <img
                          src={getImageURL({
                            path: product.medias,
                            size: "full",
                          })}
                          alt={product.title}
                          className="productPage-img"
                        />
                      </SwiperSlide>
                    </Swiper>
                    {/* <BtnFav /> */}
                  </div>
                  {/* <img
                    src={getImageURL({ path: product.medias, size: "full" })}
                    alt={product.title}
                    className="productPage-img"
                  /> */}
                </Col>
                <Col className="d-flex flex-column justify-content-between">
                  <div>
                    <h1>{product.title}</h1>
                    <p>{product.description}</p>
                  </div>
                  <div>
                    <div className="me-2 me-xl-3">
                      <div className="fs-14 fw-6">
                        {customPrice(product?.price ?? 0)}
                      </div>
                      {product?.discount > 0 && (
                        <div className="gray fs-09 text-decoration-line-through">
                          {customPrice(product?.discount ?? 0)}
                        </div>
                      )}
                    </div>

                    {options?.project?.buttons?.length > 0 &&
                      options?.project?.buttons.map((e) => (
                        <Link
                          onClick={() => setShow(true)}
                          className={
                            "mt-3 w-100 btn" +
                            (e.type == "dark"
                              ? " btn-primary"
                              : " btn-primary-outline")
                          }
                        >
                          {e.title}
                        </Link>
                      ))}
                    <Callback show={show} setShow={setShow} />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>

        <section className="mb-4 mb-md-5">
          <ul className="tabs">
            <li>
              <button
                type="button"
                onClick={() => setFeaturesShow(false)}
                className={featuresShow ? "" : "active"}
              >
                Описание
              </button>
            </li>
            {/* <li>
              <button
                type="button"
                onClick={() => setFeaturesShow(true)}
                className={featuresShow ? "active" : ""}
              >
                Характеристики
              </button>
            </li> */}
          </ul>
          {featuresShow ? (
            <ul className="features px-2 py-3 p-sm-4">
              <li>
                <div>Тип</div>
                <div>Печать</div>
              </li>
              <li>
                <div>Формат</div>
                <div>Ручная</div>
              </li>
              <li>
                <div>Особенности</div>
                <div>Подушка в комплекте</div>
              </li>
            </ul>
          ) : (
            <div className="p-2 p-sm-4 lh-15">{product.description}</div>
          )}
        </section>

        {product?.recommends?.length > 0 && (
          <section className="mb-6">
            <h2>Вам пригодится</h2>
            <div className="position-relative">
              <Swiper
                className="position-static"
                modules={[Navigation]}
                spaceBetween={15}
                slidesPerView={2}
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
                {product.recommends.map((e) => (
                  <SwiperSlide>
                    <ProductCard data={e} />
                  </SwiperSlide>
                ))}
                <SwiperButtonPrev />
                <SwiperButtonNext />
              </Swiper>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
};

export default Project;
