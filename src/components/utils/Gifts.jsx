import React from 'react';
import Gift from '../svgs/Gift';

const Gifts = () => {
  return (
    <div className='gifts'>
      <ul>
        <li className='full'>
          <div className='bar'></div>
          <div className='icon'><Gift/></div>
        </li>
        <li className='full'>
          <div className='bar'></div>
          <div className='icon'><Gift/></div>
        </li>
        <li className=''>
          <div className='bar'></div>
          <div className='icon'><Gift/></div>
        </li>
      </ul>
      <p className='fs-09 mt-2'>Добавьте товары на 268 ₽, чтобы получить подарок</p>
    </div>
  );
};

export default Gifts;