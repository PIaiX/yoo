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
import {
  cartDeleteProduct,
  cartDeletePromo,
  resetCart,
} from "../store/reducers/cartSlice";
import {
  editDeliveryCheckout,
  resetCheckout,
  setCheckout,
} from "../store/reducers/checkoutSlice";
import CartItem from "../components/CartItem";
import { setUser } from "../store/reducers/authSlice";
import { IoTimeOutline, IoTrashOutline } from "react-icons/io5";
import { getDelivery } from "../services/order";
import { cartZone } from "../store/reducers/cartSlice";

const Checkout = () => {
  const { t } = useTranslation();
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const paymentsData = [
    {
      id: 1,
      title: t("Онлайн оплата"),
      value: "online",
      main: true,
    },
    {
      id: 2,
      title: t("Картой при получении"),
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
  const addressData = useSelector((state) => state.address.items);
  const affiliate = useSelector((state) => state.affiliate.items);
  const city = useSelector((state) => state.affiliate.city);
  const tables = useSelector((state) => state.affiliate.tables);
  const selectedAffiliate = useSelector((state) => state.affiliate?.active);
  const selectedTable = useSelector((state) => state.affiliate.table);
  const options = useSelector((state) => state.settings.options);
  const [confirmation, setConfirmation] = useState(false);
  const [address, setAddress] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

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

  const isWorkStatus =
    selectedAffiliate?.options?.work &&
    selectedAffiliate.options.work[moment().weekday()].end &&
    selectedAffiliate.options.work[moment().weekday()].start &&
    !isWork(
      selectedAffiliate.options.work[moment().weekday()].start,
      selectedAffiliate.options.work[moment().weekday()].end
    );

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
      email: checkout?.data?.email ?? user.email ?? "",
      serving: checkout?.data?.serving ?? "",
      servingCheck:
        checkout?.data?.serving ?? checkout?.data?.servingCheck ?? "",
      delivery: checkout.delivery ?? "delivery",
      payment: checkout?.data?.payment ?? "cash",
      person: person > 0 ? person : checkout?.data?.person ?? 1,
      comment: checkout?.data?.comment ?? "",

      address:
        addressData?.length > 0
          ? addressData.filter(
              (e) =>
                e?.city?.toLowerCase() === city?.title?.toLowerCase() ||
                e?.region?.toLowerCase() === city?.region?.toLowerCase() ||
                e?.area?.toLowerCase() === city?.area?.toLowerCase()
            )
          : false,
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
      (zone?.data?.minPrice > totalNoDelivery || !zone?.data)) ||
    (data?.delivery == "delivery" &&
      (!Array.isArray(address) || address.length <= 0));

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
    if (isWorkStatus && !showDateTimePicker && !data.serving) {
      setShowDateTimePicker(true);
    }
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

  useLayoutEffect(() => {
    if (addressData?.length > 0) {
      setAddress(
        city?.title
          ? addressData.filter(
              (e) =>
                e?.city?.toLowerCase() === city?.title?.toLowerCase() ||
                e?.region?.toLowerCase() === city?.region?.toLowerCase() ||
                e?.area?.toLowerCase() === city?.area?.toLowerCase()
            )
          : addressData
      );
    }
  }, [addressData, city]);

  useLayoutEffect(() => {
    if (address?.length > 0) {
      setValue("address", address.find((e) => e.main) ?? address[0] ?? false);
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

  useEffect(() => {
    const fetchDeliveryData = async () => {
      if (checkout?.delivery === "delivery" && user?.id) {
        const selectedAddress = address ? address.find((e) => e.main) : false;
        const weight = cart.reduce((sum, item) => {
          const itemWeight = item.energy?.weight ?? 0;
          const itemCount = item.cart?.count ?? 0;
          return sum + itemWeight * itemCount;
        }, 0);

        if (selectedAddress) {
          try {
            const res = await getDelivery({
              distance: true,
              addressId: selectedAddress.id,
              weight,
            });
            if (res) {
              dispatch(cartZone({ data: res?.zone, distance: res?.distance }));
            }
          } catch (error) {
            dispatch(cartZone({ data: false, distance: false }));
          }
        }
      }
    };

    if (!hasFetched) {
      fetchDeliveryData().then(() => setHasFetched(true));
    }
  }, [address, checkout.delivery, cart, hasFetched]);

  useEffect(() => {
    setHasFetched(false);
  }, [address, checkout.delivery, cart]);

  const onSubmit = useCallback(
    (data) => {
      if (data.serving) {
        if (
          !isWork(
            selectedAffiliate.options.work[moment(data.serving).weekday()]
              .start,
            selectedAffiliate.options.work[moment(data.serving).weekday()].end,
            moment(data.serving).format("HH:mm")
          )
        ) {
          return NotificationManager.error(
            t("Нельзя заказать на данное время")
          );
        }
      }

      if (data.delivery == "delivery") {
        if (!data.address) {
          return NotificationManager.error(t("Добавьте адрес доставки"));
        }

        if (!zone?.data || !zone?.data?.status) {
          return NotificationManager.error(
            t("По данному адресу доставка не производится")
          );
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

          if (data?.pointWriting > 0 || data?.pointSwitch) {
            await checkAuth().then((auth) => auth && dispatch(setUser(auth)));
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
    [data, selectedAffiliate, zone?.data]
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

  // if (
  //   data?.delivery == "delivery" &&
  //   (!Array.isArray(address) || address.length <= 0)
  // ) {
  //   return (
  //     <Empty
  //       text={t("Адрес не добавлен")}
  //       desc={t("Создайте новый адрес для доставки заказа")}
  //       image={() => <EmptyAddresses />}
  //       button={
  //         <Link className="btn-primary" to="/account/addresses/add">
  //           {t("Добавить адрес")}
  //         </Link>
  //       }
  //     />
  //   );
  // }

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
  // if (
  //   selectedAffiliate?.options?.work &&
  //   selectedAffiliate.options.work[moment().weekday()].end &&
  //   selectedAffiliate.options.work[moment().weekday()].start &&
  //   !isWork(
  //     selectedAffiliate.options.work[moment().weekday()].start,
  //     selectedAffiliate.options.work[moment().weekday()].end
  //   )
  // ) {
  //   return (
  //     <Empty
  //       text={`${t("Мы работаем с")} ${
  //         selectedAffiliate.options.work[moment().weekday()].start
  //       } ${t("до")} ${selectedAffiliate.options.work[moment().weekday()].end}`}
  //       desc={t("Зайдите к нам немного позже")}
  //       image={() => <EmptyWork />}
  //       button={
  //         <Link className="btn-primary" to="/">
  //           {t("Перейти на главную")}
  //         </Link>
  //       }
  //     />
  //   );
  // }

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
                  {data?.delivery == "delivery" &&
                  (!Array.isArray(address) || address.length <= 0) ? (
                    <p className="text-muted fs-09 mt-2 mb-4 fw-6 btn btn-light">
                      <Link to="/account/addresses/add">
                        {t("Добавить адрес доставки")}
                      </Link>
                    </p>
                  ) : data.delivery == "delivery" ? (
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
                {options?.payment?.email && (
                  <Col>
                    <div className="mb-4">
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        inputMode="email"
                        placeholder={t("Введите email")}
                        errors={errors}
                        register={register}
                        validation={{
                          required: t("Введите email"),
                          maxLength: {
                            value: 250,
                            message: t("Максимально 250 символов"),
                          },
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: t("Неверный формат Email"),
                          },
                        }}
                      />
                    </div>
                  </Col>
                )}
                {!options?.person && (
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
                )}
                <Col md={6}>
                  <div className="mb-4">
                    <p>
                      <a
                        onClick={() => setShowDateTimePicker((prev) => !prev)}
                        className="d-inline-flex align-items-center"
                      >
                        <IoTimeOutline size={25} className="me-2" />
                        <span>
                          <p>
                            {data.delivery == "delivery"
                              ? t("Привезем")
                              : t("Подадим")}{" "}
                            {data.serving
                              ? t("к")
                              : zone?.data?.time > 0
                              ? t("с")
                              : t("в")}{" "}
                            <b>
                              {data.serving
                                ? moment(data.serving).format("DD.MM.YYYY") ===
                                  moment().format("DD.MM.YYYY")
                                  ? moment(data.serving).format("kk:mm")
                                  : moment(data.serving).format(
                                      "DD.MM.YYYY kk:mm"
                                    )
                                : zone?.data?.time > 0
                                ? moment()
                                    .add(zone.data.time, "minutes")
                                    .format("kk:mm") +
                                  " - " +
                                  moment()
                                    .add(zone.data.time + 30, "minutes")
                                    .format("kk:mm")
                                : t("ближайшее время")}
                            </b>
                          </p>
                          <p className="text-muted fs-08">
                            {t("Изменить дату и время")}
                          </p>
                        </span>
                      </a>
                    </p>
                    <Modal
                      size="sm"
                      show={showDateTimePicker}
                      onHide={setShowDateTimePicker}
                      centered
                      closeButton
                      backdrop="static"
                      keyboard={isWorkStatus ? false : true}
                    >
                      <Modal.Body>
                        <h5
                          className={
                            isWorkStatus
                              ? "fw-7 h5 mt-2 mb-2 text-center"
                              : "fw-7 h5 mt-2 mb-4 text-center"
                          }
                        >
                          {data.delivery == "delivery"
                            ? t("Время доставки")
                            : t("Время подачи")}
                        </h5>
                        {isWorkStatus && (
                          <p className="text-muted text-center mb-3">{`${t(
                            "Мы работаем с"
                          )} ${
                            selectedAffiliate.options.work[moment().weekday()]
                              .start
                          } ${t("до")} ${
                            selectedAffiliate.options.work[moment().weekday()]
                              .end
                          }`}</p>
                        )}
                        <Input
                          name="servingCheck"
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

                        {!isWorkStatus || data?.serving ? (
                          <>
                            <Button
                              className="mt-3 w-100"
                              onClick={() => {
                                setShowDateTimePicker(false);
                                setValue("serving", null);
                                setValue("servingCheck", null);
                              }}
                            >
                              Очистить
                            </Button>
                            <Button
                              className="btn-light mt-3 w-100"
                              onClick={() => {
                                setShowDateTimePicker(false);
                              }}
                            >
                              Отмена
                            </Button>
                          </>
                        ) : (
                          <Button
                            disabled={!isValid || !data?.servingCheck}
                            className="mt-3 w-100"
                            onClick={() => {
                              setShowDateTimePicker(false);
                              if (data?.servingCheck) {
                                setValue("serving", data.servingCheck);
                              }
                            }}
                          >
                            Продолжить
                          </Button>
                        )}
                      </Modal.Body>
                    </Modal>
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
              {pointAccrual > 0 && (
                <div className="d-flex justify-content-between my-2">
                  <span>{t("Начислится баллов")}</span>
                  <span>+{customPrice(pointAccrual)}</span>
                </div>
              )}
              {options?.promoVisible && promo && (
                <div className="d-flex justify-content-between my-2">
                  <div>
                    <div className="text-muted fs-08">{t("Промокод")}</div>
                    <div className="fw-6">{promo.title.toUpperCase()}</div>
                  </div>
                  <span className="d-flex align-items-center">
                    {Number(promo.options?.discount) > 0 && (
                      <span className="text-success">
                        -{" "}
                        {Number.isInteger(Number(promo.options?.discount)) > 0
                          ? customPrice(promo.options.discount)
                          : promo.options?.discount}
                      </span>
                    )}
                    {Number(promo.options?.percent > 0) && (
                      <span className="text-success">
                        -{" "}
                        {Number.isInteger(Number(promo.options?.percent)) > 0
                          ? promo.options?.percent + "%"
                          : promo.options?.percent}
                      </span>
                    )}
                    <a
                      onClick={() => {
                        dispatch(cartDeleteProduct(promo.product));
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
              <hr className="my-3" />
              <div className="mb-5">
                {totalNoDelivery != total && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-6 fs-10">{t("Сумма заказа")}</span>
                    <span className="fw-6">{customPrice(totalNoDelivery)}</span>
                  </div>
                )}
                {data?.delivery == "delivery" && zone?.data && (
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
              zone?.data?.minPrice > totalNoDelivery ? (
                <div className="text-danger text-center">
                  {t("Минимальная сумма для доставки")}{" "}
                  {customPrice(zone?.data.minPrice)}
                </div>
              ) : (
                data?.delivery == "delivery" &&
                !zone?.data && (
                  <div className="text-danger text-center">
                    {t("Доставка на данный адрес не производится")}
                  </div>
                )
              )}
              {data?.delivery == "delivery" &&
                (!Array.isArray(address) || address.length <= 0) && (
                  <div className="text-danger text-center">
                    {t("Добавьте адрес доставки")}
                  </div>
                )}
              <Button
                disabled={isValidBtn() || (isWorkStatus && !data.serving)}
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
                  {data?.delivery == "delivery" && zone?.data && (
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
