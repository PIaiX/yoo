import React, { useCallback, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import NavTop from "../components/utils/NavTop";
import Gifts from "../components/utils/Gifts";
import { useForm, useWatch } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import Empty from "../components/Empty";
import EmptyCart from "../components/empty/cart";
import Meta from "../components/Meta";
import Input from "../components/utils/Input";
import { customPrice, declination, getCount } from "../helpers/all";
import { useTotalCart } from "../hooks/useCart";
import { deleteCart, getCart } from "../services/cart";
import { isPromo } from "../services/promo";
import {
  cartDeleteGifts,
  cartDeleteProduct,
  cartDeletePromo,
  cartPromo,
  createPromoProduct,
  updateCartAll,
  updateCartChecking,
} from "../store/reducers/cartSlice";
import { IoTrashOutline } from "react-icons/io5";
import Loader from "../components/utils/Loader";
import Extras from "../components/utils/Extras";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import ButtonClose from "../components/utils/ButtonClose";

const Cart = () => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const promo = useSelector((state) => state.cart.promo);
  const pointSwitch = useSelector((state) => state.checkout?.data?.pointSwitch);
  const address = useSelector((state) => state.address.items);
  const options = useSelector((state) => state.settings.options);
  const [data, setData] = useState({ loading: true });
  const checkout = useSelector((state) => state.checkout);
  const selectedAffiliate = useSelector((state) => state.affiliate?.active);
  const [isGift, setIsGift] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const {
    total = 0,
    totalNoDelivery = 0,
    price = 0,
    discount = 0,
    person = 0,
    pointAccrual,
    pointCheckout,
    delivery,
  } = useTotalCart();

  const {
    control,
    formState: { isValid, errors },
    register,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    reValidateMode: "onSubmit",
    defaultValues: {
      promo: promo?.name ? promo.name : "",
      loading: false,
    },
  });
  const form = useWatch({ control });
  const count = getCount(cart);

  const dispatch = useDispatch();

  const onPromo = useCallback(
    async (e) => {
      if (e?.promo?.length > 0 || promo?.name?.length > 0) {
        setValue("loading", true);
        isPromo({
          name: user?.firstName ?? "",
          phone: checkout?.data?.phone ?? user.phone ?? "",
          serving: checkout?.data?.serving ?? "",
          delivery: checkout.delivery ?? "delivery",
          payment: checkout?.data?.payment ?? "cash",
          person: person > 0 ? person : checkout?.data?.person ?? 1,
          comment: checkout?.data?.comment ?? "",

          address: address ? address.find((e) => e.main) : false,
          affiliateId: selectedAffiliate?.id ? selectedAffiliate.id : false,

          products: cart ?? [],

          promo: e?.promo ?? promo?.name,

          // Списание баллов
          pointWriting:
            checkout?.data?.pointSwitch && checkout?.data?.pointWriting
              ? checkout.data.pointWriting
              : 0,
          pointSwitch: checkout?.data?.pointSwitch,

          //Скидка за самовывоз
          pickupDiscount: checkout?.data?.pickupDiscount ?? 0,

          // Начисление баллов
          pointAccrual: checkout?.data?.pointAccrual ?? 0,

          // Сумма товаров
          price: price,

          //Сумма доставки
          deliveryPrice: delivery,

          // Сумма скидки
          discount: discount,

          // Итоговая сумма
          total: totalNoDelivery,

          type: "site",
        })
          .then((res) => {
            if (
              !res?.options?.summed &&
              (checkout?.data?.pickupDiscount > 0 || discount > 0)
            ) {
              return NotificationManager.error(
                "Промокод не суммируется со скидками"
              );
            }

            if (res?.product?.id) {
              if (
                res?.product?.options?.minPrice > 0 &&
                res?.product?.options?.minPrice > totalNoDelivery
              ) {
                dispatch(
                  cartDeletePromo({ ...res.product, cart: { count: 1 } })
                );
              } else {
                dispatch(
                  createPromoProduct({ ...res.product, cart: { count: 1 } })
                );
              }
            }

            dispatch(updateCartChecking(res.checking));

            if (
              res?.type === "integration_coupon" &&
              (!res?.checking || res?.checking?.length === 0)
            ) {
              NotificationManager.error(res?.error ?? "Условия не выполнены");
              setValue("promo", "");
              return dispatch(cartDeletePromo());
            }

            // else if (promo?.type === "birthday_list_gift") - Если нужно будет показать список подарко

            dispatch(cartPromo(res));
          })
          .catch((error) => {
            dispatch(cartDeletePromo());
            NotificationManager.error(
              typeof error?.response?.data?.error === "string"
                ? error.response.data.error
                : "Такого промокода не существует"
            );
          })
          .finally(() => setValue("loading", false));
      }
    },
    [
      promo,
      checkout,
      discount,
      totalNoDelivery,
      delivery,
      price,
      address,
      total,
      cart,
      user,
      person,
      selectedAffiliate,
    ]
  );

  useEffect(() => {
    if (!promo) {
      setValue("promo", "");
    } else if (
      (promo &&
        !promo?.options?.summed &&
        checkout?.data?.pickupDiscount > 0) ||
      Number(promo?.options?.minTotalCart) > totalNoDelivery
    ) {
      if (Number(promo?.options?.minTotalCart) > totalNoDelivery) {
        NotificationManager.error("Условия промокода не выполнены");
      } else {
        NotificationManager.error("Промокод не суммируется со скидками");
      }
      setValue("promo", "");

      dispatch(cartDeletePromo());
    }
    if (
      cart?.length > 0 &&
      Number(cart.find((e) => e.type == "gift")?.options?.minCart) >
        totalNoDelivery
    ) {
      NotificationManager.error("Условия для подарка не выполнены");

      dispatch(cartDeleteGifts());
    }
  }, [promo, cart]);

  const getCartData = () => {
    setIsGift(
      count > 0 && Array.isArray(cart) && cart?.length > 0
        ? !!cart.find((e) => e.type == "gift")
        : false
    );

    if (count > 0 && Array.isArray(cart) && cart?.length > 0) {
      getCart({
        name: user?.firstName ?? "",
        phone: checkout?.data?.phone ?? user.phone ?? "",
        serving: checkout?.data?.serving ?? "",
        delivery: checkout.delivery ?? "delivery",
        payment: checkout?.data?.payment ?? "cash",
        person: person > 0 ? person : checkout?.data?.person ?? 1,
        comment: checkout?.data?.comment ?? "",

        address: address ? address.find((e) => e.main) : false,
        affiliateId: selectedAffiliate?.id ? selectedAffiliate.id : false,

        // Сохранение адреса по умолчанию
        save: checkout?.data?.save ?? false,

        products: cart ?? [],

        promo: promo ?? false,

        // Списание баллов
        pointWriting:
          checkout?.data?.pointSwitch && checkout?.data?.pointWriting
            ? checkout.data.pointWriting
            : 0,
        pointSwitch: checkout?.data?.pointSwitch,

        //Скидка за самовывоз
        pickupDiscount: checkout?.data?.pickupDiscount ?? 0,

        // Начисление баллов
        pointAccrual: checkout?.data?.pointAccrual ?? 0,

        // Сумма товаров
        price: price,

        //Сумма доставки
        deliveryPrice: delivery,

        // Сумма скидки
        discount: discount,

        // Итоговая сумма
        total: totalNoDelivery,

        type: "site",
      })
        .then((res) => {
          setData((prev) => ({
            ...prev,
            loading: false,
            extras: res?.extras ?? [],
            gifts: res?.gifts ?? [],
          }));

          if (res?.products) {
            dispatch(updateCartAll(res.products));
          }

          dispatch(updateCartChecking(res.checking));

          if (
            promo?.type === "integration_coupon" &&
            (!res?.checking || res?.checking?.length === 0)
          ) {
            NotificationManager.error("Условия не выполнены");
            setValue("promo", "");
            dispatch(cartDeletePromo());
          } else if (promo?.id && !res.promo) {
            setValue("promo", "");
            dispatch(cartDeletePromo());
          } else if (promo?.id && res.promo) {
            dispatch(cartPromo(res.promo));
          }
        })
        .catch((error) => {
          if (promo?.type === "integration_coupon") {
            dispatch(updateCartChecking([]));
            setValue("promo", "");
            dispatch(cartDeletePromo());
            NotificationManager.error(
              typeof error?.response?.data?.error === "string"
                ? error.response.data.error
                : "Условия не выполнены"
            );
          }
          setData((prev) => ({ ...prev, loading: false }));
        });
    } else {
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    getCartData();
  }, [user?.id, count, address, selectedAffiliate]);

  if (!Array.isArray(cart) || cart.length <= 0) {
    return (
      <>
        <Meta
          title={
            options?.seo?.cart?.title
              ? options.seo.cart.title
              : selectedAffiliate?.title
              ? selectedAffiliate?.title + " - Корзина"
              : options?.title
              ? options.title + " - Корзина"
              : t("Корзина")
          }
          description={
            options?.seo?.cart?.description
              ? options.seo.cart.description
              : t(
                  "Оформить заказ легко и удобно. Просмотрите свою корзину, добавьте или удалите блюда, и сделайте заказ в несколько кликов."
                )
          }
        />
        <Empty
          text={t("Корзина пуста")}
          desc={t("Перейдите к меню, чтобы сделать первый заказ")}
          image={() => <EmptyCart />}
          button={
            <Link className="btn-primary" to="/">
              {t("Перейти в меню")}
            </Link>
          }
        />
      </>
    );
  }

  // if (data?.loading) {
  //   return <Loader full />;
  // }

  return (
    <main>
      <Meta
        title={
          options?.seo?.cart?.title
            ? options.seo.cart.title
            : selectedAffiliate?.title
            ? selectedAffiliate?.title + " - Корзина"
            : options?.title
            ? options.title + " - Корзина"
            : t("Корзина")
        }
        description={
          options?.seo?.cart?.description
            ? options.seo.cart.description
            : t(
                "Оформить заказ легко и удобно. Просмотрите свою корзину, добавьте или удалите блюда, и сделайте заказ в несколько кликов."
              )
        }
      />
      <Container>
        <NavTop
          toBack={true}
          home={false}
          breadcrumbs={[
            {
              title: t("Корзина"),
              count: 1,
              active: true,
            },
            {
              title: t("Оформление заказа"),
              count: 2,
              active: false,
              link: "/checkout",
            },
          ]}
        />
        <div className="cart">
          <Row className="g-4 g-xxl-5">
            <Col xs={12} lg={8}>
              <div className="cart-filter d-flex justify-content-between align-items-center">
                {/* <label>
                  <input type="checkbox" />
                  <span className="fs-11 ms-2">
                    Все <span className="d-none d-sm-inline">товары</span>
                  </span>
                </label> */}
                {/* <button draggable={false} 
                  type="button"
                  className="d-flex align-items-center dark-gray ms-auto"
                >
                  <HiOutlineTrash className="fs-15 me-1 me-sm-2" />
                  <span className="d-md-none">Удалить</span>
                  <span className="d-none d-md-inline fs-11 ms-1">
                    Удалить выбранные
                  </span>
                </button> */}
                <h6 className="mb-0 ps-2">
                  {t("Вы добавили")}{" "}
                  {declination(
                    count,
                    ["товар", "товара", "товаров"].map((e) => t(e))
                  )}
                </h6>
                <button
                  draggable={false}
                  type="button"
                  className="btn-9 py-1 ms-4 ms-sm-5"
                  onClick={() => setShowReset(true)}
                >
                  {t("Очистить")}
                </button>
              </div>
              {data?.loading ? (
                <Loader mini height={150} />
              ) : (
                <ul className="list-unstyled">
                  {cart.map((e) => (
                    <CartItem data={e} />
                  ))}
                </ul>
              )}
            </Col>
            <Col xs={12} lg={4}>
              <div className="position-sticky top-h">
                {(options?.giftVisible ||
                  promo?.type === "birthday_list_gift") &&
                  !isGift && (
                    <Gifts total={totalNoDelivery} items={data?.gifts} />
                  )}
                {options?.promoVisible && user?.id && !promo && (
                  <>
                    <div className="fs-11 mb-1">{t("Промокод")}</div>
                    <div className="mb-3">
                      <Input
                        className="w-100 mb-3"
                        type="text"
                        name="promo"
                        placeholder={t("Введите промокод")}
                        errors={errors}
                        register={register}
                        maxLength={100}
                      />
                      <button
                        draggable={false}
                        type="button"
                        disabled={!isValid || form?.loading}
                        onClick={handleSubmit(onPromo)}
                        className={
                          "btn-10 w-100" + (form?.loading ? " loading" : "")
                        }
                      >
                        {t("Применить")}
                      </button>
                    </div>
                  </>
                )}

                {person > 0 && <Extras person={person} items={data?.extras} />}

                <div className="d-flex justify-content-between my-2">
                  <span>{t("Стоимость товаров")}</span>
                  <span>{customPrice(price)}</span>
                </div>
                {options?.promoVisible && promo && (
                  <div className="d-flex justify-content-between my-2">
                    <div>
                      <div className="text-muted fs-08">{t("Промокод")}</div>
                      <div className="fw-6">{promo.title.toUpperCase()}</div>
                    </div>
                    <span className="d-flex align-items-center">
                      {promo?.options?.discount &&
                      Number(promo.options?.discount) > 0 ? (
                        <span className="text-success">
                          -{" "}
                          {Number.isInteger(Number(promo.options?.discount)) > 0
                            ? customPrice(promo.options.discount)
                            : promo.options?.discount > 0
                            ? promo.options.discount
                            : ""}
                        </span>
                      ) : (
                        ""
                      )}
                      {Number(promo.options?.percent > 0) ? (
                        <span className="text-success">
                          -{" "}
                          {Number.isInteger(Number(promo.options?.percent)) > 0
                            ? promo.options?.percent + "%"
                            : promo.options?.percent ?? ""}
                        </span>
                      ) : (
                        ""
                      )}
                      <a
                        onClick={() => {
                          if (promo?.product?.id) {
                            dispatch(
                              cartDeleteProduct({ data: promo.product })
                            );
                          }

                          if (promo?.type === "integration_coupon") {
                            dispatch(updateCartChecking([]));
                          } else if (promo?.type === "birthday_list_gift") {
                            dispatch(cartDeleteGifts());
                          }

                          setValue("promo", "");
                          dispatch(cartDeletePromo());
                        }}
                        className="ms-2 text-danger"
                      >
                        <IoTrashOutline size={18} />
                      </a>
                    </span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="d-flex justify-content-between my-2">
                    <span>{t("Скидка")}</span>
                    <span className="text-success">
                      -{customPrice(discount)}
                    </span>
                  </div>
                )}
                {pointCheckout > 0 && pointSwitch && (
                  <div className="d-flex justify-content-between my-2">
                    <span>{t("Списание баллов")}</span>
                    <span className="text-success">
                      -{customPrice(pointCheckout)}
                    </span>
                  </div>
                )}
                {pointAccrual > 0 && (
                  <div className="d-flex justify-content-between my-2">
                    <span>{t("Начислится баллов")}</span>
                    <span className="text-success">
                      +{customPrice(pointAccrual)}
                    </span>
                  </div>
                )}
                <hr className="my-3" />
                {price != totalNoDelivery && (
                  <div className="d-flex justify-content-between mb-5">
                    <span className="fw-7 fs-11">
                      {t("Стоимость со скидкой")}
                    </span>
                    <span className="fw-7">{customPrice(totalNoDelivery)}</span>
                  </div>
                )}
                <Link
                  to={
                    !data?.loading && user?.id
                      ? !data?.loading &&
                        address?.length === 0 &&
                        checkout.delivery == "delivery"
                        ? "/account/addresses/add"
                        : !data?.loading && "/checkout"
                      : !data?.loading && "/login"
                  }
                  className={
                    "btn btn-lg w-100" +
                    (data?.loading ? " btn-disabled loading" : " btn-primary")
                  }
                >
                  <span className="fw-6">
                    {t(
                      user?.id
                        ? address?.length === 0 &&
                          checkout.delivery == "delivery"
                          ? "Добавить адрес"
                          : "Далее"
                        : "Войти в профиль"
                    )}
                  </span>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <Modal show={showReset} onHide={setShowReset} centered>
        <Modal.Header className="h5">
          <ButtonClose onClick={() => setShowReset(false)} />
          {t("Подтверждение")}
        </Modal.Header>
        <Modal.Body>{t("Вы подтверждаете очистку корзину?")}</Modal.Body>
        <Modal.Footer>
          <button
            draggable={false}
            onClick={() => {
              setShowReset(false);
            }}
            className="btn btn-light"
          >
            {t("Отмена")}
          </button>
          <button
            draggable={false}
            onClick={() => {
              dispatch(deleteCart());
              setShowReset(false);
            }}
            className="btn btn-danger"
          >
            {t("Очистить")}
          </button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default Cart;
