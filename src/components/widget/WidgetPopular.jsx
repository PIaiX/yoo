import React, { memo } from "react";
import { Container } from "react-bootstrap";
import { FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Empty from "../Empty";
import ProductCardMini from "../ProductCardMini";

const WidgetPopular = memo((data) => {
  if (!data?.items || data?.items?.length === 0) {
    return null;
  }
  return (
    <section className="mb-6">
      <Container>
        <h2>{data.title}</h2>
        {data?.items?.length > 0 ? (
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
            {data.items.map((obj) => {
              return (
                <SwiperSlide key={obj.id}>
                  <ProductCardMini data={obj} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <Empty mini text="Ничего нет" />
        )}
      </Container>
    </section>
  );
});

export default WidgetPopular;
