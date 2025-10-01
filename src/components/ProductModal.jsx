import React, { useCallback, useLayoutEffect, useState } from "react";
import { Col, OverlayTrigger, Popover, Row } from "react-bootstrap";
// import Notice from "../components/Notice";
// import ProductCard from "./ProductCard";
import Corner from "./svgs/Corner";
import Addition from "./utils/Addition";
import Wish from "./utils/Wish";
// swiper
import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
  HiMinus,
  HiOutlineInformationCircle,
  HiOutlineShoppingBag,
  HiPlus,
} from "react-icons/hi2";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FreeMode, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  customPrice,
  customWeight,
  generateSeoText,
  getImageURL,
  groupByCategoryIdToArray,
  sortMain,
} from "../helpers/all";
import { getProduct } from "../services/product";
import ButtonCartProductModal from "./ButtonCartProductModal";
import Empty from "./Empty";
import EmptyCatalog from "./empty/catalog";
import Meta from "./Meta";
import Notice from "./Notice";
import Tags from "./Tags";
import Loader from "./utils/Loader";
import Select from "./utils/Select";

const ProductModal = memo((data) => {
  const { t } = useTranslation();
  const { productId = data?.id } = useParams();

  const options = useSelector((state) => state.settings.options);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const [isRemove, setIsRemove] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const modifiersData =
    options?.brand?.options?.priceAffiliateType &&
    Array.isArray(data.modifiers) &&
    data?.modifiers?.length > 0
      ? groupByCategoryIdToArray(
          data.modifiers.filter((e) => e?.modifierOptions?.length > 0)
        )
      : Array.isArray(data.modifiers) && data?.modifiers?.length > 0
      ? groupByCategoryIdToArray(data.modifiers)
      : [];
  const [product, setProduct] = useState({
    loading: true,
    ...data,
    modifiers: modifiersData,
    cart: {
      modifiers:
        modifiersData?.length > 0
          ? modifiersData.map((group) => {
              // Ищем модификатор с main: true
              const mainModifier = group.modifiers.find((m) => m.main === true);
              // Если не нашли, берем первый модификатор
              return mainModifier || group.modifiers[0];
            })
          : [],
      additions: [],
      wishes: [],
    },
  });

  const [prices, setPrices] = useState({
    price: 0,
    discount: 0,
  });

  const onLoad = useCallback(() => {
    window.history.replaceState(
      null,
      null,
      window.location.origin + "/product/" + productId
    );

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

        // const recommends =
        //   options?.brand?.options?.priceAffiliateType &&
        //   Array.isArray(res.recommends) &&
        //   res?.recommends?.length > 0
        //     ? res.recommends.filter(
        //         (e) => productId != e.id && e?.productOptions?.length > 0
        //       )
        //     : Array.isArray(res.recommends) && res?.recommends?.length > 0
        //     ? res.recommends.filter((e) => productId != e.id)
        //     : [];
        let productData = {
          loading: false,
          ...res,
          modifiers: modifiers,
          // recommends: recommends,
          cart: {
            modifiers:
              modifiers?.length > 0
                ? modifiers.map((group) => {
                    // Ищем модификатор с main: true
                    const mainModifier = group.modifiers.find(
                      (m) => m.main === true
                    );
                    // Если не нашли, берем первый модификатор
                    return mainModifier || group.modifiers[0];
                  })
                : [],
            additions: [],
            wishes: [],
          },
        };
        setProduct(productData);

        if (data?.onLoad) {
          data.onLoad(productData);
        }
      })
      .catch(() => setProduct((data) => ({ ...data, loading: false })));
  }, [options, data, productId, selectedAffiliate]);

  useLayoutEffect(() => {
    onLoad();
  }, [productId, selectedAffiliate]);

  useLayoutEffect(() => {
    if (product?.id) {
      let price = 0;
      let discount = 0;
      if (product?.cart?.modifiers?.length > 0) {
        if (product?.options?.modifierPriceSum) {
          price +=
            product.cart.modifiers.reduce(
              (sum, item) => sum + (item?.price ?? 0),
              0
            ) + product.price;
        } else {
          price += product.cart.modifiers.reduce(
            (sum, item) => sum + (item?.price ?? 0),
            0
          );
        }
      } else {
        price += product.price;
      }

      if (product?.cart?.modifiers?.length > 0) {
        if (product?.options?.modifierPriceSum) {
          discount +=
            product.cart.modifiers.reduce(
              (sum, item) => sum + (item?.discount ?? 0),
              0
            ) + product.discount;
        } else {
          discount += product.cart.modifiers.reduce(
            (sum, item) => sum + (item?.discount ?? 0),
            0
          );
        }
      } else {
        discount += product.discount;
      }

      if (product?.cart?.additions?.length > 0) {
        price += product.cart.additions.reduce(
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
    <>
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

      <Row className="gx-4 h-100">
        <Col xs={12} md={5} lg={6}>
          <div className="productPage-content">
            {product?.cart?.modifiers[0]?.medias[0]?.media &&
            product?.medias?.length === 1 ? (
              <LazyLoadImage
                loading="lazy"
                src={getImageURL({
                  path: product.cart?.modifiers[0]?.medias[0]?.media,
                  size: "full",
                  type: "modifier",
                })}
                alt={product.title}
                className="productPage-img-modal"
              />
            ) : Array.isArray(product?.medias) && product.medias?.length > 1 ? (
              <div className="productPage-photo productPage-photo-modal">
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
                        className="productPage-img-modal"
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
                        className="productPage-img-modal"
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
                className="productPage-img-modal"
              />
            )}
          </div>
        </Col>
        <Col xs={12} md={7} lg={6}>
          <div
            className="d-flex flex-column justify-content-between h-100"
            style={{ minHeight: 565 }}
          >
            <div className="pt-2 h-100">
              <div
                className={
                  "d-flex align-items-center justify-content-between" +
                  (!product.options?.subtitle ? " mb-2" : "")
                }
              >
                <h1 className="mb-0">
                  {product.title}
                  {options?.productEnergyVisible &&
                  product?.cart?.modifiers[0]?.energy?.kkal > 0 ? (
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
                                  product.cart.modifiers[0].energy.kkal ??
                                    product.cart.modifiers[0].energy.kkalAll
                                )}
                                &nbsp;
                                {t("ккал")}
                              </div>
                            </div>
                            <div className="d-flex mb-1 fs-09 justify-content-between">
                              <div>{t("Белки")}</div>
                              <div>
                                {Math.round(
                                  product.cart.modifiers[0].energy.protein
                                )}
                                г
                              </div>
                            </div>
                            <div className="d-flex mb-1 fs-09 justify-content-between">
                              <div>{t("Жиры")}</div>
                              <div>
                                {Math.round(
                                  product.cart.modifiers[0].energy.fat
                                )}
                                г
                              </div>
                            </div>
                            <div className="d-flex mb-1 fs-09 justify-content-between">
                              <div>{t("Углеводы")}</div>
                              <div>
                                {Math.round(
                                  product.cart.modifiers[0].energy.carbohydrate
                                )}
                                г
                              </div>
                            </div>
                            <div className="d-flex mt-2 fs-09 justify-content-between">
                              <div>{t("Вес")}</div>
                              <div>
                                {Math.round(
                                  product.cart.modifiers[0].energy.weight
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
                                    product.energy.kkal ??
                                      product.energy.kkalAll
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
                </h1>
              </div>
              {product?.options?.subtitle && (
                <>
                  <div className="mb-3 fw-5 fs-14 d-block main-color subtitle">
                    {product.options.subtitle}
                  </div>
                </>
              )}
              {product?.productOptions?.[0]?.title && (
                <>
                  <div className="mb-3 fw-5 fs-14 d-block main-color">
                    {product.productOptions[0].title}
                  </div>
                </>
              )}
              {product?.tags?.length > 0 && (
                <div className="mb-2">
                  <Tags data={product.tags} />
                </div>
              )}
              {product?.cart?.modifiers[0]?.description ? (
                <div className="mb-3 white-space">
                  {product.cart.modifiers[0].description}
                </div>
              ) : (
                product.description && (
                  <div className="mb-3 white-space">{product.description}</div>
                )
              )}
              {product?.modifiers?.length > 0 &&
                product.modifiers.map((modifier) => (
                  <>
                    {modifier.modifiers?.length > 3 ? (
                      <div className="mb-3">
                        <Select
                          data={modifier.modifiers.map((e) => ({
                            title: e.title,
                            value: e,
                          }))}
                          value={
                            product?.cart?.modifiers?.find((modifierItem) =>
                              modifier.modifiers.some(
                                (cartModifier) =>
                                  cartModifier.categoryId ===
                                  modifierItem.categoryId
                              )
                            ) || null
                          }
                          onClick={(e) => {
                            // Создаем копию массива modifiers
                            const updatedModifiers = [
                              ...product.cart.modifiers,
                            ];

                            // Ищем индекс модификатора
                            const isModifierIndex = updatedModifiers.findIndex(
                              (item) =>
                                item?.categoryId === e.value.categoryId ||
                                item?.categoryId === 0
                            );

                            // Обновляем или добавляем модификатор
                            if (isModifierIndex !== -1) {
                              updatedModifiers[isModifierIndex] = e.value; // Заменяем модификатор
                            } else {
                              updatedModifiers.push(e.value); // Добавляем новый модификатор
                            }

                            // Обновляем состояние иммутабельно
                            setProduct((prevProduct) => ({
                              ...prevProduct,
                              cart: {
                                ...prevProduct.cart,
                                modifiers: updatedModifiers, // Обновляем modifiers
                              },
                            }));
                          }}
                        />
                      </div>
                    ) : (
                      modifier?.modifiers?.length > 0 && (
                        <div className="d-xxl-flex mb-3">
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
                                    defaultChecked={
                                      !!product?.cart?.modifiers?.find(
                                        (modifierItem) =>
                                          modifierItem.id === e.id
                                      ) || index === 0
                                    }
                                    onClick={() => {
                                      // Создаем копию массива modifiers
                                      const updatedModifiers = [
                                        ...product.cart.modifiers,
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
                                          modifiers: updatedModifiers, // Обновляем modifiers
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
                  <div className="mb-3 text-muted fs-09 white-space">
                    {product.options.сompound}
                  </div>
                </>
              )}

              {(product?.additions?.length > 0 ||
                product?.wishes?.length > 0) && (
                <div>
                  <div className="productPage-edit mb-0">
                    <div className="top">
                      {product?.additions?.length > 0 && (
                        <button
                          draggable={false}
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
                          draggable={false}
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
                            const isAddition = !!product?.cart?.additions?.find(
                              (addition) => addition.id === e.id
                            );
                            const onPressAddition = () => {
                              if (isAddition) {
                                setProduct((prevProduct) => ({
                                  ...prevProduct,
                                  cart: {
                                    ...prevProduct.cart,
                                    additions: product.cart.additions.filter(
                                      (addition) => addition.id != e.id
                                    ),
                                  },
                                }));
                              } else {
                                setProduct((prevProduct) => ({
                                  ...prevProduct,
                                  cart: {
                                    ...prevProduct.cart,
                                    additions: [
                                      ...prevProduct.cart.additions,
                                      e,
                                    ],
                                  },
                                }));
                              }
                            };
                            return (
                              <Col key={e.id}>
                                <Addition
                                  data={e}
                                  active={isAddition}
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
                            const isAddition = !!product?.cart?.wishes.find(
                              (addition) => addition.id === e.id
                            );
                            const onPressAddition = () => {
                              if (isAddition) {
                                let newAdditions = product.cart.wishes.filter(
                                  (addition) => addition.id != e.id
                                );

                                product.cart.wishes = newAdditions;
                                setProduct(product);
                              } else {
                                product.cart.wishes.push(e);
                                setProduct(product);
                              }
                            };
                            return (
                              <li key={e.id}>
                                <Wish
                                  data={e}
                                  active={isAddition}
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
            </div>
            <div className="position-sticky bottom-0 fixed-price-product productPage-price">
              <div className="py-2 fw-5 me-2 fs-12 rounded-pill">
                {customPrice(prices.price)}
                {prices.discount > 0 && (
                  <div className="fs-08 text-muted text-decoration-line-through">
                    {customPrice(prices.discount)}
                  </div>
                )}
              </div>
              {product?.cart?.modifiers[0]?.energy?.weight > 0 ? (
                <div className="text-muted py-2 me-2 fw-4 fs-09">
                  /&nbsp;
                  {options?.productWeightDiscrepancy ? "±" : ""}
                  {customWeight({
                    value: product.cart.modifiers[0].energy.weight,
                    type: product.cart.modifiers[0].energy.weightType,
                  })}
                </div>
              ) : (
                product?.energy?.weight > 0 && (
                  <div className="text-muted py-2 me-2 fw-4 fs-09">
                    /&nbsp;
                    {options?.productWeightDiscrepancy ? "±" : ""}
                    {customWeight({
                      value: product.energy.weight,
                      type: product.energy?.weightType,
                    })}
                  </div>
                )
              )}
              <ButtonCartProductModal
                product={product}
                className="py-2 ms-2 btn-lg w-100"
                onExit={data.onExit}
              >
                {t("В корзину")}
                <HiOutlineShoppingBag className="fs-13 ms-2" />
              </ButtonCartProductModal>
            </div>
          </div>
        </Col>
      </Row>

      {/* {product?.recommends?.length > 0 && (
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
        )} */}
    </>
  );
});

export default ProductModal;
