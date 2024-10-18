import React, { memo, useState } from "react";
import { Container } from "react-bootstrap";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Empty from "../Empty";
import ProductCardMini from "../ProductCardMini";
import { Link } from "react-router-dom";
import Callback from "../modals/Callback";

const WidgetPopular = memo((data) => {
  const [showFeedback, setShowFeedback] = useState(false);
  if (!data?.items || data?.items?.length === 0) {
    return null;
  }
  return (
    <section className="mb-6">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{data.title}</h2>
          <div>
            <Link to="/categories" className="btn btn-sm btn-40">
              В каталог
            </Link>
          </div>
        </div>
        {data?.items?.length > 0 ? (
          <>
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
                    <ProductCardMini data={obj} onFeedback={setShowFeedback} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <Callback
              show={!!showFeedback}
              product={showFeedback}
              setShow={setShowFeedback}
            />
          </>
        ) : (
          <Empty mini text="Ничего нет" />
        )}
      </Container>
    </section>
  );
});

export default WidgetPopular;
