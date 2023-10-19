import React, {useState} from 'react';
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";

const OrderItem = () => {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className='order-item'>
      <img src="/imgs/img3.png" alt="Lorem ipsum dolor sit amet" />
      <div className='text'>
        <h6>Lorem ipsum dolor sit amet</h6>
        <p className='fs-08 dark-gray'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores possimus voluptate neque molestias, atque adipisci eveniet delectus dolor doloribus iure fugit.</p>
      </div>
      
      <div className="show" onClick={()=>setShowExtra(!showExtra)}>
        <button type='button' className='fs-09 d-flex align-items-center'>
          <span>Показать ещё</span>
          {
            (showExtra)
            ? <HiOutlineChevronUp className='ms-2'/>
            : <HiOutlineChevronDown className='ms-2'/>
          }
        </button>
      </div>
      <div className='quantity'>
        <div className="input w-50p py-1 px-2 rounded-4 text-center">x2</div>
      </div>
      <div className='price'>640&nbsp;₽</div>
      {
        (showExtra) &&
        <div className="extra fs-08">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores possimus voluptate neque molestias, atque adipisci eveniet delectus dolor doloribus iure fugit</p>
        </div>
      }
      
    </div>
  );
};

export default OrderItem;