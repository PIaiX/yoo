import React, { memo } from "react";
import { Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { HiOutlineMagnifyingGlass, HiOutlineUserCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import DeliveryBar from "./DeliveryBar";
import { getImageURL } from "../helpers/all";

const Header = memo(() => {
  const { t } = useTranslation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const categories = useSelector((state) => state.catalog.categories);

  return (
    <div className="left-menu">
      <header>
        <nav className="w-100">
          <ul className="d-flex justify-content-between w-100">
            <li className="d-none d-lg-block">
              <Link to="/search">
                <HiOutlineMagnifyingGlass size={25} />
              </Link>
            </li>
            <li className="d-none d-lg-block">
              <Link
                className="bg-white p-2 pe-3 rounded-5 d-flex align-items-center"
                to={
                  isAuth
                    ? user?.status === 0
                      ? "/activate"
                      : "/account"
                    : "/login"
                }
              >
                <HiOutlineUserCircle size={25} className="me-2" />
                Войти
              </Link>
            </li>
            {/* <li>
                <Select
                  value="ru"
                  data={[
                    {
                      value: "ru",
                      title: "русский",
                      image: ruFlag,
                    },
                    {
                      value: "en",
                      title: "english",
                      image: engFlag,
                    },
                  ]}
                />
              </li> */}
          </ul>
        </nav>
      </header>

      <DeliveryBar />
      <Nav className="flex-column categories">
        <Nav.Link as={NavLink} key={0} to="/" end>
          <span className="img me-3">🔥</span>Акции
        </Nav.Link>
        {categories?.length > 0 &&
          categories.map((e, index) => (
            <Nav.Link as={NavLink} key={index} to={"/category/" + e.id}>
              {e.media && (
                <img
                  className="me-3"
                  src={getImageURL({ path: e.media, type: "category" })}
                />
              )}
              {e.title}
            </Nav.Link>
          ))}
      </Nav>
    </div>
  );
});

export default Header;
