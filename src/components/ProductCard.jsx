import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineHeart } from "react-icons/hi2";
import CartIcon from './svgs/CartIcon';

const ProductCard = () => {
  const [isFav, setIsFav] = useState(false);

  return (
    <div className="product">
      <div className="product-img">
        <Link to='/menu/product'>
          <img src="/imgs/img.jpg" alt="Ролл «Филадельфия»"/>
        </Link>
        <button 
          type='button' 
          onClick={()=>setIsFav(!isFav)} 
          className={(isFav) ? 'btn-fav active' : 'btn-fav'}
        >
          <HiOutlineHeart/>
        </button>
      </div>
      
      <h6>Lorem ipsum dolor sit amet consectetur</h6>
      
      <div className='d-flex justify-content-between align-items-center'>
        <div>
          <div className='fs-12'>650 ₽</div>
          <div className='gray fs-09 text-decoration-line-through'> 650 </div>
        </div>
        <button type='button' className='btn-primary rounded-pill ms-3'>
          <CartIcon className='fs-15 d-md-none'/>
          <span className='d-none d-md-block'>Добавить</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;