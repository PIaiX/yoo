import React from 'react';
import useIsMobile from '../hooks/isMobile';
import { HiChevronRight } from "react-icons/hi2";
import { BsExclamationLg } from "react-icons/bs";

const LiNotification = () => {
  const isMobileMD = useIsMobile('767px');

  return (
    <li>
      <div className="icon"></div>
      <div className="info">
        <h6>
          {
            (isMobileMD)
            ? <BsExclamationLg className='NB'/>
            : <span className='NB'>Важное</span>
          }
          Оплата прошла успешно
        </h6>
        <p>Информацию о заказе вы можете посмотреть во вкладке «Заказы»</p>
      </div>
      <div className="links">
        {
          (isMobileMD)
          ? <button type='button' className='btn-light d-flex align-items-center px-2 py-1'>
            <span>Перейти</span>
            <HiChevronRight/>
          </button>
          : <button type='button' className='btn-secondary'>К заказам</button>
        }
      </div>
      <div className="date">12:18 23.05.2023</div>
    </li>
  );
};

export default LiNotification;