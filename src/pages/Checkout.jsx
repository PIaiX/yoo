import moment from "moment";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Button, Modal } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
import { customPrice, deliveryData, paymentData } from "../helpers/all";
import { isWork } from "../hooks/all";
import { useTotalCart } from "../hooks/useCart";
import { mainAddress } from "../services/address";
import { checkAuth } from "../services/auth";
import { createOrder } from "../services/order";
import {
  mainAffiliateEdit,
  mainTableEdit,
} from "../store/reducers/affiliateSlice";
import { resetCart } from "../store/reducers/cartSlice";
import {
  editDeliveryCheckout,
  resetCheckout,
  setCheckout,
} from "../store/reducers/checkoutSlice";
import CartItem from "../components/CartItem";

const Checkout = () => {
  const { t } = useTranslation();

  const paymentsData = [
    {
      id: 1,
      title: t("Онлайн оплата"),
      value: "online",
      main: true,
    },
    {
      id: 2,
      title: t("Банковской картой"),
      value: "card",
      main: false,
    },
    {
      id: 3,
      title: t("Наличными"),
      value: "cash",
      main: false,
    },
    {
      id: 4,
      title: t("СБП"),
      value: "sbp",
      main: false,
    },
    {
      id: 5,
      title: "Sber Pay",
      value: "sberpay",
      main: false,
    },
    {
      id: 6,
      title: "Tinkoff Pay",
      value: "tinkoffpay",
      main: false,
    },
  ];

  const profilePointVisible = useSelector(
    (state) => state.settings.options.profilePointVisible
  );
  const pointSwitch = useSelector((state) => state.checkout?.data?.pointSwitch);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const checking = useSelector((state) => state.cart.checking);
  const promo = useSelector((state) => state.cart?.promo);
  const zone = useSelector((state) => state.cart?.zone);
  const checkout = useSelector((state) => state.checkout);
  const address = useSelector((state) => state.address.items);
  const affiliate = useSelector((state) => state.affiliate.items);
  const tables = useSelector((state) => state.affiliate.tables);
  const selectedAffiliate = useSelector((state) => state.affiliate?.active);
  const selectedTable = useSelector((state) => state.affiliate.table);
  const options = useSelector((state) => state.settings.options);
  const [confirmation, setConfirmation] = useState(false);
  const {
    total = 0,
    price = 0,
    discount = 0,
    delivery,
    person = 0,
    pointAccrual,
    pickupDiscount,
    pointCheckout,
    totalNoDelivery = 0,
  } = useTotalCart();

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
    trigger,
    register,
  } = useForm({
    mode: "all",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: user.firstName ?? "",
      phone: user.phone ?? "",
      serving: checkout?.data?.serving ?? "",
      delivery: checkout.delivery ?? "delivery",
      payment: checkout?.data?.payment ?? "cash",
      person: person > 0 ? person : checkout?.data?.person ?? 1,
      comment: checkout?.data?.comment ?? "",

      address: address ? address.find((e) => e.main) : false,
      affiliateId: selectedAffiliate?.id ? selectedAffiliate.id : false,
      tableId: selectedTable?.id ? selectedTable.id : false,

      // Сохранение адреса по умолчанию
      save: checkout?.data?.save ?? false,

      products: cart ?? [],
      checking: checking ?? [],
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
    },
  });

  const data = useWatch({ control });

  const deliveryText = data?.delivery ? deliveryData[data.delivery] : null;

  const paymentText = data?.payment ? paymentData[data.payment] : null;

  const isValidBtn = () =>
    isLoading ||
    !isValid ||
    !user?.id ||
    (checkout.delivery === "delivery" &&
      zone?.data?.minPrice > totalNoDelivery);

  useLayoutEffect(() => {
    if (isAuth && user?.status === 0) {
      return navigate("/activate");
    }
  }, [isAuth]);

  useEffect(() => {
    if (!end && totalNoDelivery > 0) {
      setValue("total", totalNoDelivery);
      setValue("price", price);
      setValue("discount", discount);
      setValue("deliveryPrice", delivery);
      setValue("pointAccrual", pointAccrual);
      setValue("pickupDiscount", pickupDiscount);
    }
  }, [
    totalNoDelivery,
    price,
    discount,
    delivery,
    pointAccrual,
    pickupDiscount,
    end,
  ]);

  useEffect(() => {
    if (!end && isAuth) {
      setValue("name", user.firstName);
      if (user.phone) {
        setValue("phone", user.phone);
      }
      trigger();
    }
  }, [user, end]);

  useEffect(() => {
    if (data) dispatch(setCheckout(data));
  }, [data]);

  useEffect(() => {
    if (isAuth && !end) {
      setValue(
        "pointWriting",
        data.pointSwitch && pointCheckout > 0 ? pointCheckout : 0
      );
    }
  }, [data.pointSwitch, pointCheckout, end]);

  useEffect(() => {
    if (!end && data) dispatch(setCheckout(data));
  }, [data, end]);

  useEffect(() => {
    if (!end && checkout.delivery) {
      setValue("delivery", checkout.delivery);
    }
  }, [checkout.delivery, end]);

  useEffect(() => {
    if (checking) {
      setValue("checking", checking);
    }
  }, [checking]);

  useEffect(() => {
    let pay =
      checkout.delivery == "delivery"
        ? options?.delivery ?? []
        : options?.pickup ?? [];
    if (pay && data.payment && !pay[data.payment]) {
      if (pay?.online) {
        setValue("payment", "online");
      } else if (pay?.card) {
        setValue("payment", "card");
      } else if (pay?.cash) {
        setValue("payment", "cash");
      } else if (pay?.sbp) {
        setValue("payment", "sbp");
      } else if (pay?.sberpay) {
        setValue("payment", "sberpay");
      } else if (pay?.tinkoffpay) {
        setValue("payment", "tinkoffpay");
      }
    }
  }, [checkout.delivery, end, options, data.payment]);

  useEffect(() => {
    if (address?.length > 0) {
      setValue("address", address.find((e) => e.main) ?? false);
    }

    if (zone?.data?.affiliateId && checkout.delivery === "delivery") {
      setValue("affiliateId", zone.data.affiliateId);
    } else if (selectedAffiliate?.id && checkout.delivery == "pickup") {
      setValue("affiliateId", selectedAffiliate.id);
    }
  }, [address, zone, checkout.delivery, selectedAffiliate]);

  useEffect(() => {
    if (selectedTable?.id && checkout.delivery == "hall") {
      setValue("tableId", selectedTable.id);
    }
  }, [selectedTable]);

  const onSubmit = useCallback(
    (data) => {
      if (data.serving) {
        if (
          !isWork(
            selectedAffiliate.options.work[moment(data.serving).weekday()]
              .start,
            selectedAffiliate.options.work[moment(data.serving).weekday()].end,
            data.serving
          )
        ) {
          NotificationManager.error(t("Нельзя заказать на данное время"));
        }
      }

      if (data.delivery == "delivery") {
        if (!data.address) {
          return NotificationManager.error(t("Добавьте адрес доставки"));
        }
console.log(zone)
        if (!zone?.data || !zone?.data?.status) {
          NotificationManager.error(
            t("По данному адресу доставка не производится")
          );
          return false;
        }

        data.affiliateId = zone.data.affiliateId;
      }

      if (data?.phone && data.phone?.length > 0) {
        let phone = data.phone.replace(/[^\d]/g, "").trim();
        if (!phone) {
          return NotificationManager.error("Укажите номер телефона");
        }
        if (phone?.length < 11) {
          return NotificationManager.error("Введите корректный номер телефона");
        }
        if (parseInt(phone[0]) === 7 && parseInt(phone[1]) === 8) {
          return NotificationManager.error(
            "Неверный формат номера телефона. Должно быть +79, +77."
          );
        }
      }

      setIsLoading(true);

      createOrder(data)
        .then(async (response) => {
          if (response?.data) {
            NotificationManager.success(
              response?.data?.link
                ? t("Перенаправление на страницу оплаты...")
                : t("Заказ успешно отправлен")
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
            typeof error?.response?.data?.error === "string"
              ? error.response.data.error
              : t("Неизвестная ошибка")
          );
        })
        .finally(() => setIsLoading(false));
    },
    [data.address, zone?.data]
  );

  if (!Array.isArray(cart) || cart.length <= 0) {
    return (
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
    );
  }

  if (!isAuth) {
    return (
      <Empty
        text={t("Вы не авторизованы")}
        desc={t("Войдите в свой аккаунт или зарегистрируйтесь")}
        image={() => <EmptyAuth />}
        button={
          <Link className="btn-primary" to="/login">
            {t("Войти или создать профиль")}
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
        text={t("Адрес не добавлен")}
        desc={t("Создайте новый адрес для доставки заказа")}
        image={() => <EmptyAddresses />}
        button={
          <Link className="btn-primary" to="/account/addresses/add">
            {t("Добавить адрес")}
          </Link>
        }
      />
    );
  }

  if (selectedAffiliate?.status === 0) {
    return (
      <Empty
        text={t("Заведение сейчас не работает")}
        desc={t("Зайдите к нам немного позже")}
        image={() => <EmptyWork />}
        button={
          <Link className="btn-primary" to="/">
            {t("Перейти на главную")}
          </Link>
        }
      />
    );
  }
  if (
    selectedAffiliate?.options?.work &&
    selectedAffiliate.options.work[moment().weekday()].end &&
    selectedAffiliate.options.work[moment().weekday()].start &&
    !isWork(
      selectedAffiliate.options.work[moment().weekday()].start,
      selectedAffiliate.options.work[moment().weekday()].end
    )
  ) {
    return (
      <Empty
        text={`${t("Мы работаем с")} ${
          selectedAffiliate.options.work[moment().weekday()].start
        } ${t("до")} ${selectedAffiliate.options.work[moment().weekday()].end}`}
        desc={t("Зайдите к нам немного позже")}
        image={() => <EmptyWork />}
        button={
          <Link className="btn-primary" to="/">
            {t("Перейти на главную")}
          </Link>
        }
      />
    );
  }
  return (
    <main>
      <Meta title={t("Оформление заказа")} />
      <Container>
        <NavTop toBack={true} breadcrumbs={false} />
        <form className="cart">
          <Row className="g-4 g-xxl-5 d-flex justify-content-between">
            <Col xs={12} xl={6}>
              <h1 className="text-center text-md-start">
                {t("Оформление заказа")}
              </h1>
              <Row>
                <Col md={12}>
                  <div className="d-flex align-items-center mb-4">
                    {options?.delivery?.status && (
                      <a
                        className={
                          "delivery" +
                          (data.delivery === "delivery" ? " active" : "")
                        }
                        onClick={() =>
                          dispatch(editDeliveryCheckout("delivery"))
                        }
                      >
                        <b>{t("Доставка")}</b>
                        <p>
                          {delivery > 0
                            ? customPrice(delivery)
                            : t("Бесплатно")}
                        </p>
                      </a>
                    )}
                    {options?.pickup?.status && (
                      <a
                        className={
                          "delivery" +
                          (data.delivery === "pickup" ? " active" : "")
                        }
                        onClick={() => dispatch(editDeliveryCheckout("pickup"))}
                      >
                        <b>{t("Самовывоз")}</b>
                        <p>{selectedAffiliate?.full ?? t("Адреса нет")}</p>
                      </a>
                    )}
                    {options?.hall?.status && (
                      <a
                        className={
                          "delivery" +
                          (data.delivery === "hall" ? " active" : "")
                        }
                        onClick={() => dispatch(editDeliveryCheckout("hall"))}
                      >
                        <b>{t("В зале")}</b>
                        <p>{selectedTable?.title ?? t("Нет стола")}</p>
                      </a>
                    )}
                  </div>
                </Col>
                <Col md={12}>
                  {data.delivery == "delivery" ? (
                    <div className="mb-4">
                      <Select
                        label={t("Адрес")}
                        value={data?.address?.id}
                        data={address.map((e) => ({
                          title: e?.title?.length > 0 ? e.title : e.full,
                          desc: e?.title?.length > 0 ? e.full : false,
                          value: e.id,
                        }))}
                        onClick={(e) =>
                          dispatch(
                            mainAddress(address.find((a) => a.id === e.value))
                          )
                        }
                      />
                      <p className="text-muted fs-09 mt-2">
                        {t("Нет нужного адреса?")}{" "}
                        <Link
                          to="/account/addresses/add"
                          className="text-success"
                        >
                          {t("Добавить новый адрес")}
                        </Link>
                      </p>
                    </div>
                  ) : data.delivery == "pickup" ? (
                    !options?.multiBrand &&
                    affiliate?.length > 1 && (
                      <div className="mb-4">
                        <Select
                          label={t("Адрес")}
                          value={data?.affiliateId}
                          data={affiliate.map((e) => ({
                            title: e?.title?.length > 0 ? e.title : e.full,
                            desc: e?.title?.length > 0 ? e.full : false,
                            value: e.id,
                          }))}
                          onClick={(e) =>
                            dispatch(
                              mainAffiliateEdit(
                                affiliate.find((item) => item.id === e.value)
                              )
                            )
                          }
                        />
                      </div>
                    )
                  ) : (
                    data.delivery == "hall" && (
                      <div className="mb-4">
                        {!options?.multiBrand && affiliate?.length > 1 && (
                          <Select
                            label={t("Филиал")}
                            className="mb-3"
                            value={data?.affiliateId}
                            data={affiliate.map((e) => ({
                              title: e?.title?.length > 0 ? e.title : e.full,
                              desc: e?.title?.length > 0 ? e.full : false,
                              value: e.id,
                            }))}
                            onClick={(e) =>
                              dispatch(
                                mainAffiliateEdit(
                                  affiliate.find((item) => item.id === e.value)
                                )
                              )
                            }
                          />
                        )}
                        <Select
                          label={t("Стол")}
                          value={data?.tableId}
                          data={tables.map((e) => ({
                            title: e.title,
                            value: e.id,
                          }))}
                          onClick={(e) =>
                            dispatch(
                              mainTableEdit(
                                tables.find((item) => item.id === e.value)
                              )
                            )
                          }
                        />
                      </div>
                    )
                  )}
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <Input
                      label={t("Имя")}
                      name="name"
                      placeholder={t("Введите имя")}
                      errors={errors}
                      register={register}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <Input
                      label={t("Номер телефона")}
                      type="custom"
                      name="phone"
                      inputMode="tel"
                      pattern="[0-9]*"
                      mask="+7(999)999-99-99"
                      keyboardType="phone-pad"
                      control={control}
                      placeholder={t("Введите номер телефона")}
                      autoCapitalize="none"
                      leftIcon="call-outline"
                      errors={errors}
                      register={register}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-4">
                    <p className="mb-2 fs-09">{t("Кол-во персон")}</p>
                    <CountInput
                      dis={person > 0}
                      value={data.person}
                      onChange={(e) => setValue("person", e)}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <Input
                      label={t("Время подачи")}
                      name="serving"
                      control={control}
                      autoCapitalize="none"
                      errors={errors}
                      register={register}
                      type="datetime-local"
                      validation={{
                        min: {
                          value: moment()
                            .add(
                              selectedAffiliate?.options?.preorderMin ?? 90,
                              "minutes"
                            )
                            .format("YYYY-MM-DDTkk:mm"),
                          message: `${t(
                            "Время подачи заказа не менее чем через"
                          )} ${
                            selectedAffiliate?.options?.preorderMin ?? 90
                          } ${t("мин")}`,
                        },
                        max: {
                          value: moment()
                            .add(
                              selectedAffiliate?.options?.preorderMax ?? 30,
                              "days"
                            )
                            .format("YYYY-MM-DDTkk:mm"),
                          message: `${t(
                            "Максимальное время подачи не более"
                          )} ${
                            selectedAffiliate?.options?.preorderMax ?? 30
                          } ${t("д")}`,
                        },
                      }}
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-4">
                    <p className="mb-2 fs-09">{t("Способ оплаты")}</p>
                    <Row xs={2} sm={3} md={3} className="gx-2 gy-4">
                      {paymentsData.map((e) => {
                        let pay =
                          checkout.delivery == "delivery"
                            ? options?.delivery ?? []
                            : options?.pickup ?? [];

                        if (!pay[e.value]) {
                          return null;
                        }
                        return (
                          <Col>
                            <PaymentItem
                              onClick={(e) => setValue("payment", e.value)}
                              data={e}
                              active={e.value === data.payment}
                            />
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </Col>
                <Col md={12}>
                  <Textarea
                    label={t("Комментарий")}
                    name="comment"
                    placeholder={t("Введите комментарий")}
                    errors={errors}
                    defaultValue={data?.comment}
                    register={register}
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={12} xl={4}>
              <div className="cart-box mb-4">
                <h6>{t("Ваш заказ")}</h6>

                <ul className="list-unstyled">
                  {cart.map((e) => (
                    <li className="mb-2">
                      <CheckoutProduct data={e} />
                    </li>
                  ))}
                </ul>
              </div>
              {user?.point > 0 && profilePointVisible && (
                <div className="cart-box mb-4 d-flex flex-row align-items-center justify-content-between">
                  <div>
                    <a>
                      <b>
                        {t("Потратить")} {customPrice(pointCheckout, false)}{" "}
                        {t("баллов")}
                      </b>
                      <p className="fs-09 text-muted">
                        {t("У вас всего")} {customPrice(user.point, false)}{" "}
                        {t("баллов")}
                      </p>
                    </a>
                  </div>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        role="switch"
                        control={control}
                        {...register("pointSwitch")}
                      />
                    </label>
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-between my-2">
                <span>{t("Стоимость товаров")}</span>
                <span>{customPrice(price)}</span>
              </div>
              {discount > 0 && (
                <div className="d-flex justify-content-between my-2">
                  <span>{t("Скидка")}</span>
                  <span className="text-success">-{customPrice(discount)}</span>
                </div>
              )}
              {pickupDiscount > 0 && (
                <div className="d-flex justify-content-between my-2">
                  <span>{t("Скидка за самовывоз")}</span>
                  <span className="text-success">
                    -{customPrice(pickupDiscount)}
                  </span>
                </div>
              )}
              {pointCheckout > 0 && pointSwitch && (
                <div className="d-flex justify-content-between my-2">
                  <span>{t("Списание баллов")}</span>
                  <span>-{customPrice(pointCheckout)}</span>
                </div>
              )}
              <hr className="my-3" />
              <div className="mb-5">
                {totalNoDelivery != total && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-6 fs-10">{t("Сумма заказа")}</span>
                    <span className="fw-6">{customPrice(totalNoDelivery)}</span>
                  </div>
                )}
                {data.delivery == "delivery" && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-6 fs-10">{t("Доставка")}</span>
                    <span className="text-success fw-6">
                      {delivery > 0
                        ? "+" + customPrice(delivery)
                        : t("Бесплатно")}
                    </span>
                  </div>
                )}
                <div className="d-flex justify-content-between">
                  <span className="fw-7 fs-11">{t("Итого")}</span>
                  <span className="fw-7">{customPrice(total)}</span>
                </div>
              </div>
              {checkout.delivery == "delivery" &&
                zone?.data?.minPrice > totalNoDelivery && (
                  <div className="text-danger text-center">
                    {t("Минимальная сумма для доставки")}{" "}
                    {customPrice(zone?.data.minPrice)}
                  </div>
                )}
              <Button
                disabled={isValidBtn()}
                className="mt-3 fw-6 w-100"
                onClick={() => setConfirmation(true)}
              >
                {t("Оформить заказ")}
              </Button>
            </Col>
          </Row>
          <Modal
            size="md"
            show={confirmation}
            onHide={setConfirmation}
            centered
            closeButton
          >
            <Modal.Body>
              <h5 className="fw-7 h5 mt-2 mb-4 text-center">
                {t("Подтвердите заказ")}
              </h5>
              {!cart || cart?.length === 0 ? (
                <Empty
                  mini
                  text={t("Ничего нет")}
                  image={() => <EmptyCatalog />}
                />
              ) : (
                <>
                  <div className="box p-3 mb-3">
                    <div className="fs-09">
                      <div className="text-muted fs-08">
                        {selectedAffiliate?.options?.hall ?? deliveryText}
                      </div>
                      {data?.delivery == "delivery" ? (
                        <div>
                          {`${data.address.street} ${data.address.home}${
                            data.address.block
                              ? " (корпус " + data.address.block + ")"
                              : ""
                          }, подъезд ${data.address.apartment}, этаж ${
                            data.address.floor
                          }, кв ${data.address.apartment}`}
                        </div>
                      ) : data?.delivery == "pickup" ? (
                        <div>
                          {selectedAffiliate && selectedAffiliate?.full
                            ? selectedAffiliate.full
                            : selectedAffiliate.title
                            ? selectedAffiliate.title
                            : t("Нет информации")}
                          {selectedAffiliate && selectedAffiliate?.comment
                            ? "(" + selectedAffiliate.comment + ")"
                            : ""}
                        </div>
                      ) : (
                        <div>
                          {selectedAffiliate && selectedAffiliate?.full
                            ? selectedAffiliate.full
                            : selectedAffiliate.title
                            ? selectedAffiliate.title
                            : t("Нет информации")}
                          {selectedAffiliate && selectedAffiliate?.comment
                            ? "(" + selectedAffiliate.comment + ")"
                            : ""}
                        </div>
                      )}
                    </div>
                    <div className="fs-09 mt-3">
                      <div className="text-muted fs-08">
                        {t("Способ оплаты")}
                      </div>
                      <div>{paymentText}</div>
                    </div>
                    <div className="d-flex fs-09 align-items-center mt-3">
                      <p>{t("Приборов")}:</p>
                      <div className="fs-09 ms-1">{data.person}</div>
                    </div>
                    {data.comment && (
                      <div className="fs-09 mt-3">
                        <div className="text-muted fs-08">
                          {t("Комментарий")}
                        </div>
                        <div>{data.comment}</div>
                      </div>
                    )}
                  </div>
                  <p className="fw-7 px-md-3">Товары</p>
                  {cart.map((item) => (
                    <CartItem
                      data={{ ...item, themeProduct: 0, noCount: true }}
                    />
                  ))}
                  {data.delivery == "delivery" && (
                    <div className="px-md-3 d-flex justify-content-between mb-2">
                      <span className="fw-6 fs-10">{t("Доставка")}</span>
                      <span className="text-success fw-6">
                        {delivery > 0
                          ? "+" + customPrice(delivery)
                          : t("Бесплатно")}
                      </span>
                    </div>
                  )}
                  <div className="px-md-3 d-flex justify-content-between">
                    <span className="fw-7 fs-11">{t("Итого")}</span>
                    <span className="fw-7">{customPrice(total)}</span>
                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer closeButton className="fw-7">
              <Button
                type="submit"
                disabled={isLoading || isValidBtn()}
                className={"fw-6 w-100 " + (isLoading ? "loading" : "")}
                onClick={handleSubmit(onSubmit)}
              >
                {t("Подтвердить заказ")}
              </Button>
              <Button
                className="mt-3 fw-6 w-100 btn-light"
                onClick={() => setConfirmation(false)}
              >
                {t("Отмена")}
              </Button>
            </Modal.Footer>
          </Modal>
        </form>
      </Container>
    </main>
  );
};

export default Checkout;
