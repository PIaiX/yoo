import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import useIsMobile from "../hooks/isMobile";
import { memo } from "react";

const OrderCard = memo(({ data }) => {
  const isMobileLG = useIsMobile("991px");

  return (
    <div className="order-card">
      <div className="order-card-num">
        <Link to="3471" className="d-lg-none main-color fs-11 fw-6">
          Заказ №3471
        </Link>
        <span className="d-none d-lg-flex">3471</span>
      </div>
      <div className="order-card-time">10:00 12 Авг 2023</div>
      <div className="order-card-status">
        <div className="btn-green rounded-3 px-2 px-lg-3 py-1 py-lg-2">
          Готовится
        </div>
      </div>
      <div className="order-card-delivery">
        Самовывоз <span className="dark-gray ms-1">•</span>
      </div>
      <address>Филиал — ул. Фучика 89, д 1</address>
      <div className="order-card-price">
        {isMobileLG && (
          <Swiper
            className="order-card-slider mb-2"
            modules={[Navigation]}
            spaceBetween={8}
            slidesPerView={"auto"}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
          >
            <SwiperSlide>
              <Link to="/menu/product">
                <img src="imgs/img3.png" alt="Название" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link to="/menu/product">
                <img src="imgs/img3.png" alt="Название" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link to="/menu/product">
                <img src="imgs/img3.png" alt="Название" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link to="/menu/product">
                <img src="imgs/img3.png" alt="Название" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link to="/menu/product">
                <img src="imgs/img3.png" alt="Название" />
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link to="/menu/product">
                <img src="imgs/img3.png" alt="Название" />
              </Link>
            </SwiperSlide>
          </Swiper>
        )}
        <div>
          <span className="d-lg-none me-2">Стоимость</span>
          <span>1 500 ₽</span>
        </div>
      </div>
      <div className="order-card-btn">
        <Link to="3471" className="d-none d-lg-flex">
          <span>Инфо о заказе</span>
          <HiOutlineChevronRight />
        </Link>
        <button type="button" className="btn-6 d-lg-none w-100 rounded-3">
          Повторить заказ
        </button>
      </div>
    </div>
  );
});

export default OrderCard;
