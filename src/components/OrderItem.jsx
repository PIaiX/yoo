import React, {useState} from 'react';
import CountInput from './utils/CountInput';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";

const OrderItem = () => {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className='order-item'>
      <img src="imgs/img3.png" alt="Пепперони" />
      <div className='text'>
        <h6>Пепперони <span className="tag">Подарок</span></h6>
        <OverlayTrigger
          placement={'bottom'}
          overlay={
            <Tooltip>
              Пикантная пепперони, увеличенная порция моцареллы, томаты, фирменный томатный соус
            </Tooltip>
          }
        >
          <p className='consist'>Пикантная пепперони, увеличенная порция моцареллы, томаты, фирменный томатный соус</p>
        </OverlayTrigger>
      </div>
      <ul className="info">
        <li>36 см</li>
        <li>36 см</li>
      </ul>
      <div className="show" onClick={()=>setShowExtra(!showExtra)}>
        <button type='button' className='d-flex align-items-center'>
          <span>Показать ещё</span>
          {
            (showExtra)
            ? <HiOutlineChevronUp className='ms-2'/>
            : <HiOutlineChevronDown className='ms-2'/>
          }
        </button>
      </div>
      <div className='quantity'>
        <div className="d-xxl-none input w-50p py-1 px-2 rounded-4 text-center">x2</div>
        <p className='d-none d-xxl-block text-center mb-2'>Количество</p>
        <CountInput className="d-none d-xxl-flex" dis={true}/>
      </div>
      <div className='price'>640&nbsp;₽</div>
      {
        (showExtra) &&
        <div className="extra">
          <p>+ Творожный сыр х2</p>
          <p>- Сыр Блю-Чиз</p>
        </div>
      }
      
    </div>
  );
};

export default OrderItem;