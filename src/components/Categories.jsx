import React, { useState, memo } from "react";
import { Navigation, FreeMode, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-scroll";

import {
  HiOutlineArrowRightCircle,
  HiOutlineArrowLeftCircle,
  HiOutlineArrowUturnDown,
  HiArrowUturnUp,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineBars3,
} from "react-icons/hi2";

const Categories = memo(({ className, data }) => {
  const [isFull, setIsFull] = useState(false);
  const [swiper, setSwiper] = useState(null);

  const handleExpand = () => {
    swiper.disable();
    setIsFull(true);
  };

  const handleСollapse = () => {
    swiper.enable();
    setIsFull(false);
  };

  const updateSlider = (i) => {
    swiper.slideTo(i);
  };

  return data?.length > 0 ? (
    <div className={"categories" + (className ? " " + className : "")}>
      <div className="categories-wrap">
        <Swiper
          loop={false}
          freeMode={{
            enabled: true,
            sticky: true,
          }}
          mousewheel={true}
          className={
            isFull
              ? "categories-slider categories-slider-disabled"
              : "categories-slider"
          }
          modules={[Navigation, FreeMode, Mousewheel]}
          speed={750}
          spaceBetween={10}
          slidesPerView={"auto"}
          observer={true}
          observeSlideChildren={true}
          watchSlidesProgress={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          onSwiper={setSwiper}
          breakpoints={{
            576: {
              spaceBetween: 15,
            },
            1200: {
              spaceBetween: 30,
            },
          }}
        >
          {data.map((e, index) => (
            <SwiperSlide>
              <Link
                className="btn-8"
                activeClass="active"
                to={"category-" + e.id}
                spy={true}
                smooth={true}
                offset={-100}
                duration={100}
                onSetActive={() => updateSlider(index)}
              >
                {e.title}
              </Link>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev">
            <HiOutlineArrowLeftCircle />
          </div>
          <div className="swiper-button-next">
            <HiOutlineArrowRightCircle />
          </div>
        </Swiper>
      </div>
      {isFull ? (
        <button
          type="button"
          onClick={handleСollapse}
          className="categories-btn ms-auto"
        >
          <HiArrowUturnUp className="fs-15 main-color" />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleExpand}
          className="categories-btn ms-auto"
        >
          <HiOutlineArrowUturnDown className="fs-15 main-color rotateY-180" />
        </button>
      )}
      {/* <button type="button" className="categories-btn ms-4">
        <HiOutlineAdjustmentsHorizontal className="fs-15 main-color" />
      </button>
      <button type="button" className="d-lg-none categories-btn">
        <HiOutlineBars3 className="fs-15 main-color" />
      </button> */}
    </div>
  ) : null;
});

export default Categories;
