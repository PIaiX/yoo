import React, { memo } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Offer from "../Offer";

const WidgetSales = memo((data) => {
  if (!data?.items || data?.items?.length === 0) {
    return null;
  }
  return (
    <section className="sec-6 mt-6">
      <Container>
        <Swiper
          className="sw-offers"
          spaceBetween={20}
          slidesPerView={"auto"}
          speed={750}
          breakpoints={{
            576: {
              slidesPerView: "auto",
            },
            768: {
              slidesPerView: "auto",
            },
            992: {
              slidesPerView: 3,
            },
          }}
        >
          {data.items.map((e, index) => (
            <SwiperSlide key={index}>
              <Offer data={e} />
            </SwiperSlide>
          ))}
        </Swiper>

        <Link to="/promo" className="btn btn-40 mt-4 mt-sm-5 mx-auto">
          Смотреть все акции
        </Link>
      </Container>
    </section>
  );
});

export default WidgetSales;
