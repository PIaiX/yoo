import React, { useState, memo } from "react";
import Modal from "react-bootstrap/Modal";
import Story from "./WidgetStoryItem";
import StoryBig from "./WidgetStoryBigItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Scrollbar } from "swiper/modules";
import { HiXMark } from "react-icons/hi2";
import SwiperButtonNext from "../utils/SwiperButtonNext";
import SwiperButtonPrev from "../utils/SwiperButtonPrev";
import { Container } from "react-bootstrap";

const WidgetStories = memo((data) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [story, setStory] = useState(false);

  const closeStory = () => setStory(false);
  const showStory = (index) => {
    setStory(true);
    setActiveSlide(index);
  };
  if (!data?.items || data?.items?.length === 0) {
    return null;
  }
  return (
    <section className="sec-2 mb-5">
      <Container className="position-relative">
        <Swiper
          className="swiper-stories"
          modules={[Navigation, FreeMode]}
          speed={750}
          spaceBetween={10}
          slidesPerView={"auto"}
          watchOverflow={true}
          freeMode={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            576: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            1200: {
              slidesPerView: 8,
              spaceBetween: 10,
            },
          }}
        >
          {data.items.map((e, index) => (
            <SwiperSlide>
              <Story onClick={() => showStory(index)} data={e} />
            </SwiperSlide>
          ))}

          <SwiperButtonPrev />
          <SwiperButtonNext />
        </Swiper>

        <Modal show={story} onHide={closeStory} className="story-modal">
          <Modal.Body>
            <Swiper
              className="swiper-stories-modal"
              modules={[Scrollbar, Navigation]}
              slidesPerView={1}
              scrollbar={{ draggable: true }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              onSwiper={(swiper) =>
                activeSlide && swiper.slideTo(activeSlide, 50)
              }
            >
              {data.items.map((e, index) => (
                <SwiperSlide>
                  <StoryBig onClick={() => showStory(index)} data={e} />
                </SwiperSlide>
              ))}

              <SwiperButtonPrev />
              <SwiperButtonNext />
            </Swiper>
            <button className="close" onClick={closeStory}>
              <HiXMark />
            </button>
          </Modal.Body>
        </Modal>
      </Container>
    </section>
  );
});

export default WidgetStories;
