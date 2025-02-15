import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { Badge } from "react-bootstrap";

const NavTop = memo(({ toBack = true, home = true, breadcrumbs = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <nav className="navTop">
      {toBack && (
        <a onClick={() => navigate(-1)} className="navTop-back">
          <HiOutlineArrowLeftCircle />
          <span>{t("Назад")}</span>
        </a>
      )}
      {breadcrumbs && breadcrumbs?.length > 0 && (
        <ul className="navTop-breadcrumbs">
          {home && <li>
            <Link to="/">{t("Главная")}</Link>
          </li>}
          {breadcrumbs.map((e, index) => (
            <li key={index} className="d-flex align-items-center">
              {e?.count > 0 && (
                <Link to="/">
                  <Badge
                    className={
                      "badge-sm me-2" +
                      (e.active ? " badge-main" : " badge-main-light")
                    }
                    pill
                  >
                    {e.count}
                  </Badge>
                </Link>
              )}
              <Link to={e.link}>{e.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
});

export default NavTop;
