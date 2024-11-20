import React, { memo } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getImageURL } from "../../helpers/all";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const WidgetBanners = memo((data) => {
  if (!data?.items || data?.items?.length === 0) {
    return null;
  }

  return (
    <section className="banner-slider my-3 mb-4">
      <Slider
        // className="center"
        centerMode={true}
        infinite={true}
        centerPadding="18%"
        slidesToShow={1}
        speed={500}
        dots={true}
        lazyLoad={true}
      >
        {data.items
          .filter((item) => {
            if (item?.options?.start && item?.options?.end) {
              const startDate = new Date(item.options.start);
              const endDate = new Date(item.options.end);
              const currentDateTime = new Date();

              return startDate <= currentDateTime && currentDateTime <= endDate;
            }

            return true;
          })
          .map((e, index) =>
            e?.options?.linkType ? (
              // <Link
              //   to={
              //     e?.options?.linkType === "product" &&
              //     e?.options?.linkValue
              //       ? "/product/" + e.options.linkValue
              //       : e?.options?.linkType === "category" &&
              //         e.options?.linkValue
              //       ? "/category/" + e.options.linkValue
              //       : e?.options?.linkType === "categories"
              //       ? "/categories"
              //       : e?.options?.linkType === "sale" &&
              //         e.options?.linkValue
              //       ? "/promo/" + e.options.linkValue
              //       : e?.options?.linkType === "sales"
              //       ? "/promo"
              //       : ""
              //   }
              // >
              <img
                src={getImageURL({
                  path: e?.medias,
                  type: "banner",
                  size: "full",
                })}
                alt={e?.title}
                className={data?.size === "big" ? "img-fluid big" : "img-fluid"}
              />
            ) : (
              // </Link>
              <img
                src={getImageURL({
                  path: e?.medias,
                  type: "banner",
                  size: "full",
                })}
                alt={e?.title}
                className={data?.size === "big" ? "img-fluid big" : "img-fluid"}
              />
            )
          )}
      </Slider>
      {/* <Swiper
              className="main-slider paginated"
              modules={[Pagination, Autoplay]}
              loop={true}
              spaceBetween={15}
              slidesPerView={1}
              initialSlide={0}
              loopedSlides={1}
              centeredSlides={true}
              speed={750}
              autoplay={
                !!data?.autoScroll
                  ? {
                      delay: data?.autoScrollSpeed
                        ? Number(data.autoScrollSpeed)
                        : 10000,
                      pauseOnMouseEnter: true,
                      disableOnInteraction: false,
                    }
                  : false
              }
              pagination={{ clickable: true }}
            >
              {data.items
                .filter((item) => {
                  if (item?.options?.start && item?.options?.end) {
                    const startDate = new Date(item.options.start);
                    const endDate = new Date(item.options.end);
                    const currentDateTime = new Date();

                    return (
                      startDate <= currentDateTime && currentDateTime <= endDate
                    );
                  }

                  return true;
                })
                .map((e, index) => (
                  <SwiperSlide key={index}>
                    {e?.options?.linkType ? (
                      <Link
                        to={
                          e?.options?.linkType === "product" &&
                          e?.options?.linkValue
                            ? "/product/" + e.options.linkValue
                            : e?.options?.linkType === "category" &&
                              e.options?.linkValue
                            ? "/category/" + e.options.linkValue
                            : e?.options?.linkType === "categories"
                            ? "/categories"
                            : e?.options?.linkType === "sale" &&
                              e.options?.linkValue
                            ? "/promo/" + e.options.linkValue
                            : e?.options?.linkType === "sales"
                            ? "/promo"
                            : ""
                        }
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
                    )}
                  </SwiperSlide>
                ))}
            </Swiper> */}
    </section>
  );
});

export default WidgetBanners;
