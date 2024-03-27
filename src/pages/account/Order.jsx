import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Empty from "../../components/Empty";
import EmptyOrders from "../../components/empty/orders";
import OrderItem from "../../components/OrderItem";
import Status from "../../components/Status";
import Loader from "../../components/utils/Loader";
import socket from "../../config/socket";
import { customPrice, deliveryData, paymentData } from "../../helpers/all";
import { getOrder } from "../../services/order";

const Order = () => {
  const { orderId } = useParams();
  const affiliates = useSelector((state) => state.affiliate.items);

  const [order, setOrder] = useState({
    loading: true,
    item: {},
  });

  const affiliate =
    order.item.delivery === "pickup" &&
    order.item.affilateId &&
    affiliates?.length > 0
      ? affiliates.find((e) => e.id === order.item.affilateId)
      : false;

  const deliveryText = deliveryData[order.item.delivery];
  const paymentText = paymentData[order.item.payment];

  useLayoutEffect(() => {
    getOrder(orderId)
      .then((res) => setOrder({ loading: false, item: res }))
      .catch(() => setOrder((data) => ({ ...data, loading: false })));
  }, [orderId]);

  useEffect(() => {
    socket.on("order/" + order.item.id, (data) => {
      if (data?.statuses?.length > 0) {
        setStatus(data.statuses[0]);
      }
    });
    return () => {
      socket.off("order/" + order.item.id);
    };
  }, []);

  if (order?.loading) {
    return <Loader full />;
  }

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
        <h5 className="fw-6 mb-0">
          Заказ #{order.item.uid ? order.item.uid : order.item.id}
        </h5>
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
          <div className="box p-2">
            <div className="p-2 p-xl-3">
              <p className="mb-3">
                <Status {...order.item} />
              </p>
              <p className="fs-09 mb-3">
                <div className="text-muted fs-08">Идентификатор</div>
                <div className="fw-6">
                  #{order.item.uid ? order.item.uid : order.item.id}
                </div>
              </p>

              <p className="fs-09 mb-3">
                <div className="text-muted fs-08">Время заказа</div>
                <div>
                  {moment(order.item.createdAt).format("DD MMM YYYY kk:mm")}
                </div>
              </p>
              {order.item.serving && (
                <p className="fs-09 mb-3">
                  <div className="text-muted fs-08">Ко времени</div>
                  <div>
                    {moment(order.item.serving).format("DD MMM YYYY kk:mm")}
                  </div>
                </p>
              )}

              <p className="fs-09 mb-3">
                <div className="text-muted fs-08">{deliveryText}</div>
                {order.item.delivery == "delivery" ? (
                  <div>
                    {`${order.item.street} ${order.item.home}${
                      order.item.block
                        ? " (корпус " + order.item.block + ")"
                        : ""
                    }, подъезд ${order.item.apartment}, этаж ${
                      order.item.floor
                    }, кв ${order.item.apartment}`}
                  </div>
                ) : (
                  <div>
                    {affiliate && affiliate?.full
                      ? affiliate.full
                      : "Нет информации"}
                    {affiliate && affiliate?.comment
                      ? "(" + affiliate.comment + ")"
                      : ""}
                  </div>
                )}
              </p>
              <p className="d-flex justify-content-between fs-09 align-items-center mb-3">
                <p>Кол-во персон</p>
                <div className="fs-09">{order.item.person}</div>
              </p>
              {order.item.description && (
                <p className="fs-09 mb-3">
                  <div className="text-muted fs-08">{deliveryText}</div>
                  <div>{order.item.description}</div>
                </p>
              )}
              {order.item.pointAccrual > 0 && (
                <div className="d-flex justify-content-between fs-09 fw-5 mb-2">
                  <div>Начисление</div>
                  <div>{customPrice(order.item.pointAccrual)}</div>
                </div>
              )}
              {order.item.pointWriting > 0 && (
                <div className="d-flex justify-content-between fs-09 fw-5 mb-2">
                  <div>Списание</div>
                  <div>{customPrice(order.item.pointAccrual)}</div>
                </div>
              )}
              {order.item.pickupDiscount > 0 && (
                <div className="d-flex justify-content-between fs-09 fw-5 mb-2">
                  <div>Самовывоз</div>
                  <div>{customPrice(order.item.pickupDiscount)}</div>
                </div>
              )}
              <div className="d-flex justify-content-between fw-6">
                <div className="fs-11">Итого</div>
                <div>{customPrice(order.item.total)}</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default Order;
