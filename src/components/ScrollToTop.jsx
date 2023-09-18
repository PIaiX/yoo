import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineChevronDoubleUp
} from "react-icons/hi2";

const ScrollToTop = memo(() => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    if (window.pageYOffset > 250) {
      setVisible(true);
    } else if (window.pageYOffset <= 250) {
      setVisible(false);
    }
  };

  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    document.addEventListener("scroll", toggleVisible, true);
    return () => {
      document.removeEventListener("scroll", toggleVisible, true);
    };
  });

  return (
    <nav className={visible ? "sidebar" : "sidebar hide"}>
      <ul>
        <li className="d-none d-lg-block">
          <Link to="/cart" className="position-relative">
            <HiOutlineShoppingCart />
            <span className="badge">
              12
            </span>
          </Link>
        </li>
        <li className="d-none d-lg-block">
          <Link to="/account/favorites">
            <HiOutlineHeart/>
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={toTop}
          >
            <HiOutlineChevronDoubleUp/>
          </button>
        </li>
      </ul>
    </nav>
  );
});

export default ScrollToTop;
