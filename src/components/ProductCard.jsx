import React from 'react';
import {Link} from 'react-router-dom';
import CartIcon from './svgs/CartIcon';
import BtnFav from './utils/BtnFav';

const ProductCard = () => {
  return (
    <div className="product">
      <div className="product-img">
        <Link to='/menu/product'>
          <img src="/imgs/img.jpg" alt="Ролл «Филадельфия»"/>
        </Link>
        <BtnFav />
        <BtnFav/>
      </div>
      
      <h6>Lorem ipsum dolor sit amet consectetur</h6>
      
      <div className='d-flex justify-content-between align-items-center'>
        <div>
          <div className='fs-12'>650 ₽</div>
          <div className='gray fs-09 text-decoration-line-through'> 650 </div>
        </div>
        <button type='button' className='btn-primary rounded-pill ms-3'>
          <CartIcon className='fs-13 d-md-none'/>
          <span className='d-none d-md-block'>Добавить</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;