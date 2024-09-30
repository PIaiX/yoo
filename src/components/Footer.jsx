import React, { memo } from "react";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTotalCart } from "../hooks/useCart";
import { Badge, Button, Nav } from "react-bootstrap";
import { customPrice } from "../helpers/all";
import {
  IoCart,
  IoCartOutline,
  IoHome,
  IoPeople,
  IoPersonCircle,
  IoSearchOutline,
} from "react-icons/io5";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const Footer = memo(() => {
  const { t } = useTranslation();

  const options = useSelector((state) => state.settings.options);
  const user = useSelector((state) => state.auth.user);

  const {
    total = 0,
    totalNoDelivery = 0,
    price = 0,
    discount = 0,
    person = 0,
    count = 0,
    pointAccrual,
    pickupDiscount,
    pointCheckout,
    delivery,
  } = useTotalCart();

  return (
    <footer>
      <Nav className="d-flex justify-content-between px-3">
        <div className="d-flex flex-row">
          <Link to="/" className="me-3 btn btn-light">
            <IoHome size={20} className="me-2" />
            На главную
          </Link>
          {user?.point && (
            <Link to="/profile" className="me-3 btn btn-light">
              <IoPersonCircle size={24} className="me-2" />
              {user.point}
            </Link>
          )}
          <Link to="/search" className="btn btn-light">
            <IoSearchOutline size={23} />
          </Link>
        </div>
        <Link to="/cart" className="btn btn-success">
          <IoCart size={22} className="me-2" />
          {customPrice(total)}
          <Badge bg="danger" pill>
            {count}
          </Badge>
        </Link>
      </Nav>
    </footer>
  );
});

export default Footer;
