import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrevIcon from '../svgs/PrevIcon';

const NavTop = memo(({ toBack = true, breadcrumbs = false }) => {
  const navigate = useNavigate();
  return (
    <nav className="navTop">
      {toBack && (
        <a onClick={() => navigate(-1)} className="navTop-back">
          <PrevIcon />
        </a>
      )}
      {breadcrumbs && breadcrumbs?.length > 0 && (
        <ul className="navTop-breadcrumbs">
          <li>
            <Link to="/">Главная</Link>
          </li>
          {breadcrumbs.map((e) => (
            <li>
              <Link to={e.link}>{e.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
});

export default NavTop;
