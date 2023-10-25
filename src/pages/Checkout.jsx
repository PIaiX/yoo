import moment from "moment";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useForm, useWatch } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link, redirect, useNavigate } from "react-router-dom";
import CheckoutProduct from "../components/CheckoutProduct";
import Empty from "../components/Empty";
import EmptyAddresses from "../components/empty/addresses";
import EmptyAuth from "../components/empty/auth";
import EmptyCart from "../components/empty/cart";
import EmptyWork from "../components/empty/work";
import Meta from "../components/Meta";
import CountInput from "../components/utils/CountInput";
import Input from "../components/utils/Input";
import NavTop from "../components/utils/NavTop";
import PaymentItem from "../components/utils/PaymentItem";
import Select from "../components/utils/Select";
import Textarea from "../components/utils/Textarea";
import { customPrice } from "../helpers/all";
import { useTotalCart } from "../hooks/useCart";
import { checkAuth } from "../services/auth";
import { createOrder, getDelivery } from "../services/order";
import { cartZone, resetCart } from "../store/reducers/cartSlice";
import {
  editDeliveryCheckout,
  resetCheckout,
  setCheckout,
} from "../store/reducers/checkoutSlice";

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

  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const promo = useSelector((state) => state.cart.promo);
  const zone = useSelector((state) => state.cart.zone);
  const { checkout, delivery: deliveryCheckout } = useSelector(
    (state) => state.checkout
  );
  const address = useSelector((state) => state.address.items);
  const affiliate = useSelector((state) => state.affiliate.items);
  const options = useSelector((state) => state.settings.options);

  const {
    total = 0,
    price = 0,
    discount = 0,
    point = 0,
    delivery,
    cashback,
  } = useTotalCart();

  const selectedAffiliate = affiliate ? affiliate.find((e) => e.main) : false;

  const [end, setEnd] = useState(false);
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
      name: user.firstName ?? "",
      phone: user.phone ?? "",
      serving: checkout.serving ?? "",
      delivery: deliveryCheckout ?? "delivery",
      payment: checkout.payment ?? options[checkout.payment] ?? "cash",
      person: checkout.person ?? 1,
      comment: checkout.comment ?? "",

      address: address ? address.find((e) => e.main) : false,
      affiliateId: affiliate ? affiliate.find((e) => e.main)?.id : false,

      // Сохранение адреса по умолчанию
      save: checkout.save ?? false,

      products: cart ?? [],

      promo: promo ?? false,

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

      type: "site",
    },
  });

  const data = useWatch({ control });

  useLayoutEffect(() => {
    if (isAuth && user?.status === 0) {
      return navigate("/activate");
    }
  }, [isAuth]);

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
    if (deliveryCheckout == "delivery" && data?.address?.id) {
      getDelivery({ distance: false, addressId: data.address.id }).then(
        (res) => {
          res?.zone && dispatch(cartZone(res.zone));
        }
      );
    }
  }, [isAuth, deliveryCheckout]);

  useEffect(() => {
    if (deliveryCheckout) {
      setValue("delivery", deliveryCheckout);
    }
  }, [deliveryCheckout]);

  useEffect(() => {
    if (address?.length > 0) {
      setValue("address", address.find((e) => e.main) ?? false);
    }
  }, [address]);

  const onSubmit = useCallback(
    (data) => {
      if (data.delivery == "delivery") {
        if (!data.address) {
          return NotificationManager.error("Добавьте адрес доставки");
        }

        if (!zone || !zone.status) {
          NotificationManager.error(
            "По данному адресу доставка не производится"
          );
          return false;
        }

        data.affiliateId = zone.affiliateId;
      }
      setIsLoading(true);

      createOrder(data)
        .then(async (response) => {
          if (response?.data) {
            NotificationManager.success(
              response?.data?.link
                ? "Перенаправление на страницу оплаты..."
                : "Заказ успешно отправлен"
            );
          }

          reset();
          dispatch(resetCart());
          dispatch(resetCheckout());
          setEnd(true);

          if (response?.data?.point > 0) {
            checkAuth().then(
              async (auth) =>
                auth?.data?.user && dispatch(setUser(auth.data.user))
            );
          }

          if (response?.data?.link) {
            return window.location.replace(response.data.link);
          }
        })
        .catch((error) => {
          NotificationManager.error(
            error?.response?.data?.error ?? "Неизвестная ошибка"
          );
        })
        .finally(() => setIsLoading(false));
    },
    [data.address, zone]
  );

  if (!Array.isArray(cart) || cart.length <= 0) {
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

  if (!isAuth) {
    return (
      <Empty
        text="Вы не авторизованы"
        desc="Войдите в свой аккаунт или зарегистрируйтесь"
        image={() => <EmptyAuth />}
        button={
          <Link className="btn-primary" to="/login">
            Войти или создать профиль
          </Link>
        }
      />
    );
  }

  if (
    data?.delivery == "delivery" &&
    (!Array.isArray(address) || address.length <= 0)
  ) {
    return (
      <Empty
        text="Адрес не добавлен"
        desc="Создайте новый адрес для доставки заказа"
        image={() => <EmptyAddresses />}
        button={
          <Link className="btn-primary" to="/account/addresses/add">
            Добавить адрес
          </Link>
        }
      />
    );
  }

  if (
    data?.delivery == "pickup" &&
    (!Array.isArray(affiliate) || affiliate.length <= 0)
  ) {
    return (
      <Empty
        text="Заказы временно недоступны"
        desc="Попробуйте зайди немного позже"
        image={() => <EmptyWork />}
        button={
          <Link className="btn-primary" to="/account/addresses/add">
            Перейти на главную
          </Link>
        }
      />
    );
  }

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
                  <div className="d-flex align-items-center mb-4">
                    <a
                      className={
                        "delivery" +
                        (data.delivery === "delivery" ? " active" : "")
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
                        (data.delivery === "pickup" ? " active" : "")
                      }
                      onClick={() => dispatch(editDeliveryCheckout("pickup"))}
                    >
                      <b>Самовывоз</b>
                      <p>{selectedAffiliate?.full ?? "Адреса нет"}</p>
                    </a>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-4">
                    {data.delivery == "delivery" ? (
                      <>
                        <Select
                          label="Адрес"
                          value={data?.address?.id}
                          data={address.map((e) => ({
                            title: e?.title?.length > 0 ? e.title : e.full,
                            desc: e?.title?.length > 0 ? e.full : false,
                            value: e.id,
                          }))}
                          onClick={(e) =>
                            setValue(
                              "address",
                              address.find((a) => a.id === e.value)
                            )
                          }
                        />
                        <p className="text-muted fs-09 mt-2">
                          Нет нужного адреса?{" "}
                          <Link
                            to="/account/addresses/add"
                            className="text-success"
                          >
                            Добавить новый адрес
                          </Link>
                        </p>
                      </>
                    ) : (
                      affiliate?.length > 0 && (
                        <Select
                          label="Адрес"
                          value={data?.affiliateId}
                          data={affiliate.map((e) => ({
                            title: e?.title?.length > 0 ? e.title : e.full,
                            desc: e?.title?.length > 0 ? e.full : false,
                            value: e.id,
                          }))}
                          onClick={(e) => setValue("affiliateId", e.value)}
                        />
                      )
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <Input
                      label="Имя"
                      name="name"
                      placeholder="Введите имя"
                      errors={errors}
                      register={register}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
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
                      register={register}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-4">
                    <p className="mb-2 fs-09">Кол-во персон</p>
                    <CountInput
                      dis={false}
                      value={data.person}
                      onChange={(e) => setValue("person", e)}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <Input
                      label="Время подачи"
                      name="serving"
                      control={control}
                      autoCapitalize="none"
                      errors={errors}
                      register={register}
                      type="datetime-local"
                      validation={{
                        min: {
                          value: moment()
                            .add(2, "hours")
                            .format("YYYY-MM-DDTkk:mm"),
                          message:
                            "Время подачи заказа не менее чем через 2 часа",
                        },
                        max: {
                          value: moment()
                            .add(1, "year")
                            .format("YYYY-MM-DDTkk:mm"),
                          message: "Максимальное время подачи не более 1 года",
                        },
                      }}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-4">
                    <p className="mb-2 fs-09">Способ оплаты</p>
                    <Row xs={2} sm={3} md={3} className="gx-2 gy-4">
                      {paymentsData.map((e) => (
                        <Col>
                          <PaymentItem
                            onClick={(e) => setValue("payment", e.value)}
                            data={e}
                            active={e.value === data.payment}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>
                <Col md={12}>
                  <Textarea
                    label="Комментарий"
                    name="comment"
                    placeholder="Введите комментарий"
                    errors={errors}
                    defaultValue={data?.comment}
                    register={register}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={12} xl={4}>
              <div className="cart-box mb-4">
                <h6>Ваш заказ</h6>

                <ul className="list-unstyled">
                  {cart.map((e) => (
                    <li className="mb-4">
                      <CheckoutProduct data={e} />
                    </li>
                  ))}
                </ul>
              </div>
              {options.promoVisible && (
                <>
                  <div className="fs-11 mb-1">Списание баллов</div>
                  <div className="mb-4 d-flex">
                    <Input
                      className="w-100"
                      type="number"
                      name="point"
                      placeholder="Введите сумму баллов"
                      errors={errors}
                      register={register}
                    />
                    <button
                      type="button"
                      className="btn-10 ms-2 ms-sm-4 rounded-3"
                    >
                      Применить
                    </button>
                  </div>
                </>
              )}
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
              {data.delivery == "delivery" && (
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
                  (data.delivery === "delivery" && zone?.minPrice > price) ||
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
