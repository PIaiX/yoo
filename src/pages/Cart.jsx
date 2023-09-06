import React, { useCallback, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import NavTop from "../components/utils/NavTop";
// import Gifts from "../components/utils/Gifts";
import { useForm, useWatch } from "react-hook-form";
import { HiOutlineTrash, HiXMark } from "react-icons/hi2";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { customPrice, declination, getCount } from "../helpers/all";
import { useTotalCart } from "../hooks/useCart";
import { deleteCart } from "../services/cart";
import { getDelivery } from "../services/order";
import { isPromo } from "../services/promo";
import { cartDeletePromo, cartZone } from "../store/reducers/cartSlice";
import Input from "../components/utils/Input";
import Empty from "../components/Empty";
import EmptyCart from "../components/empty/cart";
import Meta from "../components/Meta";

const Cart = () => {
  const state = useSelector(
    ({
      auth: { isAuth, user },
      settings: { options },
      cart,
      checkout: { delivery },
      address,
    }) => ({
      isAuth,
      user,
      cart,
      delivery,
      address,
      options,
    })
  );

  const {
    total = 0,
    price = 0,
    point = 0,
    discount = 0,
    delivery,
    cashback,
  } = state?.cart?.items && useTotalCart();

  const count = getCount(state.cart.items);

  const [distance, setDistance] = useState({ time: false });
  const [isLoading, setIsLoading] = useState(false);
  const [alertReset, setAlertReset] = useState(false);
  const {
    control,
    register,
    formState: { isValid, isSubmitting, errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    mode: "all",
    reValidateMode: "onSubmit",
    defaultValues: {
      promo: state?.cart?.promo?.name ? state.cart.promo.name : "",
    },
  });

  const dispatch = useDispatch();
  const data = useWatch({ control });

  useEffect(() => {
    if (state.delivery == "delivery" && state.isAuth) {
      const selectedAddress = state?.address?.items
        ? state.address.items.find((e) => e.main)
        : false;
      if (selectedAddress) {
        getDelivery({ distance: true, addressId: selectedAddress.id }).then(
          (res) => {
            res?.distance && setDistance(res.distance);
            res?.zone && dispatch(cartZone(res.zone));
          }
        );
      }
    }
  }, [state?.address?.items, state.delivery, state?.cart?.items]);

  const onPromo = useCallback(
    (e) => {
      (e?.promo?.length > 0 || state?.cart?.promo?.name?.length > 0) &&
        isPromo({
          promo: e?.promo
            ? e.promo
            : state?.cart?.promo?.name
            ? state.cart.promo.name
            : "",
          delivery: state.delivery,
        })
          .then(({ data }) => data?.promo && dispatch(cartPromo(data.promo)))
          .catch((err) => {
            dispatch(cartDeletePromo());
            NotificationManager.error(
              err?.response?.data?.error ?? "Такого промокода не существует"
            );
          });
    },
    [state?.cart?.promo]
  );

  useEffect(() => {
    if (state?.cart?.promo?.name) {
      onPromo();
      setValue("promo", "");
    }
  }, [state?.delivery]);

  if (!Array.isArray(state.cart.items) || state.cart.items.length <= 0) {
    return (
      <Empty
        text="Корзина пуста"
        desc="Перейдите к меню, чтобы сделать первый заказ"
        image={() => <EmptyCart />}
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
      <Meta title="Корзина" />
      <Container>
        <NavTop breadcrumbs={false} />
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
                <h6 className="mb-0">
                  Вы добавили{" "}
                  {declination(count, ["товар", "товара", "товаров"])}
                </h6>
                <button
                  type="button"
                  className="btn-9 py-1 ms-4 ms-sm-5"
                  onClick={() => dispatch(deleteCart())}
                >
                  Очистить
                </button>
              </div>

              <ul className="list-unstyled">
                {state.cart.items.map((e) => (
                  <li>
                    <CartItem data={e} />
                  </li>
                ))}
              </ul>
            </Col>
            <Col xs={12} lg={4}>
              <div className="fs-11 mb-1">Промокод</div>
              <div className="mb-3 d-flex">
                <Input
                  className="w-100"
                  type="number"
                  name="promo"
                  placeholder="Введите промокод"
                  errors={errors}
                  defaultValue={data?.promo}
                  register={register}
                />
                <button type="button" className="btn-10 ms-2 ms-sm-4 rounded-3">
                  Применить
                </button>
              </div>

              <div className="d-flex justify-content-between my-2">
                <span>Стоимость товаров</span>
                <span>{customPrice(price)}</span>
              </div>

              {discount > 0 && (
                <div className="d-flex justify-content-between my-2">
                  <span>Скидка</span>
                  <span>-{customPrice(discount)}</span>
                </div>
              )}
              {state.delivery == "delivery" && (
                <div className="d-flex justify-content-between my-2">
                  <span>Доставка</span>
                  <span className="main-color">
                    {delivery > 0 ? "+" + customPrice(delivery) : "Бесплатно"}
                  </span>
                </div>
              )}
              {point > 0 && (
                <div className="d-flex justify-content-between my-2">
                  <span>Списание баллов</span>
                  <span>{customPoint({ value: point, char: "-" })}</span>
                </div>
              )}
              {cashback > 0 && (
                <div className="d-flex justify-content-between my-2">
                  <span>Начислится баллов</span>
                  <span>{customPoint({ value: cashback, char: "+" })}</span>
                </div>
              )}
              <hr className="my-3" />
              <div className="d-flex justify-content-between mb-5">
                <span className="fw-6 fs-11">Итоговая сумма</span>
                <span className="fw-6">{customPrice(total)}</span>
              </div>

              {state.options.giftVisible && <Gifts />}

              <Link
                to={state?.isAuth ? "/checkout" : "/login"}
                className="btn-primary w-100"
              >
                <span className="fw-4">
                  {state?.isAuth ? "Далее" : "Войти в профиль"}
                </span>
              </Link>
            </Col>
          </Row>
        </div>
      </Container>
    </main>
  );
};

export default Cart;
