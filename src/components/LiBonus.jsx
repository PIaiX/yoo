import React from 'react';
import { HiOutlineShoppingBag, HiOutlineGift } from "react-icons/hi2";

const LiBonus = (props) => {
  return (
    <li>
      {
        (props.gift) 
        ? <div className='title'>
          <HiOutlineGift className='d-none d-md-block fs-15 main-color me-2'/>
          <p>Приветственные бонусы</p>
        </div>
        : <div className='title'>
          <HiOutlineShoppingBag className='d-none d-md-block fs-15 main-color me-2'/>
          <p>Заказ № 3471</p>
        </div>
      }
      <div className='date'>
        <time>12:18 23.05.2023</time>
      </div>
      <div className='bonuses'>
        {
          (props.spending) &&
          <div className='spending'>
            <span className='d-none d-xxl-inline me-1'>Списано</span>
            <span className='d-xxl-none'>-</span>
            <span>{props.spending}</span>
            <span className='d-none d-md-inline ms-1'>бонусов</span>
          </div>
        }
        {
          (props.income) &&
          <div className='income'>
            <span className='d-none d-xxl-inline me-1'>Начислено</span>
            <span className='d-xxl-none'>+</span>
            <span>{props.income}</span>
            <span className='d-none d-md-inline ms-1'>бонусов</span>
          </div>
        }
      </div>
    </li>
  );
};

export default LiBonus;