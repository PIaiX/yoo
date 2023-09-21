import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import BtnFav from './utils/BtnFav';
import { IoCaretDownOutline } from "react-icons/io5";
import CountInput from './utils/CountInput';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const CartItem = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='cart-item'>
      <div className="left">
        <input type="checkbox" className='me-1 me-sm-3'/>
        <img src="/imgs/img3.png" alt="Пепперони" />
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
          <p>36 см</p>

          {/* Кнопка с разворачивающимся блоком появляются только если есть дополнительные ингредиенты */}
          <button 
            type='button' 
            onClick={() => setOpen(!open)} 
            aria-expanded={open} 
            className='d-flex align-items-center'
          >
            <span>Показать ещё</span>
            <IoCaretDownOutline className='fs-08 ms-2'/>
          </button>
          <Collapse in={open}>
            <ul className='cart-item-ingredients'>
              <li>Сыр +45 ₽</li>
              <li>Оливки +45 ₽</li>
            </ul>
          </Collapse>
        </div>
      </div>
      <div className="right">
        <div className='order-2 order-md-1'>
          <p className='d-none d-md-block text-center mb-2'>Количество</p>
          <CountInput dis={false}/>
        </div>

        <div className='order-1 order-md-2'>640 ₽</div>

        <BtnFav checked={false}/>
      </div>
    </div>
  );
};

export default CartItem;