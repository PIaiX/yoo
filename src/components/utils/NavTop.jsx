import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const NavTop = memo(({ toBack = true, breadcrumbs = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <nav className="navTop">
      {toBack && (
        <a onClick={() => navigate(-1)} className="navTop-back mb-2">
          <HiOutlineArrowLeftCircle />
          <span>{t("Назад")}</span>
        </a>
      )}
      {breadcrumbs && breadcrumbs?.length > 0 && (
        <ul className="navTop-breadcrumbs mb-2">
          <li>
            <Link to="/">{t("Главная")}</Link>
          </li>
          {breadcrumbs.map((e, index) => (
            <li key={index}>
              <Link to={e.link}>{e.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
});

export default NavTop;
