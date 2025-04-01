import React, { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";
import { FreeMode, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HiArrowUturnUp, HiOutlineArrowUturnDown } from "react-icons/hi2";

const CategoriesUrman = memo(({ className, data }) => {
  const [isFull, setIsFull] = useState(false);
  const swiperRef = useRef(null);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleExpand = () => {
    swiperRef.current.swiper.disable();
    setIsFull(true);
  };

  const handleCollapse = () => {
    swiperRef.current.swiper.enable();
    setIsFull(false);
  };

  const updateSlider = (i) => {
    swiperRef?.current?.swiper && swiperRef.current.swiper.slideTo(i);
    if (isFull && swiperRef?.current?.swiper) {
      setIsFull(false);
      swiperRef.current.swiper.enable();
    }
  };

  useEffect(() => {
    const updateView = () => {
      const menuNode = menuRef.current;
      if (menuNode) {
        const rect = menuNode.getBoundingClientRect();
        const scrollTop = window.scrollY;
        setIsShowMenu(scrollTop > rect.top + scrollTop - 60);
      }
    };

    window.addEventListener("scroll", updateView);
    updateView();
    return () => window.removeEventListener("scroll", updateView);
  }, []);

  return data?.length > 0 ? (
    <>
      <div ref={menuRef} />
      <div
        className={`sticky-box container p-0 mt-5 pe-md-3 ps-md-3 mb-3 mb-sm-4 mb-md-5 ${isShowMenu ? "h-fixed show" : "h-fixed"
          }`}
      >
        <div className="container p-0">
          <div className={`categories-urman${className ? ` ${className}` : ""} ${isShowMenu ? "scrolled" : ""}`}>
            <div className={isFull ? "p-0 categories-urman-wrap" : "categories-urman-wrap"}>
              <div className="categories-urman-nav categories-urman-prev"></div>
              <Swiper
                ref={swiperRef}
                loop={false}
                freeMode={{ enabled: true, sticky: true }}
                mousewheel={true}
                className={
                  isFull
                    ? "categories-urman-slider categories-urman-slider-disabled"
                    : "categories-urman-slider"
                }
                modules={[Navigation, FreeMode, Mousewheel]}
                speed={750}
                spaceBetween={20}
                slidesPerView="auto"
                observer={true}
                observeSlideChildren={true}
                watchSlidesProgress={true}
                navigation={{
                  nextEl: '.categories-urman-next',
                  prevEl: '.categories-urman-prev',
                }}
                breakpoints={{
                  576: { spaceBetween: 20 },
                  1200: { spaceBetween: 20 },
                }}
              >
                {data.map((e, index) => (
                  <SwiperSlide key={index}>
                    <Link
                      className="categories-urman-item"
                      activeClass="categories-urman-item-active"
                      to={`category-${e.id}`}
                      spy={true}
                      smooth={true}
                      offset={-150}
                      duration={150}
                      onSetActive={() => updateSlider(index)}
                    >
                      {e.title}
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="categories-urman-nav categories-urman-next"></div>
              <button
                draggable={false}
                type="button"
                onClick={isFull ? handleCollapse : handleExpand}
                className="categories-urman-btn"
              >
                {isFull ? (
                  <HiArrowUturnUp className="fs-15 main-color" />
                ) : (
                  <HiOutlineArrowUturnDown className="fs-15 main-color rotateY-180" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
});

export default CategoriesUrman;