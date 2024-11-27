import React, { memo, useEffect, useRef, useState } from "react";
// import { Autoplay, Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
import { getImageURL } from "../../helpers/all";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const WidgetBanners = memo((data) => {
  const hasWindow = typeof window !== "undefined";
  const [mobile, setMobile] = useState(false);
  const [width, setWidth] = useState(hasWindow ? window.innerWidth : null);
  let timeOutId = useRef();

  const [mouseMoved, setMouseMoved] = useState(false);

  if (!data?.items || data?.items?.length === 0) {
    return null;
  }

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", () => {
      clearTimeout(timeOutId.current);
      timeOutId.current = setTimeout(handleResize, 500);
    });
  }, []);

  useEffect(() => {
    if (width !== null && width < 700) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [width]);

  const banners = data.items.filter((item) => {
    if (item?.options?.start && item?.options?.end) {
      const startDate = new Date(item.options.start);
      const endDate = new Date(item.options.end);
      const currentDateTime = new Date();

      return startDate <= currentDateTime && currentDateTime <= endDate;
    }

    return true;
  });

  const link = (e) =>
    !mouseMoved && e?.options?.linkType === "product" && e?.options?.linkValue
      ? "/product/" + e.options.linkValue
      : !mouseMoved &&
        e?.options?.linkType === "category" &&
        e.options?.linkValue
      ? "/category/" + e.options.linkValue
      : !mouseMoved && e?.options?.linkType === "categories"
      ? "/categories"
      : !mouseMoved && e?.options?.linkType === "sale" && e.options?.linkValue
      ? "/promo/" + e.options.linkValue
      : !mouseMoved && e?.options?.linkType === "sales"
      ? "/promo"
      : false;

  return (
    <Slider
      className={
        "banner-slider my-3 mb-5" + (banners?.length === 1 ? " container" : "")
      }
      centerMode={!mobile}
      infinite={true}
      // centerPadding="25%"
      slidesToShow={1}
      adaptiveHeight={true}
      slidesToScroll={1}
      autoplay={data?.autoScroll}
      autoplaySpeed={
        data?.autoScrollSpeed ? Number(data.autoScrollSpeed) : 5000
      }
      pauseOnHover={true}
      dots={banners?.length > 1}
      // lazyLoad={true}
      swipe={true}
      variableWidth={!mobile && banners?.length > 1}
    >
      {banners.map((e, index) => {
        return (
          <>
            {e?.options?.linkType ? (
              <Link
                key={index}
                to={link(e)}
                onMouseMove={() => setMouseMoved(true)}
                onMouseDown={() => setMouseMoved(false)}
              >
                <img
                  src={getImageURL({
                    path: e?.medias,
                    type: "banner",
                    size: "full",
                  })}
                  alt={e?.title}
                  className={
                    data?.size === "big" ? "img-fluid big" : "img-fluid"
                  }
                />
              </Link>
            ) : (
              <Link
                key={index}
                to={link(e)}
                onMouseMove={() => setMouseMoved(true)}
                onMouseDown={() => setMouseMoved(false)}
              >
                <img
                  src={getImageURL({
                    path: e?.medias,
                    type: "banner",
                    size: "full",
                  })}
                  alt={e?.title}
                  className={
                    data?.size === "big" ? "img-fluid big" : "img-fluid"
                  }
                />
              </Link>
            )}
          </>
        );
      })}
    </Slider>
  );
});

export default WidgetBanners;
