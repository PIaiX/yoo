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
    <section className="mb-6">
      <Container>
        {data.title && <h2 className="mb-3">{data.title}</h2>}
        <Swiper
          // className="sw-offers"
          className="p-3"
          spaceBetween={20}
          slidesPerView={"auto"}
          speed={750}
          breakpoints={{
            576: {
              slidesPerView: "auto",
            },
            768: {
              slidesPerView: 2,
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
