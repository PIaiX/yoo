import React, { useState } from "react";
import { Navigation, FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import FoodRolls from "../components/svgs/FoodRolls";
import FoodSets from "../components/svgs/FoodSets";
import FoodPizza from "../components/svgs/FoodPizza";
import FoodCombo from "../components/svgs/FoodCombo";
import FoodPoke from "../components/svgs/FoodPoke";
import FoodDesserts from "../components/svgs/FoodDesserts";
import {
  HiOutlineArrowRightCircle,
  HiOutlineArrowLeftCircle,
  HiOutlineArrowUturnDown,
  HiArrowUturnUp,
} from "react-icons/hi2";
import { memo } from "react";

const Categories = memo(({ className, data }) => {
  const [isFull, setIsFull] = useState(false);
  const [swiper, setSwiper] = useState(null);

  const handleExpand = () => {
    swiper.disable();
    setIsFull(true);
  };

  const handleСollapse = () => {
    swiper.enable();
    setIsFull(false);
  };

  const textArray = ["пицца", "комбо", "поке", "десерты", "сеты", "роллы"];
  const iconsArray = [
    <FoodPizza className="fs-15" />,
    <FoodCombo className="fs-15" />,
    <FoodPoke className="fs-15" />,
    <FoodDesserts className="fs-15" />,
    <FoodSets className="fs-15" />,
    <FoodRolls className="fs-15" />,
  ];

  const searchIcon = (text) => {
    let index = textArray.findIndex((e) => e === text.trim().toLowerCase());
    if (index != -1) {
      return iconsArray[index];
    }
  };

  return data.length > 0 ? (
    <div className={"categories " + className}>
      <div className="categories-wrap">
        <Swiper
          className={
            isFull
              ? "categories-slider categories-slider-disabled"
              : "categories-slider"
          }
          modules={[Navigation, FreeMode]}
          speed={750}
          spaceBetween={10}
          slidesPerView={"auto"}
          freeMode={true}
          observer={true}
          observeSlideChildren={true}
          watchSlidesProgress={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          onSwiper={setSwiper}
          breakpoints={{
            576: {
              spaceBetween: 15,
            },
            1200: {
              spaceBetween: 30,
            },
          }}
        >
          {data.map((e) => (
            <SwiperSlide>
              <button type="button" className="btn-8">
                {searchIcon(e.title)}
                <span className="ms-2">{e.title}</span>
              </button>
            </SwiperSlide>
          ))}
          {/* <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodSets className="fs-15" />
              <span className="ms-2">Сеты</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodPizza />
              <span className="ms-2">Пицца</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodCombo />
              <span className="ms-2">Комбо</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodDesserts />
              <span className="ms-2">Десерты</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodPoke />
              <span className="ms-2">Поке</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodRolls className="fs-15" />
              <span className="ms-2">Роллы</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodSets className="fs-15" />
              <span className="ms-2">Сеты</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodPizza />
              <span className="ms-2">Пицца</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodCombo />
              <span className="ms-2">Комбо</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodDesserts />
              <span className="ms-2">Десерты</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type="button" className="btn-8">
              <FoodPoke />
              <span className="ms-2">Поке</span>
            </button>
          </SwiperSlide> */}
          <div className="swiper-button-prev">
            <HiOutlineArrowLeftCircle />
          </div>
          <div className="swiper-button-next">
            <HiOutlineArrowRightCircle />
          </div>
        </Swiper>
      </div>
      {isFull ? (
        <button
          type="button"
          onClick={handleСollapse}
          className="categories-btn"
        >
          <span>свернуть</span>
          <HiArrowUturnUp className="fs-15 ms-3 main-color" />
        </button>
      ) : (
        <button type="button" onClick={handleExpand} className="categories-btn">
          <span>показать все</span>
          <HiOutlineArrowUturnDown className="fs-15 ms-3 main-color rotateY-180" />
        </button>
      )}
    </div>
  ) : null;
});

export default Categories;
