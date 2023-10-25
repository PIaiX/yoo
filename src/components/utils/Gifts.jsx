import React from 'react';
import { HiOutlineGift } from "react-icons/hi2";

const Gifts = () => {
  return (
    <div className='gifts'>
      <ul>
        <li className='full'>
          <div className='bar'></div>
          <div className='icon'><HiOutlineGift/></div>
        </li>
        <li className='full'>
          <div className='bar'></div>
          <div className='icon'><HiOutlineGift/></div>
        </li>
        <li className=''>
          <div className='bar'></div>
          <div className='icon'><HiOutlineGift/></div>
        </li>
      </ul>
      <p className='mt-2'>Добавьте товары на 268 ₽, чтобы получить подарок</p>
    </div>
  );
};

export default Gifts;