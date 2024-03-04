import React, { memo } from "react";
import { Container } from "react-bootstrap";
import { FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Empty from "../Empty";
import ProductCardMini from "../ProductCardMini";
import {
  HiOutlineArrowRightCircle,
  HiOutlineArrowLeftCircle,
  HiXMark,
} from "react-icons/hi2";

const WidgetPopular = memo((data) => {
  return (
    <section className="sec-catalog mb-6">
      <Container>
        <h2 className="text-center">{data.title}</h2>
        {data?.items?.length > 0 ? (
          <Swiper
            className="swiper-stories"
            modules={[Navigation, FreeMode]}
            speed={750}
            spaceBetween={10}
            slidesPerView={3}
            freeMode={true}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoints={{
              576: {
                spaceBetween: 15,
              },
              768: {
                spaceBetween: 30,
              },
              1200: {
                spaceBetween: 50,
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
            <div className="swiper-button-prev">
              <HiOutlineArrowLeftCircle />
            </div>
            <div className="swiper-button-next">
              <HiOutlineArrowRightCircle />
            </div>
          </Swiper>
        ) : (
          <Empty mini text="Ничего нет" />
        )}
      </Container>
    </section>
  );
});

export default WidgetPopular;
