import React, { useState, memo } from "react";
import Modal from "react-bootstrap/Modal";
import Story from "./WidgetStoryItem";
import StoryBig from "./WidgetStoryBigItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules";
import { HiXMark } from "react-icons/hi2";
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

  const size = data.size === "big" ? "big" : "middle";

  return (
    <section className="sec-2 my-4">
      <Container className="px-0">
        <Swiper
          className={`swiper-stories px-2 px-md-0 story-items-${size}`}
          speed={750}
          spaceBetween={14}
          navigation={true}
          slidesPerGroup={1}
          slidesPerView="auto"
          modules={[Navigation]}
          breakpoints={
            size === "big"
              ? {
                  320: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                  },
                  480: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                  },
                  768: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                  },
                  1024: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                  },
                  1280: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                  },
                  1440: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                  },
                }
              : {
                  320: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                  },
                  480: {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                  },
                  768: {
                    slidesPerView: 6,
                    slidesPerGroup: 6,
                  },
                  1024: {
                    slidesPerView: 7,
                    slidesPerGroup: 7,
                  },
                  1280: {
                    slidesPerView: 7,
                    slidesPerGroup: 7,
                  },
                  1440: {
                    slidesPerView: 7,
                    slidesPerGroup: 7,
                  },
                }
          }
        >
          {data.items.map((e, index) => (
            <SwiperSlide key={e?.id}>
              <Story
                onClick={() => showStory(index)}
                data={e}
                type={data.type}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <Modal
          show={story}
          onHide={closeStory}
          className="story-modal"
          centered
        >
          <Modal.Body>
            <Swiper
              className="swiper-stories-modal"
              modules={[Scrollbar, Navigation]}
              slidesPerView={1}
              scrollbar={{ draggable: true }}
              navigation={true}
              onSwiper={(swiper) =>
                activeSlide && swiper.slideTo(activeSlide, 50)
              }
            >
              {data.items.map((e, index) => (
                <SwiperSlide>
                  <StoryBig onClick={() => showStory(index)} data={e} />
                </SwiperSlide>
              ))}
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
