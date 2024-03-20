import { Modal, Row, Col } from "react-bootstrap";
import React, { memo, useState } from "react";
import Empty from "../Empty";
import ProductCard from "../ProductCard";
import { IoAddCircleOutline, IoRestaurantOutline } from "react-icons/io5";
import EmptyCatalog from "../empty/catalog";
import CartItem from "../CartItem";

const Extras = memo(({ person = 0, items }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <a className="d-block cart-box mb-4 " onClick={() => setShow(true)}>
        <Row className="align-items-center m-0">
          <Col xs="auto p-0">
            <IoRestaurantOutline size={24} />
          </Col>
          <Col className="fs-09">
            Ваш заказ расчитан на {person} персон.{" "}
            <div className="fw-6">Хотите добавить еще?</div>
          </Col>
          <Col xs="auto p-0">
            <IoAddCircleOutline size={24} />
          </Col>
        </Row>
      </a>
      <Modal size="md" show={show} onHide={setShow} centered>
        <Modal.Header closeButton className="fw-7">
          Выберите товар
        </Modal.Header>
        <Modal.Body>
          {!items || items?.length === 0 ? (
            <Empty mini text="Ничего нет" image={() => <EmptyCatalog />} />
          ) : (
            items.map((item) => (
              <CartItem data={{ ...item, themeProduct: 0 }} />
            ))
          )}
        </Modal.Body>
      </Modal>
    </>
  );
});
export default Extras;
