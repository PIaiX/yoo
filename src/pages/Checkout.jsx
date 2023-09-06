import React, { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavTop from "../components/utils/NavTop";
import CountInput from "../components/utils/CountInput";
import CheckoutProduct from "../components/CheckoutProduct";
import Select from "../components/utils/Select";
import Input from "../components/utils/Input";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useTotalCart } from "../hooks/useCart";
import { useForm, useWatch } from "react-hook-form";
import {
  editDeliveryCheckout,
  resetCheckout,
  setCheckout,
} from "../store/reducers/checkoutSlice";
import { createOrder, getDelivery } from "../services/order";
import { cartZone, resetCart } from "../store/reducers/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { checkAuth } from "../services/auth";
import { customPrice } from "../helpers/all";
import Meta from "../components/Meta";

const Checkout = () => {
  const paymentsData = [
    {
      id: 1,
      title: "Онлайн оплата",
      value: "online",
      main: true,
    },
    {
      id: 2,
      title: "Банковской картой",
      value: "card",
      main: false,
    },
    {
      id: 3,
      title: "Наличными",
      value: "cash",
      main: false,
    },
  ];

  const state = useSelector(
    ({
      auth: { isAuth, user },
      settings: { options },
      cart,
      checkout: { checkout, delivery },
      address,
      affiliate,
    }) => ({
      isAuth,
      user,
      cart,
      checkout,
      delivery,
      address,
      affiliate,
      options,
    })
  );

  const {
    total = 0,
    price = 0,
    discount = 0,
    point = 0,
    delivery,
    cashback,
  } = state?.cart?.items && useTotalCart();

  const selectedAffiliate = state?.affiliate?.items
    ? state.affiliate.items.find((e) => e.main)
    : false;

  const [distance, setDistance] = useState({ time: false });
  const [showServing, setShowServing] = useState(false);
  const [end, setEnd] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCreateAffiliateModal, setShowAffiliateModal] = useState(false);
  const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    formState: { isValid, errors },
    handleSubmit,
    setValue,
    reset,
    register,
  } = useForm({
    mode: "all",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: state.user.firstName ?? "",
      phone: state.user.phone ?? "",
      serving: state.checkout.serving ?? "",
      delivery: state.delivery ?? "delivery",
      payment: state.options[state.checkout.payment]
        ? state.checkout.payment
        : "cash",
      person: state.checkout.person ?? 1,
      comment: state.checkout.comment ?? "",

      address: state?.address?.items
        ? state.address.items.find((e) => e.main)
        : false,
      affiliateId: state?.affiliate?.items
        ? state.affiliate.items.find((e) => e.main)?.id
        : false,

      // Сохранение адреса по умолчанию
      save: state.checkout.save ?? false,

      products: state.cart.items ?? [],

      promo: state.cart.promo ?? false,

      // Сумма баллов
      point: point,

      // Сумма товаров
      price: price,

      //Сумма доставки
      deliveryPrice: delivery,

      // Сумма скидки
      discount: discount,

      // Итоговая сумма
      total: total,

      type: "app",
    },
  });

  const data = useWatch({ control });

  const paymentTitle = paymentsData.find(
    (e) => e.value === data?.payment
  )?.title;

  useEffect(() => {
    if (total > 0) {
      setValue("total", total);
      setValue("price", price);
      setValue("discount", discount);
      setValue("deliveryPrice", delivery);
    }
    setValue("point", point);
  }, [total, price, point, discount, delivery]);

  useEffect(() => {
    if (data) dispatch(setCheckout(data));
  }, [data]);

  useEffect(() => {
    if (state.delivery == "delivery" && data?.address?.id) {
      getDelivery({ distance: true, addressId: data.address.id }).then(
        (res) => {
          res?.distance && setDistance(res.distance);
          res?.zone && dispatch(cartZone(res.zone));
        }
      );
    }
  }, [data.address, state.delivery]);

  useEffect(() => {
    if (state.delivery) {
      setValue("delivery", state.delivery);
    }
  }, [state.delivery]);

  useEffect(() => {
    if (state?.address?.items?.length > 0) {
      setValue("address", state.address.items.find((e) => e.main) ?? false);
    }
  }, [state?.address?.items]);

  const onSubmit = useCallback(
    (data) => {
      if (data.delivery == "delivery") {
        if (!data.address) {
          return NotificationManager.error("Добавьте адрес доставки");
        }

        if (!state?.cart?.zone || !state.cart.zone.status) {
          NotificationManager.error(
            "По данному адресу доставка не производится"
          );
          return false;
        }

        data.affiliateId = state.cart.zone.affiliateId;
      }
      setIsLoading(true);

      createOrder(data)
        .then(async (response) => {
          if (response?.data?.link) {
            return navigate("/pay", response.data);
          } else {
            reset();
            dispatch(resetCart());
            dispatch(resetCheckout());
            setEnd(true);
            if (response?.data) {
              NotificationManager.success("Заказ успешно отправлен");
            }
            if (response?.data?.point > 0) {
              checkAuth().then(
                async (auth) =>
                  auth?.data?.user && dispatch(setUser(auth.data.user))
              );
            }
          }
        })
        .catch((error) => {
          NotificationManager.error(
            error?.response?.data?.error ?? "Неизвестная ошибка"
          );
        })
        .finally(() => setIsLoading(false));
    },
    [data.address, state?.cart?.zone]
  );

  return (
    <main>
      <Meta title="Оформление заказа" />
      <Container>
        <NavTop toBack={true} breadcrumbs={false} />
        <form className="cart">
          <Row className="g-4 g-xxl-5 d-flex justify-content-between">
            <Col xs={12} xl={6}>
              <h1 className="text-center text-md-start">Оформление заказа</h1>
              <Row>
                <Col md={12}>
                  <div className="d-flex align-items-center mb-3">
                    <a
                      className={
                        "delivery" +
                        (state.delivery === "delivery" ? " active" : "")
                      }
                      onClick={() => dispatch(editDeliveryCheckout("delivery"))}
                    >
                      <b>Доставка</b>
                      <p>
                        {delivery > 0 ? customPrice(delivery) : "Бесплатно"}
                      </p>
                    </a>
                    <a
                      className={
                        "delivery" +
                        (state.delivery === "pickup" ? " active" : "")
                      }
                      onClick={() => dispatch(editDeliveryCheckout("pickup"))}
                    >
                      <b>Самовывоз</b>
                      <p>{selectedAffiliate?.full ?? "Адреса нет"}</p>
                    </a>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-3">
                    {data.delivery == "delivery" ? (
                      state?.address?.items?.length > 0 ? (
                        <Select
                          data={state?.address?.items.map((e) => ({
                            title: e.full,
                            value: e.id,
                          }))}
                        />
                      ) : (
                        <Link className="btn btn-sm btn-green rounded-3">
                          Добавить адрес
                        </Link>
                      )
                    ) : (
                      state?.affiliate?.items?.length > 0 && (
                        <Select
                          data={state?.affiliate?.items.map((e) => ({
                            title: e.full,
                            value: e.id,
                          }))}
                        />
                      )
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Input
                      label="Имя"
                      name="firstName"
                      placeholder="Введите имя"
                      errors={errors}
                      defaultValue={data?.firstName}
                      register={register}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Input
                      label="Номер телефона"
                      type="custom"
                      name="phone"
                      mask="+7(999)999-99-99"
                      keyboardType="phone-pad"
                      control={control}
                      placeholder="Введите номер телефона"
                      autoCapitalize="none"
                      leftIcon="call-outline"
                      errors={errors}
                      defaultValue={data?.phone}
                      register={register}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="mb-3">
                    <p>Количество персон</p>
                    <CountInput dis={false} />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-2">Комментарий</div>
                  <textarea rows="3" className="mb-4"></textarea>
                </Col>
              </Row>
            </Col>
            <Col xs={12} xl={4}>
              <div className="cart-box mb-4">
                <h6>Ваш заказ</h6>

                <ul className="list-unstyled">
                  {state.cart.items.map((e) => (
                    <li className="mb-3">
                      <CheckoutProduct data={e} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-3 d-flex">
                <Input
                  className="w-100"
                  type="number"
                  name="point"
                  placeholder="Введите сумму баллов"
                  errors={errors}
                  defaultValue={data?.point}
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

              <button
                type="submit"
                disabled={
                  !isValid ||
                  (state.delivery === "delivery" &&
                    state?.cart?.zone?.minPrice < price) ||
                  (point > 0 && total === 0)
                }
                className="btn-primary mt-3 w-100"
                onClick={handleSubmit(onSubmit)}
              >
                <span className="fw-4">Оформить заказ</span>
              </button>
            </Col>
          </Row>
        </form>
      </Container>
    </main>
  );
};

export default Checkout;
