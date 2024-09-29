import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const NavTop = memo(({ toBack = true, breadcrumbs = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <nav className="navTop">
      {toBack && (
        <a onClick={() => navigate(-1)} className="bg-light p-2 pe-3 rounded-5 align-items-center d-inline-flex">
          <IoChevronBackCircleOutline size={28} className="me-2" />
          <span className="fw-6">{t("Назад")}</span>
        </a>
      )}
      {/* {breadcrumbs && breadcrumbs?.length > 0 && (
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
      )} */}
    </nav>
  );
});

export default NavTop;
