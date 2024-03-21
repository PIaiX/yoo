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

  return (
    <section className="sec-2 my-4">
      <Container className="px-0">
        <Swiper
          className={
            "swiper-stories px-2 px-md-0" +
            (data?.count > 0 ? " story-col-" + data.count : "")
          }
          speed={750}
          spaceBetween={16}
          navigation={true}
          slidesPerGroup={7}
          slidesPerView="auto"
          modules={[Navigation]}
          breakpoints={{
            576: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 12,
            },
            1200: {
              slidesPerView: 7,
              spaceBetween: 16,
            },
          }}
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
