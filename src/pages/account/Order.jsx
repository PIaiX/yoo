import moment from "moment-timezone";
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
import { customPrice, deliveryData, paymentData } from "../../helpers/all";
import { getOrder } from "../../services/order";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

const Order = () => {
  const { orderId } = useParams();
  const affiliates = useSelector((state) => state.affiliate.items);
  const notification = useSelector((state) => state.notification);
  const { t } = useTranslation();

  const [order, setOrder] = useState({
    loading: true,
    item: {},
  });

  const deliveryText = order?.item?.delivery
    ? deliveryData[order.item.delivery]
    : null;

  const paymentText = order?.item?.payment
    ? paymentData[order.item.payment]
    : null;

  const onLoad = useCallback(() => {
    getOrder(orderId)
      .then((res) => setOrder({ loading: false, item: res }))
      .catch(() => setOrder((data) => ({ ...data, loading: false })));
  }, [orderId]);

  useLayoutEffect(() => {
    if (orderId) {
      onLoad();
    }
  }, [orderId, notification?.order]);

  if (order?.loading) {
    return <Loader full />;
  }

  if (!order?.item?.id) {
    return (
      <Empty
        mini
        text={t("Такого заказа нет")}
        desc={t("Возможно вы перепутали ссылку")}
        image={() => <EmptyOrders />}
        button={
          <Link className="btn-primary" to="/">
            {t("Перейти в меню")}
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
          <span>{t("Назад")}</span>
        </Link>
        <h5 className="fw-6 mb-0">
          {t("Заказ")} #{order.item.uid ? order.item.uid : order.item.id}
        </h5>
      </div>

      <Row>
        <Col lg={8} className="mb-4 mb-lg-0">
          <ul className="order-list">
            {order.item?.products?.length > 0 &&
              order.item?.products.map((e) => (
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
                <div className="text-muted fs-08">{t("Номер заказа")}</div>
                <div className="fw-6">
                  #{order.item?.uid ? order.item.uid : order.item.id}
                </div>
              </p>

              <p className="fs-09 mb-3">
                <div className="text-muted fs-08">{t("Время заказа")}</div>
                <div>
                  {moment(order.item.createdAt).format("DD MMM YYYY kk:mm")}
                </div>
              </p>
              {order.item?.serving && (
                <p className="fs-09 mb-3">
                  <div className="text-muted fs-08">{t("Ко времени")}</div>
                  <div>
                    {moment(order.item.serving).format("DD MMM YYYY kk:mm")}
                  </div>
                </p>
              )}

              <p className="fs-09 mb-3">
                <div className="text-muted fs-08">{deliveryText}</div>
                {order?.item?.delivery == "delivery" ? (
                  <div>
                    {`${order.item.street} ${order.item.home}${
                      order.item.block
                        ? " (корпус " + order.item.block + ")"
                        : ""
                    }, подъезд ${order.item.entrance}, этаж ${
                      order.item.floor
                    }, кв ${order.item.apartment}`}
                  </div>
                ) : order?.item?.delivery == "pickup" ? (
                  <div>
                    {order.item?.affiliate[0] && order.item?.affiliate[0]?.full
                      ? order.item.affiliate[0].full
                      : order.item.affiliate[0].title
                      ? order.item.affiliate[0].title
                      : t("Нет информации")}
                    {order.item?.affiliate[0] &&
                    order.item?.affiliate[0]?.comment
                      ? "(" + order.item.affiliate[0].comment + ")"
                      : ""}
                  </div>
                ) : (
                  <div>
                    {order.item?.table[0] && order.item?.table[0]?.title
                      ? order.item?.table[0].title
                      : t("Нет информации")}
                    {order.item?.table[0] && order.item?.table[0]?.options?.hall
                      ? "(" + order.item.table[0].options.hall + ")"
                      : ""}
                  </div>
                )}
              </p>
              <p className="fs-09 mb-3">
                <div className="text-muted fs-08">{t("Способ оплаты")}</div>
                <div>{paymentText}</div>
              </p>
              <p className="d-flex justify-content-between fs-09 align-items-center mb-3">
                <p>{t("Приборов")}</p>
                <div className="fs-09">{order.item.person}</div>
              </p>
              {order.item?.promo && order.item?.promo[0]?.title && (
                <p className="fs-09 mb-3">
                  <div className="text-muted fs-08">{t("Промокод")}</div>
                  <div>{order.item.promo[0].title}</div>
                </p>
              )}
              {order.item?.comment && (
                <p className="fs-09 mb-3">
                  <div className="text-muted fs-08">{t("Комментарий")}</div>
                  <div>{order.item.comment}</div>
                </p>
              )}
              {order.item?.description && (
                <p className="fs-09 mb-3">
                  <div className="text-muted fs-08">{t(deliveryText)}</div>
                  <div>{order.item.description}</div>
                </p>
              )}
              {order.item.pointAccrual > 0 && (
                <div className="d-flex justify-content-between fs-09 fw-5 mb-2">
                  <div>{t("Начисление")}</div>
                  <div>+{customPrice(order.item.pointAccrual)}</div>
                </div>
              )}
              {order.item.pointWriting > 0 && (
                <div className="d-flex justify-content-between fs-09 fw-5 mb-2">
                  <div>{t("Списание")}</div>
                  <div>-{customPrice(order.item.pointAccrual)}</div>
                </div>
              )}
              {order.item.pickupDiscount > 0 && (
                <div className="d-flex justify-content-between fs-09 fw-5 mb-2">
                  <div>{t("Самовывоз")}</div>
                  <div>-{customPrice(order.item.pickupDiscount)}</div>
                </div>
              )}
              {order.item.deliveryPrice > 0 && (
                <div className="d-flex justify-content-between fs-09 fw-5 mb-2">
                  <div>{t("Доставка")}</div>
                  <div>+{customPrice(order.item.deliveryPrice)}</div>
                </div>
              )}
              {order.item.total > 0 && (
                <div className="d-flex justify-content-between fs-09 fw-5 mb-2">
                  <div>{t("Сумма товаров")}</div>
                  <div>{customPrice(order.item.total)}</div>
                </div>
              )}
              <div className="d-flex justify-content-between fw-7">
                <div className="fs-11">{t("Итого")}</div>
                <div>
                  {customPrice(
                    order.item.total -
                      (order.item.pickupDiscount ?? 0) -
                      (order.item.discount ?? 0) -
                      (order.item.pointWriting ?? 0) +
                      (order.item.deliveryPrice ?? 0)
                  )}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default Order;
