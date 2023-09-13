import React, { useLayoutEffect, useState } from "react";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import { Link } from "react-router-dom";
import DataTable from "../../components/DataTable";
import Empty from "../../components/Empty";
import EmptyOrders from "../../components/empty/orders";
import Meta from "../../components/Meta";
import Loader from "../../components/utils/Loader";
import { getOrders } from "../../services/order";

const Orders = () => {
  const [orders, setOrders] = useState({
    loading: true,
    items: [],
    pagination: {},
  });
  console.log(orders);

  const orderColumns = [
    {
      name: "Время заказа",
      selector: "createdAt",
      cell: (row) => moment(row.createdAt).format("DD MMM YYYY kk:mm"),
    },
    {
      name: "Статус",
      selector: "status",
      cell: (row) => <Status data={row} />,
    },
    {
      name: "Способ доставки",
      selector: "deliveryType",
      cell: (row) => deliveryData(row.delivery).text,
    },
    {
      name: "Итого",
      width: "100px",
      align: "right",
      selector: "total",
      cell: (row) => (
        <div className="d-flex align-items-center">
          <span>{customPrice(row.total)}</span>
          <img className="ms-1" src={paymentData(row.payment).icon} />
        </div>
      ),
    },
    {
      width: "35px",
      selector: "action",
      align: "right",
      cell: (row) => (
        <Link to={"/order/" + row.id}>
          <IoCreateOutline size={22} />
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
