import React from "react";
import { useSwiper } from "swiper/react";
import PrevIcon from "../svgs/PrevIcon";

const SwiperButtonPrev = () => {
  const swiper = useSwiper();
  const locked = swiper.isLocked ? " locked" : "";
  return (
    <button
      className={"swiper-arrow-prev" + locked}
      onClick={() => swiper.slidePrev()}
    >
      <PrevIcon />
    </button>
  );
};

export default SwiperButtonPrev;
