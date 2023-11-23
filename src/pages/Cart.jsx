import React, { useCallback, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import NavTop from "../components/utils/NavTop";
// import Gifts from "../components/utils/Gifts";
import { useForm } from "react-hook-form";
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
import { deleteCart } from "../services/cart";
import { isPromo } from "../services/promo";
import { cartDeletePromo } from "../store/reducers/cartSlice";

const Cart = () => {
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const promo = useSelector((state) => state.cart.promo);
  const checkout = useSelector((state) => state.checkout);
  const address = useSelector((state) => state.address.items);
  const options = useSelector((state) => state.settings.options);
  const pointSwitch = useSelector((state) => state.checkout.data.pointSwitch);
  const {
    total = 0,
    price = 0,
    delivery,
    pointAccrual,
    pickupDiscount,
    pointCheckout,
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
    },
  });

  const count = getCount(cart);

  const dispatch = useDispatch();

  const onPromo = useCallback(
    (e) => {
      (e?.promo?.length > 0 || promo?.name?.length > 0) &&
        isPromo({
          promo: e?.promo ? e.promo : promo?.name ? promo.name : "",
          delivery: checkout.delivery,
        })
          .then(({ data }) => data?.promo && dispatch(cartPromo(data.promo)))
          .catch((err) => {
            dispatch(cartDeletePromo());
            NotificationManager.error(
              err?.response?.data?.error ?? "Такого промокода не существует"
            );
          });
    },
    [promo, checkout.delivery]
  );

  useEffect(() => {
    if (promo?.name) {
      onPromo();
      setValue("promo", "");
    }
  }, [checkout.delivery, promo]);

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
                {cart.map((e) => (
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
                  type="text"
                  name="promo"
                  placeholder="Введите промокод"
                  errors={errors}
                  register={register}
                  maxLength={100}
                />
                <button
                  type="button"
                  disabled={!isValid}
                  onClick={handleSubmit(onPromo)}
                  className="btn-10 ms-2 ms-sm-4 rounded-3"
                >
                  Применить
                </button>
              </div>

              <div className="d-flex justify-content-between my-2">
                <span>Стоимость товаров</span>
                <span>{customPrice(price)}</span>
              </div>

              {checkout.delivery == "delivery" && (
                <div className="d-flex justify-content-between my-2">
                  <span>Доставка</span>
                  <span className="text-success">
                    {delivery > 0 ? "+" + customPrice(delivery) : "Бесплатно"}
                  </span>
                </div>
              )}
              {pickupDiscount > 0 && (
                <div className="d-flex justify-content-between my-2">
                  <span>Скидка за самовывоз</span>
                  <span className="text-success">
                    -{customPrice(pickupDiscount)}
                  </span>
                </div>
              )}
              {pointCheckout > 0 && pointSwitch && (
                <div className="d-flex justify-content-between my-2">
                  <span>Списание баллов</span>
                  <span>-{customPrice(pointCheckout)}</span>
                </div>
              )}
              {pointAccrual > 0 && (
                <div className="d-flex justify-content-between my-2">
                  <span>Начислится баллов</span>
                  <span>+{customPrice(pointAccrual)}</span>
                </div>
              )}
              <hr className="my-3" />
              <div className="d-flex justify-content-between mb-5">
                <span className="fw-6 fs-11">Итоговая сумма</span>
                <span className="fw-6">{customPrice(total)}</span>
              </div>

              {options.giftVisible && <Gifts />}

              <Link
                to={
                  user?.id
                    ? address?.length === 0 && checkout.delivery == "delivery"
                      ? "/account/addresses/add"
                      : "/checkout"
                    : "/login"
                }
                className="btn-primary w-100"
              >
                <span className="fw-4">
                  {user?.id
                    ? address?.length === 0 && checkout.delivery == "delivery"
                      ? "Добавить адрес"
                      : "Далее"
                    : "Войти в профиль"}
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
