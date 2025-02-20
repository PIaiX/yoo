import React, { useCallback, useLayoutEffect, useState } from "react";
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
  groupByCategoryIdToArray,
  sortMain,
} from "../helpers/all";
import { getProduct } from "../services/product";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Notice from "../components/Notice";

const Product = () => {
  const { t } = useTranslation();
  const { productId } = useParams();

  const options = useSelector((state) => state.settings.options);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const [isRemove, setIsRemove] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [product, setProduct] = useState({
    loading: true,
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

  const onLoad = useCallback(() => {
    getProduct({
      id: productId,
      affiliateId: selectedAffiliate?.id ?? false,
      required: true,
      multiBrand: options?.multiBrand,
      type: "site",
    })
      .then((res) => {
        const modifiers =
          options?.brand?.options?.priceAffiliateType &&
          Array.isArray(res.modifiers) &&
          res?.modifiers?.length > 0
            ? groupByCategoryIdToArray(
                res.modifiers.filter((e) => e?.modifierOptions?.length > 0)
              )
            : Array.isArray(res.modifiers) && res?.modifiers?.length > 0
            ? groupByCategoryIdToArray(res.modifiers)
            : [];

        const recommends =
          options?.brand?.options?.priceAffiliateType &&
          Array.isArray(res.recommends) &&
          res?.recommends?.length > 0
            ? res.recommends.filter(
                (e) => productId != e.id && e?.productOptions?.length > 0
              )
            : Array.isArray(res.recommends) && res?.recommends?.length > 0
            ? res.recommends.filter((e) => productId != e.id)
            : [];

        setProduct({
          loading: false,
          ...res,
          modifiers: modifiers,
          recommends: recommends,
          cart: {
            data: {
              modifiers:
                modifiers?.length > 0
                  ? modifiers.map((e) => e.modifiers[0])
                  : [],
              additions: [],
              wishes: [],
            },
          },
        });
      })
      .catch(() => setProduct((data) => ({ ...data, loading: false })));
  }, [options, productId, selectedAffiliate]);

  useLayoutEffect(() => {
    onLoad();
  }, [productId, selectedAffiliate]);

  useLayoutEffect(() => {
    if (product?.id) {
      let price = 0;
      let discount = 0;
      if (product?.cart?.data?.modifiers?.length > 0) {
        if (product?.options?.modifierPriceSum) {
          price +=
            product.cart.data.modifiers.reduce(
              (sum, item) => sum + (item?.price ?? 0),
              0
            ) + product.price;
        } else {
          price += product.cart.data.modifiers.reduce(
            (sum, item) => sum + (item?.price ?? 0),
            0
          );
        }
      } else {
        price += product.price;
      }

      if (product?.cart?.data?.modifiers?.length > 0) {
        if (product?.options?.modifierPriceSum) {
          discount +=
            product.cart.data.modifiers.reduce(
              (sum, item) => sum + (item?.discount ?? 0),
              0
            ) + product.discount;
        } else {
          discount += product.cart.data.modifiers.reduce(
            (sum, item) => sum + (item?.discount ?? 0),
            0
          );
        }
      } else {
        discount += product.discount;
      }

      if (product?.cart?.data?.additions?.length > 0) {
        price += product.cart.data.additions.reduce(
          (sum, item) => sum + (item?.price ?? 0),
          0
        );
      }
      setPrices({ price, discount });
    }
  }, [product]);

  if (product?.loading) {
    return <Loader full />;
  }

  if (!product?.id) {
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
          options?.seo?.product?.title && product?.title
            ? generateSeoText({
                text: options.seo.product.title,
                name: product.title,
                site: options?.title,
              })
            : selectedAffiliate?.title && product?.title
            ? selectedAffiliate?.title + " - " + product.title
            : options?.title && product?.title
            ? options.title + " - " + product.title
            : product?.title ?? t("Товар")
        }
        description={
          options?.seo?.product?.description
            ? generateSeoText({
                text: options.seo.product.description,
                name: product.title,
                site: options?.title,
              })
            : product?.description ??
              t(
                "Добавьте это блюдо в корзину и наслаждайтесь вкусной едой прямо сейчас!"
              )
        }
        image={
          Array.isArray(product?.medias) && product?.medias[0]?.media
            ? getImageURL({
                path: sortMain(product.medias)[0].main,
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
              title: product?.category?.title ?? t("Нет категории"),
              link: product?.category?.id
                ? "/category/" + product.category.id
                : "/menu",
            },
            {
              title: product?.title ?? t("Не названия"),
            },
          ]}
        />

        <form className="productPage mb-5">
          <Row className="gx-4 gx-xxl-5">
            <Col xs={12} md={5} lg={6}>
              {product?.cart?.data?.modifiers[0]?.medias[0]?.media &&
              product?.medias?.length === 1 ? (
                <LazyLoadImage
                  loading="lazy"
                  src={getImageURL({
                    path: product.cart.data?.modifiers[0]?.medias[0]?.media,
                    size: "full",
                    type: "modifier",
                  })}
                  alt={product.title}
                  className="productPage-img"
                />
              ) : Array.isArray(product?.medias) &&
                product.medias?.length > 1 ? (
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
                    {sortMain(product.medias).map((e) => (
                      <SwiperSlide>
                        <img
                          src={getImageURL({
                            path: e.media,
                            size: "full",
                          })}
                          alt={product.title}
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
                    {sortMain(product.medias).map((e, index) => (
                      <SwiperSlide key={index}>
                        <LazyLoadImage
                          loading="lazy"
                          src={getImageURL({
                            path: e.media,
                            size: "full",
                          })}
                          alt={product.title}
                          className="productPage-img"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <LazyLoadImage
                  loading="lazy"
                  src={getImageURL({ path: product.medias, size: "full" })}
                  alt={product.title}
                  className="productPage-img"
                />
              )}
            </Col>
            <Col xs={12} md={7} lg={6}>
              <div
                className={
                  "d-flex align-items-center justify-content-between" +
                  (!product.options?.subtitle ? " mb-4" : "")
                }
              >
                <h1 className="mb-0">{product.title}</h1>

                {options?.productEnergyVisible &&
                product?.cart?.data?.modifiers[0]?.energy?.kkal > 0 ? (
                  <OverlayTrigger
                    trigger={["focus", "click"]}
                    rootClose
                    className="ms-2"
                    key="bottom"
                    placement="bottom"
                    overlay={
                      <Popover id="popover-positioned-bottom">
                        <Popover.Header className="fs-09 fw-6">
                          {t("Пищевая ценность")}
                        </Popover.Header>
                        <Popover.Body style={{ width: 250 }}>
                          <div className="d-flex mb-1 fs-09 justify-content-between">
                            <div>{t("Энерг. ценность")}</div>
                            <div>
                              {Math.round(
                                product.cart.data.modifiers[0].energy.kkal ??
                                  product.cart.data.modifiers[0].energy.kkalAll
                              )}
                              &nbsp;
                              {t("ккал")}
                            </div>
                          </div>
                          <div className="d-flex mb-1 fs-09 justify-content-between">
                            <div>{t("Белки")}</div>
                            <div>
                              {Math.round(
                                product.cart.data.modifiers[0].energy.protein
                              )}
                              г
                            </div>
                          </div>
                          <div className="d-flex mb-1 fs-09 justify-content-between">
                            <div>{t("Жиры")}</div>
                            <div>
                              {Math.round(
                                product.cart.data.modifiers[0].energy.fat
                              )}
                              г
                            </div>
                          </div>
                          <div className="d-flex mb-1 fs-09 justify-content-between">
                            <div>{t("Углеводы")}</div>
                            <div>
                              {Math.round(
                                product.cart.data.modifiers[0].energy
                                  .carbohydrate
                              )}
                              г
                            </div>
                          </div>
                          <div className="d-flex mt-2 fs-09 justify-content-between">
                            <div>{t("Вес")}</div>
                            <div>
                              {Math.round(
                                product.cart.data.modifiers[0].energy.weight
                              )}
                              г
                            </div>
                          </div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <a className="ms-2">
                      <HiOutlineInformationCircle size={25} />
                    </a>
                  </OverlayTrigger>
                ) : (
                  options?.productEnergyVisible &&
                  (product?.energy?.kkal > 0 || product?.energy?.kkalAll) && (
                    <OverlayTrigger
                      trigger={["focus", "click"]}
                      rootClose
                      className="ms-2"
                      key="bottom"
                      placement="bottom"
                      overlay={
                        <Popover id="popover-positioned-bottom">
                          <Popover.Header className="fs-09 fw-6">
                            {t("Пищевая ценность")}
                          </Popover.Header>
                          <Popover.Body style={{ width: 250 }}>
                            <div className="d-flex mb-1 fs-09 justify-content-between">
                              <div>{t("Энерг. ценность")}</div>
                              <div>
                                {Math.round(
                                  product.energy.kkal ?? product.energy.kkalAll
                                )}
                                &nbsp;
                                {t("ккал")}
                              </div>
                            </div>
                            <div className="d-flex mb-1 fs-09 justify-content-between">
                              <div>{t("Белки")}</div>
                              <div>{Math.round(product.energy.protein)}г</div>
                            </div>
                            <div className="d-flex mb-1 fs-09 justify-content-between">
                              <div>{t("Жиры")}</div>
                              <div>{Math.round(product.energy.fat)}г</div>
                            </div>
                            <div className="d-flex mb-1 fs-09 justify-content-between">
                              <div>{t("Углеводы")}</div>
                              <div>
                                {Math.round(product.energy.carbohydrate)}г
                              </div>
                            </div>
                            <div className="d-flex mt-2 fs-09 justify-content-between">
                              <div>{t("Вес")}</div>
                              <div>{Math.round(product.energy.weight)}г</div>
                            </div>
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <a className="ms-2">
                        <HiOutlineInformationCircle size={25} />
                      </a>
                    </OverlayTrigger>
                  )
                )}
              </div>
              {product?.options?.subtitle && (
                <>
                  <div className="mb-4 fw-5 fs-14 d-block main-color subtitle">
                    {product.options.subtitle}
                  </div>
                </>
              )}
              <div className="mb-2">
                {product?.tags?.length > 0 && <Tags data={product.tags} />}
              </div>
              {product?.cart?.data?.modifiers[0]?.description ? (
                <div className="mb-4 white-space">
                  {product.cart.data.modifiers[0].description}
                </div>
              ) : (
                product.description && (
                  <div className="mb-4 white-space">{product.description}</div>
                )
              )}
              {product?.modifiers?.length > 0 &&
                product.modifiers.map((modifier) => (
                  <>
                    {modifier.modifiers?.length > 3 ? (
                      <div className="mb-4">
                        <Select
                          data={modifier.modifiers.map((e) => ({
                            title: e.title,
                            value: e,
                          }))}
                          value={
                            product?.cart?.data?.modifiers?.find(
                              (modifierItem) =>
                                modifier.modifiers.some(
                                  (cartModifier) =>
                                    cartModifier.categoryId ===
                                    modifierItem.categoryId
                                )
                            ) || null
                          }
                          onChange={() => {
                            // Создаем копию массива modifiers
                            const updatedModifiers = [
                              ...product.cart.data.modifiers,
                            ];

                            // Ищем индекс модификатора
                            const isModifierIndex = updatedModifiers.findIndex(
                              (item) =>
                                item?.categoryId === e.categoryId ||
                                item?.categoryId === 0
                            );

                            // Обновляем или добавляем модификатор
                            if (isModifierIndex !== -1) {
                              updatedModifiers[isModifierIndex] = e; // Заменяем модификатор
                            } else {
                              updatedModifiers.push(e); // Добавляем новый модификатор
                            }

                            // Обновляем состояние иммутабельно
                            setProduct((prevProduct) => ({
                              ...prevProduct,
                              cart: {
                                ...prevProduct.cart,
                                data: {
                                  ...prevProduct.cart.data,
                                  modifiers: updatedModifiers, // Обновляем modifiers
                                },
                              },
                            }));
                          }}
                        />
                      </div>
                    ) : (
                      modifier?.modifiers?.length > 0 && (
                        <div className="d-xxl-flex mb-4">
                          <ul className="inputGroup d-flex w-100">
                            {modifier.modifiers.map((e, index) => (
                              <li
                                key={e.id}
                                className="d-flex text-center w-100"
                              >
                                <label>
                                  <input
                                    type="radio"
                                    name={e.categoryId ?? 0}
                                    defaultChecked={index === 0}
                                    onChange={() => {
                                      // Создаем копию массива modifiers
                                      const updatedModifiers = [
                                        ...product.cart.data.modifiers,
                                      ];

                                      // Ищем индекс модификатора
                                      const isModifierIndex =
                                        updatedModifiers.findIndex(
                                          (item) =>
                                            item?.categoryId === e.categoryId ||
                                            item?.categoryId === 0
                                        );

                                      // Обновляем или добавляем модификатор
                                      if (isModifierIndex !== -1) {
                                        updatedModifiers[isModifierIndex] = e; // Заменяем модификатор
                                      } else {
                                        updatedModifiers.push(e); // Добавляем новый модификатор
                                      }

                                      // Обновляем состояние иммутабельно
                                      setProduct((prevProduct) => ({
                                        ...prevProduct,
                                        cart: {
                                          ...prevProduct.cart,
                                          data: {
                                            ...prevProduct.cart.data,
                                            modifiers: updatedModifiers, // Обновляем modifiers
                                          },
                                        },
                                      }));
                                    }}
                                  />
                                  <div className="text d-flex flex-row justify-content-center">
                                    <div className="line-height-100">
                                      {e.title}
                                    </div>
                                    {e?.energy?.weight > 0 &&
                                      options?.productVisibleModifierWeight && (
                                        <div className="text-muted fw-4 ms-1 line-height-100">
                                          /{" "}
                                          {customWeight({
                                            value: e.energy.weight,
                                            type: e.energy?.weightType,
                                          })}
                                        </div>
                                      )}
                                  </div>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </>
                ))}
              {product?.options?.сompound && (
                <>
                  <p className="fw-6 mb-2">{t("Состав")}</p>
                  <div className="mb-4 text-muted fs-09 white-space">
                    {product.options.сompound}
                  </div>
                </>
              )}
              <div className="productPage-price">
                <div className="py-2 fw-5 me-2 fs-12 rounded-pill">
                  {customPrice(prices.price)}
                  {prices.discount > 0 && (
                    <div className="fs-08 text-muted text-decoration-line-through">
                      {customPrice(prices.discount)}
                    </div>
                  )}
                </div>
                {product?.cart?.data?.modifiers[0]?.energy?.weight > 0 ? (
                  <div className="text-muted py-2 me-2 fw-4 fs-09">
                    {"/ "}
                    {options?.productWeightDiscrepancy ? "±" : ""}
                    {customWeight({
                      value: product.cart.data.modifiers[0].energy.weight,
                      type: product.cart.data.modifiers[0].energy.weightType,
                    })}
                  </div>
                ) : (
                  product?.energy?.weight > 0 && (
                    <div className="text-muted py-2 me-2 fw-4 fs-09">
                      {"/ "}
                      {options?.productWeightDiscrepancy ? "±" : ""}
                      {customWeight({
                        value: product.energy.weight,
                        type: product.energy?.weightType,
                      })}
                    </div>
                  )
                )}
                <ButtonCart
                  full
                  product={product}
                  strict={true}
                  className="py-2 ms-2 btn-lg"
                >
                  {t("В корзину")}
                  <HiOutlineShoppingBag className="fs-13 ms-2" />
                </ButtonCart>
              </div>

              {(product?.additions?.length > 0 ||
                product?.wishes?.length > 0) && (
                <div className="mt-5">
                  <div className="productPage-edit mb-3">
                    <div className="top">
                      {product?.additions?.length > 0 && (
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
                      {product?.wishes?.length > 0 && (
                        <button
                          type="button"
                          className={
                            isRemove
                              ? "active"
                              : product?.additions?.length === 0
                              ? "active"
                              : ""
                          }
                          onClick={() => setIsRemove(true)}
                        >
                          <HiMinus />
                          <span>{t("Убрать")}</span>
                          {product?.additions?.length > 0 && (
                            <Corner className="corner-left" />
                          )}
                          <Corner className="corner-right" />
                        </button>
                      )}
                    </div>
                    <div className="box bg-gray">
                      <Row
                        xs={3}
                        sm={3}
                        lg={3}
                        xl={4}
                        className={isRemove ? "d-none gx-3" : "gx-3 d-flex"}
                      >
                        {product?.additions?.length > 0 &&
                          product.additions.map((e) => {
                            const isAddition = () =>
                              !!product?.cart?.data?.additions?.find(
                                (addition) => addition.id === e.id
                              );
                            const onPressAddition = () => {
                              if (isAddition()) {
                                setProduct((prev) => ({
                                  ...prev,
                                  cart: {
                                    data: {
                                      ...prev.cart.data,
                                      additions:
                                        product.cart.data.additions.filter(
                                          (addition) => addition.id != e.id
                                        ),
                                    },
                                  },
                                }));
                              } else {
                                setProduct((prev) => ({
                                  ...prev,
                                  cart: {
                                    data: {
                                      ...prev.cart.data,
                                      additions: [
                                        ...prev.cart.data.additions,
                                        e,
                                      ],
                                    },
                                  },
                                }));
                              }
                            };
                            return (
                              <Col key={e.id}>
                                <Addition
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
                            : product?.wishes?.length === 0
                            ? "d-block"
                            : "d-none"
                        }
                      >
                        {product?.wishes?.length > 0 &&
                          product.wishes.map((e) => {
                            const isAddition = () =>
                              !!product?.cart?.data?.wishes.find(
                                (addition) => addition.id === e.id
                              );
                            const onPressAddition = () => {
                              if (isAddition()) {
                                let newAdditions =
                                  product.cart.data.wishes.filter(
                                    (addition) => addition.id != e.id
                                  );

                                product.cart.data.wishes = newAdditions;
                                setProduct(product);
                              } else {
                                product.cart.data.wishes.push(e);
                                setProduct(product);
                              }
                            };
                            return (
                              <li key={e.id}>
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
              {options?.productNotice && (
                <Notice className="mt-4" text={options?.productNoticeText} />
              )}
            </Col>
          </Row>
        </form>
        {product?.recommends?.length > 0 && (
          <section className="d-none d-md-block mb-5">
            <h2>{t("Вам может понравиться")}</h2>
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
              {product.recommends.map((e) => (
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
