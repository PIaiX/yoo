import moment from "moment";
import React, { memo, useState } from "react";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Импортируйте стили Swiper

const TimePicker = memo(
  ({ startTime = "09:00", endTime = "18:00", interval = 60 }) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    // Генерация интервалов времени
    const generateTimeSlots = (start, end, interval) => {
      const slots = [];
      let currentTime = moment(start, "HH:mm");

      while (currentTime.isSameOrBefore(moment(end, "HH:mm"))) {
        slots.push(currentTime.format("HH:mm")); // Формат "HH:MM"
        currentTime = currentTime.add(interval, "minutes"); // Добавляем интервал
      }

      return slots;
    };

    // Генерация слотов времени
    const timeSlots = generateTimeSlots(startTime, endTime, interval);

    // Обработчик выбора даты
    const handleDateChange = (e) => {
      setSelectedDate(e.target.value);
    };

    // Обработчик выбора времени
    const handleTimeSelect = (time) => {
      setSelectedTime(time);
    };

    // Обработчик отправки формы
    const handleSubmit = () => {
      if (selectedDate && selectedTime) {
        const selectedDateTime = `${selectedDate}T${selectedTime}`;
        console.log("Выбрана дата и время:", selectedDateTime);
        // Отправка данных на сервер
      } else {
        alert("Пожалуйста, выберите дату и время.");
      }
    };

    return (
      <div>
        <div>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={moment().format("YYYY-MM-DD")} // Ограничение на прошлые даты
          />
        </div>

        <div className="mt-3 time-container">
          <Swiper
            loop={false}
            freeMode={{ enabled: true, sticky: true }}
            mousewheel={true}
            modules={[FreeMode, Mousewheel]}
            slidesPerView={4}
            spaceBetween={10}
          >
            {timeSlots.map((time, index) => (
              <SwiperSlide key={index}>
                <div>
                  <a
                    onClick={() => handleTimeSelect(time)}
                    className={
                      selectedTime === time ? "time-item active" : "time-item"
                    }
                  >
                    {time} -{" "}
                    {moment(time, "HH:mm")
                      .add(interval, "minutes")
                      .format("HH:mm")}
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <button onClick={handleSubmit} className="btn btn-light mt-3">
          Подтвердить
        </button>
      </div>
    );
  }
);

export default TimePicker;
