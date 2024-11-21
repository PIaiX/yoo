import React, { memo, useState } from "react";
// import { Autoplay, Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
import { getImageURL } from "../../helpers/all";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";

const WidgetBanners = memo((data) => {
  const [mouseMoved, setMouseMoved] = useState(false);
  const navigate = useNavigate();
  if (!data?.items || data?.items?.length === 0) {
    return null;
  }

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
    navigate(
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
        : ""
    );

  return (
    <Slider
      className="banner-slider my-3 mb-4"
      centerMode={true}
      infinite={true}
      // centerPadding="25%"
      slidesToShow={1}
      adaptiveHeight={true}
      slidesToScroll={1}
      speed={500}
      dots={true}
      // lazyLoad={true}
      swipe
      variableWidth={true}
    >
      {banners.map((e, index) => {
        return (
          <>
            {e?.options?.linkType ? (
              <Link
                onMouseMove={() => setMouseMoved(true)}
                onMouseDown={() => setMouseMoved(false)}
                onMouseUp={() => link(e)}
              >
                <img
                  key={index}
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
              <Link to={link(e)}>
                <img
                  key={index}
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
