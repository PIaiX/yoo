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
import { deleteCart, getCart, updateCart } from "../services/cart";
import { isPromo } from "../services/promo";
import {
  cartDeleteProduct,
  cartDeletePromo,
  cartPromo,
  updateCartAll,
  updateCartChecking,
} from "../store/reducers/cartSlice";
import { IoTrashOutline } from "react-icons/io5";
import Loader from "../components/utils/Loader";
import Extras from "../components/utils/Extras";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.auth.user);
  // const checking = useSelector((state) => state.cart.checking);
  const cart = useSelector((state) => state.cart.items);
  const promo = useSelector((state) => state.cart.promo);
  const pointSwitch = useSelector((state) => state.checkout?.data?.pointSwitch);
  const address = useSelector((state) => state.address.items);
  const options = useSelector((state) => state.settings.options);
  const [data, setData] = useState({ loading: true });
  const checkout = useSelector((state) => state.checkout);
  const selectedAffiliate = useSelector((state) => state.affiliate?.active);
  const [isGift, setIsGift] = useState(false);

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

          // Сохранение адреса по умолчанию
          save: checkout?.data?.save ?? false,

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
            dispatch(cartPromo(res));
            if (res?.product?.id) {
              dispatch(
                updateCart({ data: { ...res.product, cart: { count: 1 } } })
              );
            }

            dispatch(updateCartChecking(res.checking));

            if (
              promo?.type === "integration_coupon" &&
              (!res?.checking || res?.checking?.length === 0)
            ) {
              NotificationManager.error("Условия не выполнены");
              setValue("promo", "");
              dispatch(cartDeletePromo());
            }
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
    }
  }, [promo]);

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
          setData({
            loading: false,
            extras: res?.extras || [],
            gifts: res?.gifts || [],
          });

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
          setData({ ...data, loading: false });
        });
    } else {
      setData({ ...data, loading: false });
    }
  };

  useEffect(() => {
    getCartData();
  }, [user?.id, count, address, selectedAffiliate]);

  // useEffect(() => {
  //   if (promo && promo?.type === "integration_coupon") {
  //     getCartData();
  //   }
  // }, [promo]);

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

  if (data?.loading) {
    return <Loader full />;
  }

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
                {/* <button
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
                  type="button"
                  className="btn-9 py-1 ms-4 ms-sm-5"
                  onClick={() => dispatch(deleteCart())}
                >
                  {t("Очистить")}
                </button>
              </div>
              <ul className="list-unstyled">
                {cart.map((e) => (
                  <CartItem data={e} />
                ))}
              </ul>
            </Col>
            <Col xs={12} lg={4}>
              <div className="position-sticky top-h">
                {options?.giftVisible && !isGift && (
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
                        type="button"
                        disabled={!isValid || form?.loading}
                        onClick={handleSubmit(onPromo)}
                        className={
                          form?.promo?.length > 1
                            ? "btn-primary w-100 rounded-3" +
                              (form?.loading ? " loading" : "")
                            : "btn-10 w-100 rounded-3" +
                              (form?.loading ? " loading" : "")
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
                      {Number(promo.options?.discount) > 0 ? (
                        <span className="text-success">
                          -{" "}
                          {Number.isInteger(Number(promo.options?.discount)) > 0
                            ? customPrice(promo.options.discount)
                            : promo.options?.discount ?? ""}
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
                    <span>-{customPrice(pointCheckout)}</span>
                  </div>
                )}
                {pointAccrual > 0 && (
                  <div className="d-flex justify-content-between my-2">
                    <span>{t("Начислится баллов")}</span>
                    <span>+{customPrice(pointAccrual)}</span>
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
                    user?.id
                      ? address?.length === 0 && checkout.delivery == "delivery"
                        ? "/account/addresses/add"
                        : "/checkout"
                      : "/login"
                  }
                  className="btn btn-primary btn-lg w-100"
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
    </main>
  );
};

export default Cart;
