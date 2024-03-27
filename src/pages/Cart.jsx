import React, { useCallback, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import NavTop from "../components/utils/NavTop";
// import Gifts from "../components/utils/Gifts";
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
} from "../store/reducers/cartSlice";
import { IoTrashOutline } from "react-icons/io5";
import Loader from "../components/utils/Loader";
import Extras from "../components/utils/Extras";

const Cart = () => {
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const promo = useSelector((state) => state.cart.promo);
  const zone = useSelector((state) => state.cart.zone);
  const stateDelivery = useSelector((state) => state.stateDelivery);
  const pointSwitch = useSelector((state) => state.checkout?.data?.pointSwitch);
  const address = useSelector((state) => state.address.items);
  const options = useSelector((state) => state.settings.options);
  const [data, setData] = useState({ loading: true });
  const {
    total = 0,
    price = 0,
    discount = 0,
    delivery,
    person = 0,
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
  const form = useWatch({ control });
  const count = getCount(cart);

  const isGift = cart?.length > 0 ? cart.find((e) => e.type == "gift") : false;

  const dispatch = useDispatch();

  const onPromo = useCallback(
    async (e) => {
      if (e?.promo?.length > 0 || promo?.name?.length > 0) {
        isPromo({
          promo: e?.promo ? e.promo : promo?.name ? promo.name : "",
          delivery: stateDelivery,
          total,
        })
          .then((res) => {
            dispatch(cartPromo(res));
            if (res?.product?.id) {
              dispatch(updateCart({ ...res.product, cart: { count: 1 } }));
            }
          })
          .catch((error) => {
            dispatch(cartDeletePromo());
            NotificationManager.error(
              typeof error?.response?.data?.error === "string"
                ? error.response.data.error
                : "Такого промокода не существует"
            );
          });
      }
    },
    [promo, stateDelivery, total]
  );

  useEffect(() => {
    if (!promo) {
      setValue("promo", "");
    }
  }, [promo]);

  useEffect(() => {
    getCart()
      .then((res) => setData({ loading: false, ...res }))
      .catch((err) => {
        setData({ ...data, loading: false });
      });
  }, []);

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

  if (data?.loading) {
    return <Loader full />;
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
                  <li key={e.id}>
                    <CartItem data={e} />
                  </li>
                ))}
              </ul>
              {/* {options.giftVisible && !isGift && (
                <Gifts total={total} items={data?.gifts} />
              )} */}
            </Col>
            <Col xs={12} lg={4}>
              {options?.promoVisible && user?.id && !promo && (
                <>
                  <div className="fs-11 mb-1">Промокод</div>
                  <div className="mb-3">
                    <Input
                      className="w-100 mb-3"
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
                      className={
                        form?.promo?.length > 1
                          ? "btn-primary w-100 rounded-3"
                          : "btn-10 w-100 rounded-3"
                      }
                    >
                      Применить
                    </button>
                  </div>
                </>
              )}

              {person > 0 && <Extras person={person} items={data?.extras} />}

              <div className="d-flex justify-content-between my-2">
                <span>Стоимость товаров</span>
                <span>{customPrice(price)}</span>
              </div>
              {options?.promoVisible && promo && (
                <div className="d-flex justify-content-between my-2">
                  <div>
                    <div className="text-muted fs-08">Промокод</div>
                    <div className="fw-6">{promo.title.toUpperCase()}</div>
                  </div>
                  <span className="d-flex align-items-center">
                    {promo.options?.discount > 0 && (
                      <span className="text-success">
                        -{" "}
                        {Number.isInteger(Number(promo.options?.discount)) > 0
                          ? customPrice(promo.options.discount)
                          : promo.options?.discount}
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

              {stateDelivery == "delivery" && zone?.data && (
                <div className="d-flex justify-content-between my-2">
                  <span>Доставка</span>
                  <span className="text-success">
                    {delivery > 0 ? "+" + customPrice(delivery) : "Бесплатно"}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="d-flex justify-content-between my-2">
                  <span>Скидка</span>
                  <span className="text-success">-{customPrice(discount)}</span>
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

              <Link
                to={
                  user?.id
                    ? address?.length === 0 && stateDelivery == "delivery"
                      ? "/account/addresses/add"
                      : "/checkout"
                    : "/login"
                }
                className="btn-primary w-100"
              >
                <span className="fw-4">
                  {user?.id
                    ? address?.length === 0 && stateDelivery == "delivery"
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
