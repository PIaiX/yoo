import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import Empty from "../../components/Empty";
import EmptyOrders from "../../components/empty/orders";
import Meta from "../../components/Meta";
import Status from "../../components/Status";
import Loader from "../../components/utils/Loader";
import socket from "../../config/socket";
import { customPrice, deliveryData, paymentData } from "../../helpers/all";
import { getOrders } from "../../services/order";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState({
    loading: true,
    items: [],
    pagination: {},
  });
  const navigate = useNavigate();

  const orderColumns = [
    {
      name: "id",
      selector: "id",
      width: 110,
      cell: (row) => (
        <span className="fw-6">
          #{row.uid ? row.uid.toUpperCase() : row.id}
        </span>
      ),
    },
    {
      name: t("Дата"),
      selector: "createdAt",
      cell: (row) => moment(row.createdAt).format("DD MMM YYYY kk:mm"),
    },
    {
      name: t("Статус"),
      selector: "status",
      cell: (row) => <Status {...row} />,
    },
    {
      name: t("Способ доставки"),
      selector: "deliveryType",
      cell: (row) => deliveryData[row.delivery],
    },
    {
      name: t("Способ оплаты"),
      selector: "payment",
      cell: (row) => paymentData[row.payment],
    },
    {
      name: t("Итого"),
      width: "150px",
      align: "right",
      selector: "total",
      cell: (row) => (
        <div className="d-flex align-items-center">
          <span>{customPrice(row.total)}</span>
        </div>
      ),
    },
  ];

  useLayoutEffect(() => {
    getOrders()
      .then((res) => setOrders((data) => ({ ...data, loading: false, ...res })))
      .catch(() => setOrders((data) => ({ ...data, loading: false })));
  }, []);

  useEffect(() => {
    socket.on("orders/" + user.id, (data) => {
      if (data?.statuses?.length > 0) {
        let newOrders = orders.items.map((e) => {
          if (e.id === data.id) {
            return data;
          }
          return e;
        });
        if (newOrders) {
          setOrders({ loading: false, items: newOrders });
        }
      }
    });
    return () => {
      socket.off("orders/" + user.id);
    };
  }, [orders.items]);

  if (orders?.loading) {
    return <Loader full />;
  }

  if (!Array.isArray(orders.items) || orders.items.length <= 0) {
    return (
      <>
        <Meta title={t("Заказы")} />
        <div className="d-flex d-lg-none align-items-center mb-4">
          <Link to="/account" className="link-return">
            <HiOutlineArrowLeftCircle />
            <span>{t("Назад")}</span>
          </Link>
          <h6 className="fs-12 mb-0">{t("Заказы")}</h6>
        </div>
        <Empty
          mini
          text={t("Заказов пока нет")}
          desc={t("Перейдите к меню, чтобы сделать первый заказ")}
          image={() => <EmptyOrders />}
          button={
            <Link className="btn-primary" to="/">
              {t("Перейти в меню")}
            </Link>
          }
        />
      </>
    );
  }

  return (
    <section className="sec-orders">
      <Meta title={t("Заказы")} />
      <div className="d-flex d-lg-none align-items-center mb-4">
        <Link to="/account" className="link-return">
          <HiOutlineArrowLeftCircle />
          <span>{t("Назад")}</span>
        </Link>
        <h6 className="fs-12 mb-0">{t("Заказы")}</h6>
      </div>
      <DataTable
        onClick={(e) => navigate("/account/orders/" + e.id)}
        columns={orderColumns}
        data={orders.items}
        pagination={orders.pagination}
      />
    </section>
  );
};

export default Orders;
