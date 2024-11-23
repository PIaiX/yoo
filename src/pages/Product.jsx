import React, { useLayoutEffect, useState } from "react";
import { Col, Container, OverlayTrigger, Popover, Row } from "react-bootstrap";
// import Notice from "../components/Notice";
import ProductCard from "../components/ProductCard";
import Corner from "../components/svgs/Corner";
import Addition from "../components/utils/Addition";
import Wish from "../components/utils/Wish";
// swiper
import {
  HiMinus,
  HiOutlineInformationCircle,
  HiOutlineShoppingBag,
  HiPlus,
} from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ButtonCart from "../components/ButtonCart";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Meta from "../components/Meta";
import Tags from "../components/Tags";
import Loader from "../components/utils/Loader";
import NavTop from "../components/utils/NavTop";
import Select from "../components/utils/Select";
import {
  customPrice,
  customWeight,
  generateSeoText,
  getImageURL,
  sortMain,
} from "../helpers/all";
import { getProduct } from "../services/product";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";

const groupByCategoryIdToArray = (modifiers) => {
  const grouped = modifiers.reduce((acc, modifier) => {
    const { categoryId } = modifier;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(modifier);
    return acc;
  }, {});

  return Object.keys(grouped).map((key, index) => ({
    categoryId: key ?? index,
    modifiers:
      grouped[key]?.length > 0
        ? grouped[key].sort((a, b) => a?.price - b?.price)
        : [],
  }));
};

const Product = () => {
  const { t } = useTranslation();
  const { productId } = useParams();

  const options = useSelector((state) => state.settings.options);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const [isRemove, setIsRemove] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const productEnergyVisible = useSelector(
    (state) => state.settings.options.productEnergyVisible
  );

  const [product, setProduct] = useState({
    loading: true,
    item: {},
  });

  const [data, setData] = useState({
    cart: {
      data: {
        modifiers: [],
        additions: [],
        wishes: [],
      },
    },
  });

  const [prices, setPrices] = useState({
    price: 0,
    discount: 0,
  });

  const onLoad = () => {
    getProduct({
      id: productId,
      affiliateId: selectedAffiliate?.id ?? false,
      required: true,
      multiBrand: options?.multiBrand,
      type: "site",
    })
      .then((res) => {
        const modifiers =
          res?.modifiers?.length > 0
            ? groupByCategoryIdToArray(res.modifiers)
            : [];
        setProduct({
          loading: false,
          item: {
            ...res,
            modifiers: modifiers,
          },
        });

        data.cart.data.modifiers =
          modifiers?.length > 0 ? modifiers.map((e) => e.modifiers[0]) : [];
        setData(data);
      })
      .catch(() => setProduct((data) => ({ ...data, loading: false })));
  };

  useLayoutEffect(() => {
    onLoad();
  }, [productId, selectedAffiliate]);

  useLayoutEffect(() => {
    if (product.item) {
      let price = 0;
      let discount = 0;
      if (data.cart.data?.modifiers?.length > 0) {
        if (product.item?.options?.modifierPriceSum) {
          price +=
            data.cart.data.modifiers.reduce(
              (sum, item) => sum + (item?.price ?? 0),
              0
            ) + product.item.price;
        } else {
          price += data.cart.data.modifiers.reduce(
            (sum, item) => sum + (item?.price ?? 0),
            0
          );
        }
      } else {
        price += product.item.price;
      }

      if (data.cart.data?.modifiers?.length > 0) {
        if (product.item?.options?.modifierPriceSum) {
          discount +=
            data.cart.data.modifiers.reduce(
              (sum, item) => sum + (item?.discount ?? 0),
              0
            ) + product.item.discount;
        } else {
          discount += data.cart.data.modifiers.reduce(
            (sum, item) => sum + (item?.discount ?? 0),
            0
          );
        }
      } else {
        discount += product.item.discount;
      }

      if (data.cart.data?.additions?.length > 0) {
        price += data.cart.data.additions.reduce(
          (sum, item) => sum + (item?.price ?? 0),
          0
        );
      }
      setPrices({ price, discount });
    }
  }, [data, product.item]);

  if (product?.loading) {
    return <Loader full />;
  }

  if (!product?.item?.id) {
    return (
      <Empty
        text={t("Такого товара нет")}
        desc={t("Возможно вы перепутали ссылку")}
        image={() => <EmptyCatalog />}
        button={
          <Link className="btn-primary" to="/">
            {t("Перейти в меню")}
          </Link>
        }
      />
    );
  }

  return (
    <main>
      <Meta
        title={
          options?.seo?.product?.title && product?.item?.title
            ? generateSeoText({
                text: options.seo.product.title,
                name: product.item.title,
                site: options?.title,
              })
            : selectedAffiliate?.title && product?.item?.title
            ? selectedAffiliate?.title + " - " + product.item.title
            : options?.title && product?.item?.title
            ? options.title + " - " + product.item.title
            : product?.item?.title ?? t("Товар")
        }
        description={
          options?.seo?.product?.description
            ? generateSeoText({
                text: options.seo.product.description,
                name: product.item.title,
                site: options?.title,
              })
            : product.item?.description ??
              t(
                "Добавьте это блюдо в корзину и наслаждайтесь вкусной едой прямо сейчас!"
              )
        }
        image={
          Array.isArray(product?.item?.medias) && product?.item?.medias[0]?.media
            ? getImageURL({
                path: sortMain(product.item.medias)[0].main,
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
              title: product?.item?.category?.title ?? t("Нет категории"),
              link: product?.item?.category?.id
                ? "/category/" + product.item.category.id
                : "/menu",
            },
            {
              title: product?.item?.title ?? t("Не названия"),
            },
          ]}
        />

        <form className="productPage mb-5">
          <Row className="gx-4 gx-xxl-5">
            <Col xs={12} md={5} lg={6}>
              {data.cart.data?.modifiers[0]?.medias[0]?.media ? (
                <img
                  src={getImageURL({
                    path: data.cart.data?.modifiers[0]?.medias[0]?.media,
                    size: "full",
                    type: "modifier",
                  })}
                  alt={product.item.title}
                  className="productPage-img"
                />
              ) : Array.isArray(product.item.medias) &&
                product.item.medias?.length > 1 ? (
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
                    {sortMain(product.item.medias).map((e) => (
                      <SwiperSlide>
                        <img
                          src={getImageURL({
                            path: e.media,
                            size: "full",
                          })}
                          alt={product.item.title}
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
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                  >
                    {sortMain(product.item.medias).map((e, index) => (
                      <SwiperSlide key={index}>
                        <LazyLoadImage
                          loading="lazy"
                          src={getImageURL({
                            path: e.media,
                            size: "full",
                          })}
                          alt={product.item.title}
                          className="productPage-img"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <LazyLoadImage
                  loading="lazy"
                  src={getImageURL({ path: product.item.medias, size: "full" })}
                  alt={product.item.title}
                  className="productPage-img"
                />
              )}
            </Col>
            <Col xs={12} md={7} lg={6}>
              <div
                className={
                  "d-flex align-items-center justify-content-between justify-content-md-start" +
                  (!product.item.options?.subtitle ? "mb-4" : "")
                }
              >
                <h1 className="mb-0">{product.item.title}</h1>

                {data.cart.data?.modifiers[0]?.energy?.weight > 0 ? (
                  <span className="text-muted fw-6 ms-3">
                    {customWeight({
                      value: data.cart.data.modifiers[0].energy.weight,
                      type: data.cart.data.modifiers[0].energy.weightType,
                    })}
                  </span>
                ) : (
                  product.item.energy.weight > 0 && (
                    <span className="text-muted fw-6 ms-3">
                      {customWeight({
                        value: product.item.energy.weight,
                        type: product.item.energy?.weightType,
                      })}
                    </span>
                  )
                )}
                {productEnergyVisible &&
                data.cart.data?.modifiers[0]?.energy?.kkal > 0 ? (
                  <OverlayTrigger
                    trigger={["hover", "focus"]}
                    className="ms-2"
                    key="bottom"
                    placement="bottom"
                    overlay={
                      <Popover id="popover-positioned-bottom">
                        <Popover.Header className="fs-09 fw-6">
                          {t("Энергетическая ценность")}
                          {Math.round(data.cart.data.modifiers[0].energy.kkal)}
                          &nbsp;
                          {t("ккал")}
                        </Popover.Header>
                        <Popover.Body>
                          <div>
                            {t("Белки")}:{" "}
                            {Math.round(
                              data.cart.data.modifiers[0].energy.protein
                            )}
                            г
                          </div>
                          <div>
                            {t("Жиры")}:{" "}
                            {Math.round(
                              data.cart.data.modifiers[0].energy.protein
                            )}
                            г
                          </div>
                          <div>
                            {t("Углеводы")}:{" "}
                            {Math.round(
                              data.cart.data.modifiers[0].energy.protein
                            )}
                            г
                          </div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <a className="ms-2">
                      <HiOutlineInformationCircle size={23} />
                    </a>
                  </OverlayTrigger>
                ) : (
                  productEnergyVisible &&
                  product.item?.energy?.kkal > 0 && (
                    <OverlayTrigger
                      trigger={["hover", "focus"]}
                      className="ms-2"
                      key="bottom"
                      placement="bottom"
                      overlay={
                        <Popover id="popover-positioned-bottom">
                          <Popover.Header className="fs-09 fw-6">
                            {t("Энергетическая ценность")}
                            {Math.round(product.item.energy.kkal)}&nbsp;
                            {t("ккал")}
                          </Popover.Header>
                          <Popover.Body>
                            <div>
                              {t("Белки")}:{" "}
                              {Math.round(product.item.energy.protein)}г
                            </div>
                            <div>
                              {t("Жиры")}:{" "}
                              {Math.round(product.item.energy.protein)}г
                            </div>
                            <div>
                              {t("Углеводы")}:{" "}
                              {Math.round(product.item.energy.protein)}г
                            </div>
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <a className="ms-2">
                        <HiOutlineInformationCircle size={23} />
                      </a>
                    </OverlayTrigger>
                  )
                )}
              </div>
              {product.item.options?.subtitle && (
                <>
                  <div className="mb-4 fw-5 fs-14 d-block main-color subtitle">
                    {product.item.options.subtitle}
                  </div>
                </>
              )}
              <div className="mb-2">
                {product.item?.tags?.length > 0 && (
                  <Tags data={product.item.tags} />
                )}
              </div>
              {data.cart.data?.modifiers[0]?.description ? (
                <div className="mb-4 white-space">
                  <p className="fw-6 mb-2">{t("Описание")}</p>
                  {data.cart.data.modifiers[0].description}
                </div>
              ) : (
                product.item.description && (
                  <div className="mb-4 white-space">
                    <p className="fw-6 mb-2">{t("Описание")}</p>
                    {product.item.description}
                  </div>
                )
              )}
              {product?.item?.modifiers?.length > 0 &&
                product.item.modifiers.map((modifier) => (
                  <>
                    {modifier.modifiers?.length > 3 ? (
                      <div className="mb-4">
                        <Select
                          data={modifier.modifiers.map((e) => ({
                            title: e.title,
                            value: e,
                          }))}
                          value={
                            data?.cart?.data?.modifiers?.find((modifierItem) =>
                              modifier.modifiers.some(
                                (cartModifier) =>
                                  cartModifier.categoryId ===
                                  modifierItem.categoryId
                              )
                            ) || null
                          }
                          onClick={(e) => {
                            let newData = { ...data };
                            let isModifierIndex =
                              newData.cart.data.modifiers.findIndex(
                                (item) =>
                                  item?.categoryId === e.value.categoryId ||
                                  item?.categoryId === 0
                              );
                            if (isModifierIndex != -1) {
                              newData.cart.data.modifiers[isModifierIndex] =
                                e.value;
                            } else {
                              newData.cart.data.modifiers.push(e.value);
                            }
                            setData(newData);
                          }}
                        />
                      </div>
                    ) : (
                      modifier?.modifiers?.length > 0 && (
                        <div className="d-xxl-flex mb-4">
                          <ul className="inputGroup d-flex w-100">
                            {modifier.modifiers.map((e, index) => (
                              <li className="d-flex text-center w-100">
                                <label>
                                  <input
                                    type="radio"
                                    name={e.categoryId ?? 0}
                                    defaultChecked={index === 0}
                                    onChange={() => {
                                      let newData = { ...data };
                                      let isModifierIndex =
                                        newData.cart.data.modifiers.findIndex(
                                          (item) =>
                                            item?.categoryId === e.categoryId ||
                                            item?.categoryId === 0
                                        );
                                      if (isModifierIndex != -1) {
                                        newData.cart.data.modifiers[
                                          isModifierIndex
                                        ] = e;
                                      } else {
                                        newData.cart.data.modifiers.push(e);
                                      }
                                      setData(newData);
                                    }}
                                  />
                                  <div className="text">{e.title}</div>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </>
                ))}
              {product.item.options?.сompound && (
                <>
                  <p className="fw-6 mb-2">{t("Состав")}</p>
                  <div className="mb-4 text-muted fs-09 white-space">
                    {product.item.options.сompound}
                  </div>
                </>
              )}
              <div className="productPage-price">
                <div className="py-2 fw-5 me-4 fs-12 rounded-pill">
                  {customPrice(prices.price)}
                  {prices.discount > 0 && (
                    <div className="fs-08 text-muted text-decoration-line-through">
                      {customPrice(prices.discount)}
                    </div>
                  )}
                </div>
                <ButtonCart
                  full
                  product={product.item}
                  data={data}
                  className="py-2"
                >
                  <span className="fw-4">{t("В корзину")}</span>
                  <HiOutlineShoppingBag className="fs-12 ms-2" />
                </ButtonCart>
              </div>

              {(product?.item?.additions?.length > 0 ||
                product?.item?.wishes?.length > 0) && (
                <div className="mt-5">
                  {/* <h6>Изменить по вкусу</h6> */}
                  <div className="productPage-edit mb-3">
                    <div className="top">
                      {product.item?.additions?.length > 0 && (
                        <button
                          type="button"
                          className={isRemove ? "" : "active"}
                          onClick={() => setIsRemove(false)}
                        >
                          <HiPlus />
                          <span>{t("Добавить")}</span>
                          <Corner className="corner-right" />
                        </button>
                      )}
                      {product.item?.wishes?.length > 0 && (
                        <button
                          type="button"
                          className={
                            isRemove
                              ? "active"
                              : product.item?.additions?.length === 0
                              ? "active"
                              : ""
                          }
                          onClick={() => setIsRemove(true)}
                        >
                          <HiMinus />
                          <span>{t("Убрать")}</span>
                          {product.item?.additions?.length > 0 && (
                            <Corner className="corner-left" />
                          )}
                          <Corner className="corner-right" />
                        </button>
                      )}
                    </div>
                    <div className="box bg-gray">
                      <Row
                        sm={3}
                        lg={3}
                        xl={4}
                        className={isRemove ? "d-none" : "d-flex"}
                      >
                        {product.item?.additions?.length > 0 &&
                          product.item.additions.map((e) => {
                            const isAddition = () =>
                              !!data?.cart?.data?.additions.find(
                                (addition) => addition.id === e.id
                              );
                            const onPressAddition = () => {
                              if (isAddition()) {
                                let newAdditions =
                                  data.cart.data.additions.filter(
                                    (addition) => addition.id != e.id
                                  );
                                let newData = { ...data };
                                newData.cart.data.additions = newAdditions;
                                setData(newData);
                              } else {
                                let newData = { ...data };
                                newData.cart.data.additions.push(e);
                                setData(newData);
                              }
                            };
                            return (
                              <Col>
                                <Addition
                                  key={e.id}
                                  data={e}
                                  active={isAddition()}
                                  onChange={onPressAddition}
                                />
                              </Col>
                            );
                          })}
                      </Row>
                      <ul
                        className={
                          isRemove
                            ? "d-block"
                            : product.item?.wishes?.length === 0
                            ? "d-block"
                            : "d-none"
                        }
                      >
                        {product.item?.wishes?.length > 0 &&
                          product.item.wishes.map((e) => {
                            const isAddition = () =>
                              !!data?.cart?.data?.wishes.find(
                                (addition) => addition.id === e.id
                              );
                            const onPressAddition = () => {
                              if (isAddition()) {
                                let newAdditions = data.cart.data.wishes.filter(
                                  (addition) => addition.id != e.id
                                );
                                let newData = { ...data };
                                newData.cart.data.wishes = newAdditions;
                                setData(newData);
                              } else {
                                let newData = { ...data };
                                newData.cart.data.wishes.push(e);
                                setData(newData);
                              }
                            };
                            return (
                              <li>
                                <Wish
                                  data={e}
                                  active={isAddition()}
                                  onChange={onPressAddition}
                                />
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </form>
        {product?.item?.recommends?.length > 0 && (
          <section className="d-none d-md-block mb-5">
            <h2>{t("Вам может понравится")}</h2>
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
              {product.item.recommends.map((e) => (
                <SwiperSlide key={e.id}>
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
