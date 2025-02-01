import React, { memo } from "react";
import { Container } from "react-bootstrap";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Empty from "../Empty";
import ProductCardMini from "../ProductCardMini";
import { Link } from "react-router-dom";

const WidgetPopular = memo((data) => {
  if (
    !data?.items ||
    data?.items?.length === 0 ||
    !Array.isArray(data?.items)
  ) {
    return null;
  }

  const items = [...data.items];
  return (
    <section className="mb-6">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>{data.title && <h2 className="mb-0">{data.title}</h2>}</div>
          <div>
            <Link to="/categories" className="btn btn-sm btn-40">
              В меню
            </Link>
          </div>
        </div>

        <Swiper
          className="product-slider"
          modules={[Navigation, FreeMode]}
          speed={750}
          spaceBetween={10}
          slidesPerView={"auto"}
          freeMode={true}
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
          {items
            .sort((a, b) => a.priority - b.priority)
            .map((obj) => {
              return (
                <SwiperSlide key={obj.id}>
                  <ProductCardMini data={obj} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </Container>
    </section>
  );
});

export default WidgetPopular;
