import { t } from "i18next";
import moment from "moment";
import React, { memo, useLayoutEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const TimePicker = memo(
  ({
    value = moment().format("YYYY-MM-DDTHH:mm"),
    startTime = "09:00",
    endTime = "21:00",
    interval = 60,
    minMinuteTime = 30,
    maxDayDate = 3,
    onChange = false,
  }) => {
    const [selectedDate, setSelectedDate] = useState(
      moment(value).format("YYYY-MM-DD")
    );
    const [selectedTime, setSelectedTime] = useState({ index: 0, time: null });
    const swiperRef = useRef(null);

    // Генерация интервалов времени
    const generateTimeSlots = (start, end, interval) => {
      const slots = [];
      let currentTime = moment(start, "HH:mm");

      while (currentTime.isSameOrBefore(moment(end, "HH:mm"))) {
        slots.push(currentTime.format("HH:mm")); // Формат "HH:MM"

        currentTime = currentTime.add(interval, "minutes"); // Добавляем интервал
      }
      slots.pop();
      slots.shift();
      return slots;
    };

    // Генерация слотов времени
    const timeSlots = generateTimeSlots(startTime, endTime, interval);

    // Обработчик выбора даты
    const handleDateChange = (e) => {
      setSelectedDate(e.target.value);
      if (e.target.value?.length === 0) {
        setSelectedTime({ index: 0, time: null });
      } else {
        let index = timeSlots.findIndex((e) =>
          moment(e, "HH:mm").isAfter(
            moment(
              moment().add(minMinuteTime, "minutes").format("HH:mm"),
              "HH:mm"
            )
          )
        );
        if (index != -1) {
          setSelectedTime({ index, time: timeSlots[index] });
          const selectedDateTime = `${selectedDate}T${timeSlots[index]}`;

          onChange && onChange(selectedDateTime);
        }
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
        if (selectedDate && time) {
          setSelectedTime({ index, time, noUpdate: true });
          const selectedDateTime = `${selectedDate}T${time}`;
          onChange && onChange(selectedDateTime);
        } else {
          NotificationManager.error(t("Пожалуйста, выберите дату и время"));
        }
      }
    };

    useLayoutEffect(() => {
      if (timeSlots?.length > 0) {
        let index = timeSlots.findIndex((e) =>
          moment(e, "HH:mm").isAfter(
            moment(
              value
                ? moment(value).format("HH:mm")
                : moment().add(minMinuteTime, "minutes").format("HH:mm"),
              "HH:mm"
            )
          )
        );

        if (index != -1) {
          setSelectedTime({ index, time: timeSlots[index] });
          const selectedDateTime = `${selectedDate}T${timeSlots[index]}`;
          onChange && onChange(selectedDateTime);
        }
      }
    }, [minMinuteTime]);

    useLayoutEffect(() => {
      if (
        swiperRef?.current?.swiper &&
        selectedDate &&
        !selectedTime?.noUpdate
      ) {
        // Проверяем, чтобы индекс был больше 0, иначе ставим 0
        const slideIndex = selectedTime.index > 0 ? selectedTime.index : 0;
        swiperRef.current.swiper.slideTo(slideIndex, 0); // Двигаем слайдер на нужный индекс
      }
    }, [selectedTime.index, selectedDate]);

    return (
      <div>
        <div>
          <input
            type="date"
            id="date"
            className="input-date"
            value={selectedDate}
            onChange={handleDateChange}
            min={moment().format("YYYY-MM-DD")}
            max={moment().add(maxDayDate, "days").format("YYYY-MM-DD")}
          />
          {selectedDate?.length === 0 && (
            <p className="fs-09 mt-1 text-danger">{t("Укажите дату")}</p>
          )}
        </div>
        {selectedDate &&
          timeSlots.filter(
            (time) =>
              selectedTime?.time?.length > 0 ||
              !(
                moment(selectedDate).isBefore(moment()) &&
                moment(time, "HH:mm").isBefore(
                  moment().add(minMinuteTime, "minutes")
                )
              )
          )?.length > 0 && (
            <div className="mt-3 time-container">
              <Swiper
                ref={swiperRef}
                // initialSlide={selectedTime.index > 0 ? selectedTime.index : false}
                loop={false}
                freeMode={{ enabled: true, sticky: true }}
                mousewheel={true}
                modules={[FreeMode, Mousewheel]}
                slidesPerView={4}
                spaceBetween={10}
                // centeredSlides={true}
                breakpoints={{
                  320: {
                    slidesPerView: 3, // 1 слайд на маленьких экранах
                  },
                  768: {
                    slidesPerView: 4, // 2 слайда на планшетах
                  },
                  1024: {
                    slidesPerView: 4, // 4 слайда на десктопах
                  },
                }}
              >
                {timeSlots
                  .filter(
                    (time) =>
                      selectedTime?.time?.length > 0 ||
                      !(
                        moment(selectedDate).isBefore(moment()) &&
                        moment(time, "HH:mm").isBefore(
                          moment().add(minMinuteTime, "minutes")
                        )
                      )
                  )
                  .map((time, index) => {
                    return (
                      <SwiperSlide key={index}>
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
      </div>
    );
  }
);

export default TimePicker;
