import { t } from "i18next";
import moment from "moment";
import React, { memo, useLayoutEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const TimePicker = memo(
  ({
    value = null,
    startTime = "09:00",
    endTime = "21:00",
    interval = 60,
    minMinuteTime = 30,
    maxDayDate = 3,
    onChange = false,
  }) => {
    const swiperRef = useRef(null);
    const handleLabelClick = () => {
      document.getElementById("date").showPicker();
    };

    const generateTimeSlots = (start, end, interval, minMinuteTime) => {
      const slots = [];

      // Проверяем, что входные данные корректны
      if (
        !start ||
        !end ||
        !interval ||
        interval <= 0 ||
        !minMinuteTime ||
        minMinuteTime < 0
      ) {
        return slots;
      }

      const startTime = moment(start, "HH:mm");
      const endTime = moment(end, "HH:mm");

      // Проверяем, что startTime и endTime являются валидными датами
      if (!startTime.isValid() || !endTime.isValid()) {
        return slots;
      }

      // Если startTime больше endTime, возвращаем пустой массив
      if (startTime.isAfter(endTime)) {
        return slots;
      }

      // Вычисляем минимальное время заказа относительно начала рабочего дня
      const minOrderTime = startTime.clone().add(minMinuteTime, "minutes");

      // Если minOrderTime больше endTime, возвращаем пустой массив
      if (minOrderTime.isAfter(endTime)) {
        return slots;
      }

      let currentTime = moment(startTime); // Инициализируем currentTime началом рабочего дня

      // Генерация слотов времени
      while (currentTime.isSameOrBefore(endTime)) {
        // Проверяем, учитываем минимальное время заказа
        if (currentTime.isSameOrAfter(minOrderTime)) {
          slots.push(currentTime.format("HH:mm"));
        }
        currentTime.add(interval, "minutes");
      }

      // Удаляем последний элемент, если он выходит за рамки endTime
      if (slots.length > 0) {
        const lastSlot = moment(slots[slots.length - 1], "HH:mm");
        if (lastSlot.add(interval, "minutes").isAfter(endTime)) {
          slots.pop();
        }
      }

      return slots;
    };

    // Генерация слотов времени
    const timeSlots = generateTimeSlots(
      startTime,
      endTime,
      interval,
      minMinuteTime
    );

    const [selectedDate, setSelectedDate] = useState(
      value?.length > 0 ? moment(value).format("YYYY-MM-DD") : null
    );
    const [selectedTime, setSelectedTime] = useState({
      index:
        value?.length > 0
          ? timeSlots.findIndex((e) => e === moment(value).format("HH:mm"))
          : 0,
      time: value?.length > 0 ? moment(value).format("HH:mm") : null,
    });

    const isValid =
      selectedDate &&
      timeSlots.filter(
        (time) =>
          selectedTime?.time?.length > 0 ||
          !(
            moment(selectedDate).isBefore(moment()) &&
            moment(time, "HH:mm").isBefore(
              moment().add(minMinuteTime, "minutes")
            )
          )
      )?.length > 0;

    // Обработчик выбора даты
    const handleDateChange = (e) => {
      const newDate = e.target.value;
      setSelectedDate(newDate);
      setSelectedTime({ index: 0, time: null });

      // Если дата изменилась, сбрасываем время и вызываем onChange с новой датой
      if (onChange) {
        onChange(`${newDate}T00:00`); // Указываем время по умолчанию
      }
    };

    // Обработчик выбора времени
    const handleTimeSelect = ({ index, time }) => {
      if (
        !(
          moment(selectedDate).isBefore(moment()) &&
          moment(time, "HH:mm").isBefore(moment().add(minMinuteTime, "minutes"))
        )
      ) {
        if (moment(selectedDate).isValid() && time) {
          setSelectedTime({ index, time });

          // Вызываем onChange только если время изменилось
          if (onChange) {
            const selectedDateTime = `${selectedDate}T${time}`;
            onChange(selectedDateTime);
          }
        } else {
          NotificationManager.error(t("Пожалуйста, выберите дату и время"));
        }
      }
    };

    useLayoutEffect(() => {
      if (
        swiperRef?.current?.swiper &&
        moment(selectedDate).isValid() &&
        selectedTime.time
      ) {
        const slideIndex = selectedTime.index > 0 ? selectedTime.index : 0;
        swiperRef.current.swiper.slideTo(slideIndex, 0);
      }
    }, [selectedDate]);

    return (
      <div>
        <div>
          <input
            type="date"
            id="date"
            readOnly={false}
            className="input-date"
            value={selectedDate}
            onClick={handleLabelClick}
            onChange={handleDateChange}
            min={moment().format("YYYY-MM-DD")}
            max={moment().add(maxDayDate, "days").format("YYYY-MM-DD")}
          />

          {(!selectedDate || selectedDate?.length === 0) && (
            <p className="fs-09 mt-1 text-danger">{t("Укажите дату")}</p>
          )}
          {!isValid && selectedDate?.length > 0 && (
            <p className="fs-09 mt-1 text-danger">
              {t("На данную дату нельзя сделать заказ")}
            </p>
          )}
        </div>
        {isValid && (
          <div className="mt-3 ">
            <Swiper
              ref={swiperRef}
              className="time-container"
              loop={false}
              freeMode={{ enabled: true, sticky: true }}
              mousewheel={true}
              modules={[FreeMode, Mousewheel]}
              slidesPerView="auto"
              spaceBetween={10}
            >
              {timeSlots.map((time, index) => {
                return (
                  <SwiperSlide key={index} className="time-item-slide">
                    <div>
                      <a
                        onClick={() => handleTimeSelect({ index, time })}
                        className={
                          selectedTime?.time?.length === 0 ||
                          (moment(selectedDate).isBefore(moment()) &&
                            moment(time, "HH:mm").isBefore(
                              moment().add(minMinuteTime, "minutes")
                            ))
                            ? "time-item w-100 disabled"
                            : selectedTime.time === time
                            ? "time-item w-100 active"
                            : "time-item w-100"
                        }
                      >
                        {time} -{" "}
                        {moment(time, "HH:mm")
                          .add(interval, "minutes")
                          .format("HH:mm")}
                      </a>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
        {(!selectedTime?.time || selectedTime?.time?.length === 0) &&
          isValid && (
            <p className="fs-09 mt-1 text-danger">{t("Выберите время")}</p>
          )}
      </div>
    );
  }
);

export default TimePicker;
