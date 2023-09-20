import React, { useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OrderItem from "../../components/OrderItem";
import { getOrder } from "../../services/order";
import EmptyOrders from "../../components/empty/orders";
import Empty from "../../components/Empty";

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState({
    loading: true,
    item: {},
  });

  useLayoutEffect(() => {
    getOrder(orderId)
      .then((res) => {
        console.log(res);
        setOrder({ loading: false, item: res });
      })
      .catch(() => setOrder((data) => ({ ...data, loading: false })));
  }, [orderId]);

  if (!order?.item?.id) {
    return (
      <Empty
        mini
        text="Такого заказа нет"
        desc="Возможно вы перепутали ссылку"
        image={() => <EmptyOrders />}
        button={
          <Link className="btn-primary" to="/">
            Перейти в меню
          </Link>
        }
      />
    );
  }

  return (
    <section>
      <div className="d-flex align-items-center mb-4">
        <Link to="/account/orders" className="link-return">
          <HiOutlineArrowLeftCircle />
          <span>Назад</span>
        </Link>
        <h5 className="fw-6 mb-0">Заказ #{order.item.id}</h5>
      </div>

      <Row>
        <Col lg={8} className="mb-4 mb-lg-0">
          <ul className="order-list">
            {order.item.products.map((e) => (
              <li>
                <OrderItem data={e} />
              </li>
            ))}
          </ul>
        </Col>
        <Col lg={4}>
          <div className="box">
            <div className="p-2 p-xl-3">
              <p className="fs-09 d-flex align-items-center mb-3">
                <span>Время заказа</span>
                <span className="ms-3">10:00 12&nbsp;Авг&nbsp;2023</span>
              </p>
              <div className="btn-green fs-09 rounded-3 mb-3">Готовится</div>
              <div className="order-card-delivery">
                Самовывоз <span className="dark-gray ms-1">•</span>
              </div>
              <address className="d-block fs-09 dark-gray">
                Филиал — ул. Фучика 89, д 1
              </address>

              <div className="main-color mt-4 mt-xxl-5 mb-1">Комментарий</div>
              <textarea
                disabled
                className="fs-09"
                value={"Уберите, пожалуйста, лук"}
              ></textarea>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <p>Количество персон</p>
                <div className="input w-50p py-1 px-2 rounded-4 w-fit text-center">
                  2
                </div>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <p>Доставка</p>
                <p className="main-color">бесплатно</p>
              </div>

              <div className="d-flex justify-content-between fw-6 mt-4">
                <p className="fs-11">Итоговая сумма</p>
                <p>1 880 ₽</p>
              </div>
            </div>
            <div className="btn-green rounded-0 w-100 justify-content-start">
              Списано 33 бонуса
            </div>
            <div className="p-2 p-xl-3">
              <p className="fs-09 main-color">
                34 бонуса будут начислены за этот заказ
              </p>
              <button type="submit" disabled className="btn-red w-100 mt-3">
                Отменить заказ
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default Order;
