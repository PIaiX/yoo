import React, { useLayoutEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import Notice from "../components/Notice";
import ProductCard from "../components/ProductCard";
import Ingredient from "../components/utils/Ingredient";
// swiper
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// icons & images
import {
  HiOutlineInformationCircle,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { Link, useParams } from "react-router-dom";
import ButtonCart from "../components/ButtonCart";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Meta from "../components/Meta";
import Loader from "../components/utils/Loader";
import NavTop from "../components/utils/NavTop";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import { getProduct, getProducts } from "../services/product";
import { isCart } from "../hooks/useCart";
import { useDispatch, useSelector } from "react-redux";

const Product = () => {
  const { productId } = useParams();
  const [isRemove, setIsRemove] = useState(false);

  const productEnergyVisible = useSelector(
    (state) => state.settings.options.productEnergyVisible
  );
  const [product, setProduct] = useState({
    loading: true,
    item: {},
  });

  const [recommends, setRecommends] = useState({
    loading: true,
    data: [],
  });

  const modifiers =
    product.item?.modifiers?.length > 0
      ? [...product.item.modifiers].sort((a, b) => a?.price - b?.price)
      : [];

  const [data, setData] = useState({
    cart: {
      data: {
        modifiers:
          modifiers?.length > 0 ? modifiers.find((e) => e.main) : false,
        additions: [],
        wishes: [],
      },
    },
  });

  const price = data.cart.data?.modifiers?.id
    ? product.item.options.modifierPriceSum
      ? data.cart.data.modifiers.price + product.item.price
      : data.cart.data.modifiers.price
    : product.item.price;

  const discount = data.cart.data?.modifiers?.id
    ? product.item.options.modifierPriceSum
      ? data.cart.data?.modifiers.discount + product.item.discount
      : data.cart.data?.modifiers.discount
    : product.item.discount;

  useLayoutEffect(() => {
    getProduct(productId)
      .then((res) => {
        setProduct({ loading: false, item: res });
        data.cart.data.modifiers =
          res?.modifiers?.length > 0
            ? res.modifiers.find((e) => e.main)
            : false;
        setData(data);
        getProducts({ productId: res.id, categoryId: res.categoryId })
          .then((res) => setRecommends({ loading: false, data: res }))
          .catch(() => setRecommends((data) => ({ ...data, loading: false })));
      })
      .catch(() => setProduct((data) => ({ ...data, loading: false })));
  }, [productId]);

  if (product?.loading) {
    return <Loader full />;
  }

  if (!product?.item?.id) {
    return (
      <Empty
        text="Такого товара нет"
        desc="Возможно вы перепутали ссылку"
        image={() => <EmptyCatalog />}
        button={
          <Link className="btn-primary" to="/">
            Перейти в меню
          </Link>
        }
      />
    );
  }

  return (
    <main>
      <Meta title={product?.item?.title ?? "Товар"} />
      <Container>
        <NavTop
          toBack={true}
          breadcrumbs={[
            {
              title: product?.item?.category?.title ?? "Нет категории",
              link: product?.item?.category?.id
                ? "/category/" + product.item.category.id
                : "/menu",
            },
            {
              title: product?.item?.title ?? "Не названия",
            },
          ]}
        />

        <form className="productPage mb-5">
          <Row className="gx-4 gx-xxl-5">
            <Col xs={12} lg={3}>
              <img
                src={getImageURL({ path: product.item.medias, size: "full" })}
                alt={product.item.title}
                className="productPage-img"
              />
            </Col>
            <Col xs={12} md={6} lg={5}>
              <div className="d-flex align-items-center justify-content-between justify-content-md-start mb-4">
                <h1 className="mb-0">{product.item.title}</h1>
                {product.item.energy.weight > 0 && (
                  <>
                    <h6 className="text-muted mb-0 ms-3">
                      {customWeight({
                        value: product.item.energy.weight,
                        type: product.item.energy?.weightType,
                      })}
                    </h6>
                    {/* <HiOutlineInformationCircle className="dark-gray fs-15 ms-2" /> */}
                  </>
                )}
              </div>
              {product.item.description && (
                <div className="mb-4">
                  <p className="mb-2">Состав:</p>
                  <p>{product.item.description}</p>
                </div>
              )}
              {product?.item?.modifiers?.length > 0 && (
                <>
                  {/* <h6 className="mt-4">Тесто</h6> */}
                  <div className="d-xxl-flex mb-4">
                    <ul className="inputGroup">
                      {product.item.modifiers
                        .slice()
                        .sort((a, b) => a.price - b.price)
                        .map((e, index) => (
                          <li>
                            <label>
                              <input
                                type="radio"
                                name="modifiers"
                                defaultChecked={index === 0}
                                onChange={() => {
                                  let newData = { ...data };

                                  newData.cart.data.modifiers = e;

                                  setData(newData);
                                }}
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
                <div className="me-3">
                  <div className="py-2 px-3 fw-5 fw-5 rounded-pill">
                    {customPrice(price)}
                  </div>
                  {discount > 0 && (
                    <div className="fs-09 text-decoration-line-through">
                      {customPrice(discount)}
                    </div>
                  )}
                </div>
                <ButtonCart
                  full
                  product={product.item}
                  data={data}
                  className="btn-light py-2"
                >
                  <span className="fw-4">В корзину</span>
                  <HiOutlineShoppingBag className="fs-15 ms-2" />
                </ButtonCart>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4} className="mt-3 mt-sm-4 mt-md-0">
              {product?.item?.additions?.length > 0 && (
                <>
                  <h6>Изменить по вкусу</h6>
                  <div className="productPage-edit mb-3">
                    {/* <div className="top">
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
                    </div> */}
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
                      <div className="box">
                        <ul>
                          {product.item.additions.map((e) => {
                            const isAddition = () =>
                              !!data?.cart?.data?.additions.find(
                                (addition) => addition.id === e.addition.id
                              );
                            const onPressAddition = () => {
                              if (isAddition()) {
                                let newAdditions =
                                  data.cart.data.additions.filter(
                                    (addition) => addition.id != e.addition.id
                                  );
                                let newData = { ...data };
                                newData.cart.data.additions = newAdditions;
                                setData(newData);
                              } else {
                                let newData = { ...data };
                                newData.cart.data.additions.push(e.addition);
                                setData(newData);
                              }
                            };
                            return (
                              <li>
                                <Ingredient
                                  data={e}
                                  active={isAddition()}
                                  onChange={onPressAddition}
                                />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}
              <Notice />
            </Col>
          </Row>
        </form>
        {recommends?.data?.length > 0 && (
          <section className="d-none d-md-block mb-5">
            <h2>Товары из этой категории</h2>
            <Swiper
              className=""
              modules={[Navigation]}
              spaceBetween={15}
              slidesPerView={2}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
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
              {recommends.data.map((e) => (
                <SwiperSlide>
                  <ProductCard data={e} />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}
      </Container>
    </main>
  );
};

export default Product;
