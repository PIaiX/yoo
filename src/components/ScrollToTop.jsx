import React, { useEffect, useState } from "react";
import { IoChevronUp } from "react-icons/io5";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    if (window.pageYOffset > 500) {
      setVisible(true);
    } else if (window.pageYOffset <= 500) {
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
    <button
      type="button"
      onClick={toTop}
      className={visible ? "scroll-top" : "scroll-top hide"}
    >
      <IoChevronUp />
    </button>
  );
};

export default ScrollToTop;
