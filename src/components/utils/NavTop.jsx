import React, { memo } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";

const NavTop = memo(({ toBack, breadcrumbs }) => {
  return (
    <nav className="navTop">
      {toBack && (
        <Link to={toBack} className="navTop-back">
          <HiOutlineArrowLeftCircle />
          <span>Назад</span>
        </Link>
      )}
      {breadcrumbs && (
        <ul className="navTop-breadcrumbs">
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/menu">Меню</Link>
          </li>
          <li>
            <Link to="/menu">Пиццы</Link>
          </li>
          <li>
            <Link to="/menu/product">Четыре сыра</Link>
          </li>
        </ul>
      )}
    </nav>
  );
});

export default NavTop;
