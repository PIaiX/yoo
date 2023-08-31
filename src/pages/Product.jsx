import React, { useState, useLayoutEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProductCard from "../components/ProductCard";
import SelectImitation from "../components/utils/SelectImitation";
import Notice from "../components/Notice";
import Ingredient from "../components/utils/Ingredient";
// swiper
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// icons & images
import Corner from "../components/svgs/Corner";
import {
  HiOutlineInformationCircle,
  HiOutlineShoppingBag,
  HiPlus,
  HiMinus,
} from "react-icons/hi2";
import NavTop from "../components/utils/NavTop";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/product";
import Loader from "../components/utils/Loader";
import { customPrice, getImageURL } from "../helpers/all";
import ButtonCart from "../components/ButtonCart";

const Product = () => {
  const [isRemove, setIsRemove] = useState(false);
  const { productId } = useParams();
  const [data, setData] = useState({
    loading: true,
    item: {},
  });

  const onLoad = () => {
    getProduct(productId)
      .then((res) => setData({ loading: false, item: res }))
      .catch(() => setData({ ...data, loading: false }));
  };

  useLayoutEffect(() => {
    onLoad();
  }, []);

  if (data?.loading) {
    return <Loader full />;
  }

  const price =
    data?.item?.modifiers?.length > 0 && Array.isArray(data.item.modifiers)
      ? data.item.modifiers.sort((a, b) => a.price - b.price)[0].price
      : data.item.price;

  return (
    <main>
      <Container>
        <NavTop toBack={true} breadcrumbs={true} />

        <form className="productPage mb-5">
          <Row className="gx-4 gx-xxl-5">
            <Col xs={12} lg={3}>
              <img
                src={getImageURL({ path: data.item.medias, size: "full" })}
                alt={data.item.title}
                className="productPage-img"
              />
            </Col>
            <Col xs={12} md={6} lg={5}>
              <div className="d-flex align-items-center justify-content-between justify-content-md-start mb-4">
                <h1 className="mb-0">{data.item.title}</h1>
                <h6 className="gray mb-0 ms-3">{data.item.energy.weight}</h6>
                <HiOutlineInformationCircle className="dark-gray fs-15 ms-2" />
              </div>

              <p className="mb-2">Состав:</p>
              <p>{data.item.description}</p>
              {data?.item?.modifiers?.length > 0 && (
                <>
                  <h6 className="mt-4">Тесто</h6>
                  <div className="d-xxl-flex mb-4">
                    <ul className="inputGroup">
                      {data.item.modifiers
                        .slice()
                        .sort((a, b) => a.price - b.price)
                        .map((e, index) => (
                          <li>
                            <label>
                              <input
                                type="radio"
                                name="param1"
                                defaultChecked={index === 0}
                              />
                              <div className="text">{e.title}</div>
                            </label>
                          </li>
                        ))}
                    </ul>
                    {/* <ul className="inputGroup mt-2 mt-xxl-0 ms-xxl-5">
                  <li>
                    <label>
                      <input type="radio" name="param2" defaultChecked={true} />
                      <div className="text">25см</div>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio" name="param2" />
                      <div className="text">30см</div>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio" name="param2" />
                      <div className="text">36см</div>
                    </label>
                  </li>
                </ul> */}
                  </div>
                </>
              )}

              {/* <SelectImitation
                boxClass={"main-color w-fit mb-4"}
                btnClass={"rounded-pill"}
                optionsArr={[
                  {
                    value: 1,
                    label: "Сливочный соус",
                    defaultChecked: true,
                  },
                  {
                    value: 2,
                    label: "Красный соус",
                    defaultChecked: false,
                  },
                ]}
              /> */}

              <div className="productPage-price">
                <div>
                  <div className="fs-12">{customPrice(price)}</div>
                  {/* <div className="gray fs-09 text-decoration-line-through">
                    {" "}
                    650{" "}
                  </div> */}
                </div>
                <ButtonCart
                  data={data.item}
                  className="btn-secondary fs-12 rounded-pill ms-3"
                >
                  <span className="fw-4">В корзину</span>
                  <HiOutlineShoppingBag className="fs-15 ms-2" />
                </ButtonCart>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4} className="mt-3mt-sm-4 mt-md-0">
              <h6>Изменить по вкусу</h6>
              <div className="productPage-edit mb-3">
                <div className="top">
                  <button
                    type="button"
                    className={isRemove ? "" : "active"}
                    onClick={() => setIsRemove(false)}
                  >
                    <HiPlus />
                    <span>Добавить</span>
                    <Corner className="corner-right" />
                  </button>
                  <button
                    type="button"
                    className={isRemove ? "active" : ""}
                    onClick={() => setIsRemove(true)}
                  >
                    <HiMinus />
                    <span>Убрать</span>
                    <Corner className="corner-left" />
                    <Corner className="corner-right" />
                  </button>
                </div>
                {isRemove ? (
                  <div className="box">
                    {/* <ul>
                      <li>
                        <Ingredient />
                      </li>
                      <li>
                        <Ingredient />
                      </li>
                      <li>
                        <Ingredient />
                      </li>
                    </ul> */}
                  </div>
                ) : (
                  data?.item?.additions?.length > 0 && (
                    <div className="box">
                      <ul>
                        {data.item.additions.map((e) => (
                          <li>
                            <Ingredient data={e.addition} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
              <Notice />
            </Col>
          </Row>
        </form>

        <section className="d-none d-md-block mb-5">
          <h2>Товары из этой категории</h2>
          {/* <Swiper
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
          </Swiper> */}
        </section>
      </Container>
    </main>
  );
};

export default Product;
