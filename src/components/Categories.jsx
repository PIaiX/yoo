import React, {useState} from 'react';
import { Navigation, FreeMode } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import FoodRolls from '../components/svgs/FoodRolls';
import FoodSets from '../components/svgs/FoodSets';
import FoodPizza from '../components/svgs/FoodPizza';
import FoodCombo from '../components/svgs/FoodCombo';
import FoodPoke from '../components/svgs/FoodPoke';
import FoodDesserts from '../components/svgs/FoodDesserts';
import { HiOutlineArrowRightCircle, HiOutlineArrowLeftCircle,HiOutlineArrowUturnDown, HiArrowUturnUp } from "react-icons/hi2";

const Categories = (props) => {
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
  
  return (
    <div className={"categories "+props.className}>
      <div className="categories-wrap">
        <Swiper
          className={(isFull) ? "categories-slider categories-slider-disabled" : "categories-slider"}
          modules={[Navigation, FreeMode]}
          speed={750}
          spaceBetween={20}
          slidesPerView={'auto'}
          freeMode={true}
          observer={true}
          observeSlideChildren={true}
          watchSlidesProgress={true}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          onSwiper={setSwiper}
          breakpoints={{
            576: {
              spaceBetween: 30,
            },
            1200: {
              spaceBetween: 30,
            },
          }}
        >
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodRolls className="fs-15"/>
              <span className='ms-2'>Роллы</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodSets className="fs-15"/>
              <span className='ms-2'>Сеты</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodPizza/>
              <span className='ms-2'>Пицца</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodCombo/>
              <span className='ms-2'>Комбо</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodDesserts/>
              <span className='ms-2'>Десерты</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodPoke/>
              <span className='ms-2'>Поке</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodRolls className="fs-15"/>
              <span className='ms-2'>Роллы</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodSets className="fs-15"/>
              <span className='ms-2'>Сеты</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodPizza/>
              <span className='ms-2'>Пицца</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodCombo/>
              <span className='ms-2'>Комбо</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodDesserts/>
              <span className='ms-2'>Десерты</span>
            </button>
          </SwiperSlide>
          <SwiperSlide>
            <button type='button' className='btn-8'>
              <FoodPoke/>
              <span className='ms-2'>Поке</span>
            </button>
          </SwiperSlide>
          <div className="swiper-button-prev">
            <HiOutlineArrowLeftCircle/>
          </div>
          <div className="swiper-button-next">
            <HiOutlineArrowRightCircle/>
          </div>
        </Swiper>
      </div>
      {
        (isFull)
        ? <button type='button' onClick={handleСollapse} className='categories-btn'>
          <span>свернуть</span>
          <HiArrowUturnUp className='fs-15 ms-3 main-color'/>
        </button>
        : <button type='button' onClick={handleExpand} className='categories-btn'>
          <span>показать все</span>
          <HiOutlineArrowUturnDown className='fs-15 ms-3 main-color rotateY-180'/>
        </button>
      }
    </div>
  );
};

export default Categories;