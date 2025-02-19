import moment from "moment-timezone";
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Button, Modal, Col, Row, Container } from "react-bootstrap";
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
import { isWork, weekday } from "../helpers/all";
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
import { IoTrashOutline } from "react-icons/io5";
import { getDelivery } from "../services/order";
import { cartZone } from "../store/reducers/cartSlice";
import TimePicker from "../components/TimePicker";
import Loader from "../components/utils/Loader";

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
      phone: checkout?.data?.phone ?? user.phone ?? "",
      email: checkout?.data?.email ?? user.email ?? "",
      serving: checkout?.data?.serving ?? "",
      servingRadio: checkout?.data?.servingRadio ?? false,
      delivery: checkout.delivery ?? "delivery",
      payment: checkout?.data?.payment ?? "cash",
      person: person > 0 ? person : checkout?.data?.person ?? 1,
      comment: checkout?.data?.comment ?? "",
      address: checkout?.data?.address ?? false,
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
  console.log(data);
  const deliveryText = data?.delivery ? deliveryData[data.delivery] : null;

  const paymentText = data?.payment ? paymentData[data.payment] : null;

  // const isWorkStatus =
  //   (!data.serving &&
  //     selectedAffiliate?.options?.work &&
  //     selectedAffiliate.options.work[weekday]?.end &&
  //     selectedAffiliate.options.work[weekday]?.start &&
  //     isWork(
  //       selectedAffiliate.options.work[weekday].start,
  //       selectedAffiliate.options.work[weekday].end
  //     )) ||
  //   (data.serving &&
  //     selectedAffiliate?.options?.work &&
  //     selectedAffiliate.options.work[moment(data.serving).weekday()]?.end &&
  //     selectedAffiliate.options.work[moment(data.serving).weekday()]?.start &&
  //     moment(data.serving).isAfter(moment()) &&
  //     isWork(
  //       selectedAffiliate.options.work[moment(data.serving).weekday()].start,
  //       selectedAffiliate.options.work[moment(data.serving).weekday()].end,
  //       moment(data.serving).format("HH:mm")
  //     )) ||
  //   (moment(data.serving).isBefore(moment()) &&
  //     isWork(
  //       moment()
  //         .add((selectedAffiliate?.options?.preorderMin ?? 90) - 1, "minutes")
  //         .format("HH:mm"),
  //       selectedAffiliate.options.work[moment(data.serving).weekday()].end,
  //       moment(data.serving).format("HH:mm")
  //     ));

  const isWorkStatus =
    (!data.serving &&
      selectedAffiliate?.options?.work &&
      selectedAffiliate.options.work[weekday]?.end &&
      selectedAffiliate.options.work[weekday]?.start &&
      isWork(
        // Используем исправленную isWork
        selectedAffiliate.options.work[weekday].start,
        selectedAffiliate.options.work[weekday].end
      )) || // <--- ВАЖНО: Здесь нужен || (ИЛИ), а не && (И)
    (data.serving &&
      selectedAffiliate?.options?.work &&
      selectedAffiliate.options.work[moment(data.serving).weekday()]?.end &&
      selectedAffiliate.options.work[moment(data.serving).weekday()]?.start &&
      moment(data.serving).isSameOrAfter(moment()) && // Используем isSameOrAfter
      isWork(
        // Используем исправленную isWork
        selectedAffiliate.options.work[moment(data.serving).weekday()].start,
        selectedAffiliate.options.work[moment(data.serving).weekday()].end,
        moment(data.serving).format("HH:mm")
      )) || // <--- ВАЖНО: Здесь нужен || (ИЛИ), а не && (И)
    (moment(data.serving).isBefore(moment()) && // Если нужно включить текущее время, используйте isSameOrBefore
      isWork(
        // Используем исправленную isWork
        moment()
          .add(selectedAffiliate?.options?.preorderMin ?? 90, "minutes")
          .format("HH:mm"),
        selectedAffiliate.options.work[moment(data.serving).weekday()].end,
        moment(data.serving).format("HH:mm")
      ));

  const isValidBtn = () =>
    isLoading ||
    !isValid ||
    !user?.id ||
    !zone?.data ||
    (!(
      data?.delivery === "delivery" && zone?.data?.minPrice > totalNoDelivery
    ) &&
      !(data?.delivery === "delivery" && address.length === 0));

  const CartItems = memo(({ items }) => {
    return items.map((e) => (
      <li key={e.id} className="mb-2">
        <CheckoutProduct data={e} />
      </li>
    ));
  });

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
  }, [data, end]);

  useEffect(() => {
    if (isAuth && !end) {
      setValue(
        "pointWriting",
        data.pointSwitch && pointCheckout > 0 ? pointCheckout : 0
      );
    }
  }, [data.pointSwitch, pointCheckout, end]);

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
      setValue("address", address.find((e) => e.main) || address[0] || false);
    }

    if (zone?.data?.affiliateId && checkout.delivery === "delivery") {
      setValue("affiliateId", zone.data.affiliateId);
    } else if (selectedAffiliate?.id && checkout.delivery == "pickup") {
      setValue("affiliateId", selectedAffiliate.id);
    }
  }, [address, zone, checkout.delivery, selectedAffiliate]);

  useEffect(() => {
    if (selectedTable?.id && checkout.delivery == "hall") {
      setValue("affiliateId", selectedTable.affiliateId);
      setValue("tableId", selectedTable.id);
    }
  }, [selectedTable]);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        if (checkout?.delivery !== "delivery" || !user?.id) return false;

        const selectedAddress = address?.find((e) => e.main) || address[0];

        if (!selectedAddress) return false;

        const weight = cart.reduce((sum, item) => {
          return sum + (item.energy?.weight ?? 0) * (item.cart?.count ?? 0);
        }, 0);

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
        return false;
      }
    };

    fetchDeliveryData();
  }, [address, checkout.delivery, cart, city, user?.id]);

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

  // useEffect(() => {
  //   const selectedTime = data.servingTime;
  //   const currentDate = data.servingDate
  //     ? moment(data.servingDate).format("YYYY-MM-DD")
  //     : moment().format("YYYY-MM-DD");

  //   // Проверяем, попадает ли выбранное время в диапазон
  //   const minTime = moment(
  //     selectedAffiliate.options.work[weekday].start,
  //     "HH:mm"
  //   ).add(selectedAffiliate?.options?.preorderMin ?? 90, "minutes");

  //   const maxTime = moment(
  //     selectedAffiliate.options.work[weekday].end,
  //     "HH:mm"
  //   );

  //   if (moment(selectedTime, "HH:mm").isBetween(minTime, maxTime, null, "[]")) {
  //     setValue(
  //       "serving",
  //       moment(currentDate + "T" + selectedTime).format("YYYY-MM-DDTHH:mm")
  //     );
  //   } else {
  //     setValue("serving", null);
  //   }
  // }, [data.servingTime, data.servingDate]);

  useEffect(() => {
    if (data.serving && (!data.servingRadio || data.servingRadio === "false")) {
      setValue("serving", null);
    }
  }, [data.servingRadio]);

  if (!checking) {
    return <Loader full />;
  }

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

  return (
    <main>
      <Meta title={t("Оформление заказа")} />
      <Container>
        <NavTop
          toBack={true}
          home={false}
          breadcrumbs={[
            {
              title: t("Корзина"),
              link: "/cart",
              count: 1,
              active: true,
            },
            {
              title: t("Оформление заказа"),
              count: 2,
              active: true,
            },
          ]}
        />

        <form className="cart">
          <Row className="g-4 g-xxl-5 d-flex justify-content-between">
            <Col xs={12} xl={6}>
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
                <Col md={12}>
                  <div className="mb-4">
                    <label className="d-flex align-items-center flex-row mb-3">
                      <input
                        type="radio"
                        name="servingRadio"
                        id="servingRadio"
                        defaultChecked={data.servingRadio === false}
                        value={false}
                        {...register("servingRadio")}
                      />
                      <span className="ms-2">
                        {data.delivery == "delivery"
                          ? t("Привезем")
                          : t("Подадим")}{" "}
                        {t("в")} <b>{t("ближайшее время")}</b>
                      </span>
                    </label>
                    <label className="d-flex align-items-center mb-3">
                      <input
                        type="radio"
                        name="servingRadio"
                        id="servingRadio2"
                        defaultChecked={data.servingRadio === true}
                        value={true}
                        {...register("servingRadio")}
                      />
                      <span className="ms-2">
                        {data.delivery == "delivery"
                          ? t("Привезем")
                          : t("Подадим")}{" "}
                        {t("ко")} <b>{t("времени")}</b>
                      </span>
                    </label>
                    {data?.servingRadio === "true" && (
                      <div className="text-muted ms-4">
                        {/* <div>
                          <Input
                            errors={errors}
                            register={register}
                            name="servingDate"
                            type="date"
                            defaultValue={moment(data.serving).format(
                              "YYYY-MM-DD"
                            )}
                            validation={{
                              min: {
                                value: moment()
                                  .add(
                                    selectedAffiliate?.options?.preorderMin ??
                                      90,
                                    "minutes"
                                  )
                                  .format("YYYY-MM-DD"),
                                message: `${t("Минимум ")} ${moment()
                                  .add(
                                    selectedAffiliate?.options?.preorderMin ??
                                      90,
                                    "minutes"
                                  )
                                  .format("YYYY-MM-DD")}`,
                              },
                              max: {
                                value: moment()
                                  .add(
                                    selectedAffiliate?.options?.preorderMax ??
                                      30,
                                    "days"
                                  )
                                  .format("YYYY-MM-DD"),
                                message: `${t("Максимум ")} ${moment()
                                  .add(
                                    selectedAffiliate?.options?.preorderMax ??
                                      30,
                                    "days"
                                  )
                                  .format("YYYY-MM-DD")}`,
                              },
                            }}
                            min={moment()
                              .add(
                                selectedAffiliate?.options?.preorderMin ?? 90,
                                "minutes"
                              )
                              .format("YYYY-MM-DD")}
                            max={moment()
                              .add(
                                selectedAffiliate?.options?.preorderMax ?? 30,
                                "days"
                              )
                              .format("YYYY-MM-DD")}
                            className="input-date me-2"
                          />
                        </div> */}
                        {/* <div>
                          <Input
                            errors={errors}
                            register={register}
                            type="time"
                            name="servingTime"
                            className="input-time"
                            defaultValue={
                              data.serving
                                ? moment(data.serving).format("HH:mm")
                                : null
                            }
                            validation={{
                              min: {
                                value:
                                  moment().isSame(
                                    moment(data.serving),
                                    "day"
                                  ) &&
                                  moment().isAfter(
                                    moment(
                                      selectedAffiliate.options.work[weekday]
                                        .start,
                                      "HH:mm"
                                    )
                                  )
                                    ? moment
                                        .max(
                                          moment(
                                            selectedAffiliate.options.work[
                                              weekday
                                            ].start,
                                            "HH:mm"
                                          ).add(
                                            selectedAffiliate?.options
                                              ?.preorderMin ?? 90,
                                            "minutes"
                                          ),
                                          moment() // Текущее время
                                        )
                                        .format("HH:mm")
                                    : moment(
                                        selectedAffiliate.options.work[weekday]
                                          .start,
                                        "HH:mm"
                                      )
                                        .add(
                                          selectedAffiliate?.options
                                            ?.preorderMin ?? 90,
                                          "minutes"
                                        )
                                        .format("HH:mm"),
                                message: `${t("Минимум ")} ${
                                  moment().isSame(
                                    moment(data.serving),
                                    "day"
                                  ) &&
                                  moment().isAfter(
                                    moment(
                                      selectedAffiliate.options.work[weekday]
                                        .start,
                                      "HH:mm"
                                    )
                                  )
                                    ? moment
                                        .max(
                                          moment(
                                            selectedAffiliate.options.work[
                                              weekday
                                            ].start,
                                            "HH:mm"
                                          ).add(
                                            selectedAffiliate?.options
                                              ?.preorderMin ?? 90,
                                            "minutes"
                                          ),
                                          moment() // Текущее время
                                        )
                                        .format("HH:mm")
                                    : moment(
                                        selectedAffiliate.options.work[weekday]
                                          .start,
                                        "HH:mm"
                                      )
                                        .add(
                                          selectedAffiliate?.options
                                            ?.preorderMin ?? 90,
                                          "minutes"
                                        )
                                        .format("HH:mm")
                                }`,
                              },
                              max: {
                                value: data.servingDate
                                  ? moment(
                                      selectedAffiliate.options.work[
                                        moment(data.servingDate).weekday()
                                      ].end,
                                      "HH:mm"
                                    ).format("HH:mm")
                                  : moment(
                                      selectedAffiliate.options.work[weekday]
                                        .end,
                                      "HH:mm"
                                    ).format("HH:mm"), // Используем значение end для выбранного дня
                                message: `${t("Максимум ")} ${
                                  data.servingDate
                                    ? moment(
                                        selectedAffiliate.options.work[
                                          moment(data.servingDate).weekday()
                                        ].end,
                                        "HH:mm"
                                      ).format("HH:mm")
                                    : moment(
                                        selectedAffiliate.options.work[weekday]
                                          .end,
                                        "HH:mm"
                                      ).format("HH:mm")
                                }`, // Сообщение с максимальным временем для выбранного дня
                              },
                            }}
                          />
                        </div> */}
                        <TimePicker
                          startTime={
                            selectedAffiliate.options.work[weekday].start
                          }
                          endTime={selectedAffiliate.options.work[weekday].end}
                          interval={selectedAffiliate?.options?.interval}
                          minMinuteTime={
                            selectedAffiliate?.options?.preorderMin
                          }
                          maxDayDate={selectedAffiliate?.options?.preorderMax}
                          value={data.serving}
                          onChange={(e) => {
                            setValue("serving", e);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-4">
                    <p className="mb-2 fs-09">{t("Способ оплаты")}</p>
                    <Row className="gx-2 gy-2">
                      {paymentsData.map((e, index) => {
                        let pay =
                          checkout.delivery == "delivery"
                            ? options?.delivery ?? []
                            : options?.pickup ?? [];

                        let count = paymentsData.filter(
                          (item) => pay[item.value]
                        )?.length;

                        if (!pay[e.value]) {
                          return null;
                        }
                        return (
                          <Col
                            key={index}
                            xs={12}
                            sm={count > 2 ? 4 : count === 1 ? 12 : 6}
                            md={count > 2 ? 4 : count === 1 ? 12 : 6}
                          >
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
                  <CartItems items={cart} />
                </ul>
              </div>
              {user?.point > 0 && profilePointVisible && (
                <div className="cart-box px-3 mb-4 d-flex flex-row align-items-center justify-content-between">
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

                  <label>
                    <input
                      type="checkbox"
                      role="switch"
                      control={control}
                      {...register("pointSwitch")}
                    />
                  </label>
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
              ) : !isWorkStatus ? (
                <div className="text-danger text-center">
                  {`${t("Мы работаем с")} ${
                    selectedAffiliate.options.work[weekday].start
                  } ${t("до")} ${selectedAffiliate.options.work[weekday].end}`}
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
                disabled={!isValidBtn() || !isWorkStatus}
                className="mt-3 btn-lg fw-6 w-100"
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
                disabled={!isValidBtn() || !isWorkStatus}
                className={"fw-6 btn-lg w-100 " + (isLoading ? "loading" : "")}
                onClick={handleSubmit(onSubmit)}
              >
                {t("Подтвердить заказ")}
              </Button>
              <Button
                className="mt-3 btn-lg fw-6 w-100 btn-light"
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
