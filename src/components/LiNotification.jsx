import React from 'react';
import { HiChevronRight } from "react-icons/hi2";
import { BsExclamationLg } from "react-icons/bs";

const LiNotification = () => {
  return (
    <li>
      <div className="icon"></div>
      <div className="info">
        <h6>
          <BsExclamationLg className='NB d-md-none'/>
          <span className='NB d-none d-md-inline'>Важное</span>
          Оплата прошла успешно
        </h6>
        <p>Информацию о заказе вы можете посмотреть во вкладке «Заказы»</p>
      </div>
      <div className="links">
        <button type='button' className='btn-6 d-flex d-md-none align-items-center px-2 py-1'>
          <span>Перейти</span>
          <HiChevronRight/>
        </button>
        <button type='button' className='d-none d-md-flex btn-primary'>К заказам</button>
      </div>
      <div className="date">12:18 23.05.2023</div>
    </li>
  );
};

export default LiNotification;