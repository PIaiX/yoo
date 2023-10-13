import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import BtnFav from './utils/BtnFav';
import { IoCaretDownOutline } from "react-icons/io5";
import CountInput from './utils/CountInput';

const CartItem = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='cart-item'>
      <div className="left">
        <input type="checkbox" className='me-1 me-sm-3'/>
        <img src="/imgs/img3.png" alt="Пепперони" />
        <div className='text'>
          <h6>Название товара</h6>

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
            <p className='fs-08'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, non saepe! Eum, magni assumenda officiis et nam perspiciatis libero similique ex autem ratione reiciendis, vel, incidunt accusamus! Fugit, deleniti? Fugit.</p>
          </Collapse>
        </div>
      </div>
      <div className="right">
        <div>640 ₽</div>
        <CountInput dis={false}/>
        <BtnFav checked={false}/>
      </div>
    </div>
  );
};

export default CartItem;