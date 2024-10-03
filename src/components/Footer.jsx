import React, { memo } from "react";
import { Badge, Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  IoCart,
  IoHome,
  IoPersonCircle,
  IoSearchOutline,
} from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { customPrice } from "../helpers/all";
import { useTotalCart } from "../hooks/useCart";

const Footer = memo(({ left = false, sendButton = false }) => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.auth.user);

  const { total = 0, count = 0 } = useTotalCart();

  return (
    <>
    <div className="footer-height"></div>
    <footer className={left ? "footer-left" : ""}>
      <Nav className="d-flex justify-content-between px-3">
        <div className="d-flex flex-row">
          <Link to="/" className="me-3 btn btn-light">
            <IoHome size={20} className="me-2" />
            На главную
          </Link>
          <Link to="/search" className="me-3 btn btn-light">
            <IoSearchOutline size={23} className="me-2" />
            Поиск
          </Link>
          {user?.point ? (
            <Link to="/profile" className="me-3 btn btn-light">
              <IoPersonCircle size={24} className="me-2" />
              {user.point}
            </Link>
          ) : (
            <Link to="/login" className="me-3 btn btn-light">
              <IoPersonCircle size={24} className="me-2" />
              Вход
            </Link>
          )}
        </div>
        {sendButton ? (
          sendButton
        ) : (
          <Link to="/cart" className="btn btn-success">
            <IoCart size={22} className="me-2" />
            {customPrice(total)}
            <Badge bg="danger" pill>
              {count}
            </Badge>
          </Link>
        )}
      </Nav>
    </footer>
    </>
  );
});

export default Footer;
