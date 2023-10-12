import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import { IoCreateOutline, IoEye, IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import DataTable from "../../components/DataTable";
import Empty from "../../components/Empty";
import EmptyOrders from "../../components/empty/orders";
import Meta from "../../components/Meta";
import Loader from "../../components/utils/Loader";
import { customPrice, deliveryData, paymentData } from "../../helpers/all";
import { getOrders } from "../../services/order";

const Orders = () => {
  const [orders, setOrders] = useState({
    loading: true,
    items: [],
    pagination: {},
  });

  const orderColumns = [
    {
      name: "Дата",
      selector: "createdAt",
      cell: (row) => moment(row.createdAt).format("DD MMM YYYY kk:mm"),
    },
    {
      name: "Статус",
      selector: "status",
      cell: (row) => <Badge bg="success">Принят</Badge>,
    },
    {
      name: "Способ",
      selector: "deliveryType",
      cell: (row) => deliveryData[row.delivery],
    },
    {
      name: "Итого",
      width: "150px",
      align: "right",
      selector: "total",
      cell: (row) => (
        <div className="d-flex align-items-center">
          <span>{customPrice(row.total)}</span>
        </div>
      ),
    },
    {
      width: "50px",
      selector: "action",
      align: "right",
      cell: (row) => (
        <Link to={"/account/orders/" + row.id}>
          <IoEyeOutline size={20} />
        </Link>
      ),
    },
  ];

  useLayoutEffect(() => {
    getOrders()
      .then((res) => setOrders((data) => ({ ...data, loading: false, ...res })))
      .catch(() => setOrders((data) => ({ ...data, loading: false })));
  }, []);

  if (orders?.loading) {
    return <Loader full />;
  }

  if (!Array.isArray(orders.items) || orders.items.length <= 0) {
    return (
      <Empty
        mini
        text="Заказов пока нет"
        desc="Перейдите к меню, чтобы сделать первый заказ"
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
    <section className="sec-orders">
      <Meta title="Заказы" />
      <div className="d-flex d-lg-none align-items-center mb-4">
        <Link to="/account" className="link-return">
          <HiOutlineArrowLeftCircle />
          <span>Назад</span>
        </Link>
        <h6 className="fs-12 mb-0">Заказы</h6>
      </div>

      <DataTable
        columns={orderColumns}
        data={orders.items}
        pagination={orders.pagination}
      />
    </section>
  );
};

export default Orders;
