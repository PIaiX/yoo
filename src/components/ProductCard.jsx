import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineHeart } from "react-icons/hi2";
import Fish from '../assets/imgs/fish.png';
import Halal from '../assets/imgs/halal.png';
// import Chicken from '../assets/imgs/chicken.png';
// import Meat from '../assets/imgs/meat.png';
// import Spicy from '../assets/imgs/pepper.png';
// import Vegetarian from '../assets/imgs/vegetarian.png';
import useIsMobile from '../hooks/isMobile';

const ProductCard = () => {
  const [isFav, setIsFav] = useState(false);
  const isMobileMD = useIsMobile('767px');

  return (
    <div className="product">
      <div className="product-img">
        <Link to='/menu/product'>
          <img src="imgs/img3.png" alt="Ролл «Филадельфия»"/>
        </Link>
        <ul className="product-stickers">
          <li>
            <img src={Fish} alt="рыба" />
          </li>
          <li>
            <img src={Halal} alt="халяль" />
          </li>
        </ul>
        <ul className="product-tags">
          <li>
            <div className="hit">Хит!</div>
          </li>
          <li>
            <div className="new">Новинка</div>
          </li>
        </ul>
        <button 
          type='button' 
          onClick={()=>setIsFav(!isFav)} 
          className={(isFav) ? 'btn-fav active' : 'btn-fav'}
        >
          <HiOutlineHeart/>
        </button>
      </div>
      
      <h6>Ролл «Филадельфия»</h6>
      {
        (!isMobileMD) &&
        <>
          <p>Лосось, сливочный сыр, огурец, рис, нори</p>
          <hr />
        </>
      }
      
      <div className="d-flex justify-content-between align-items-center">
        <div className='gray d-none d-md-block'>300 г</div>
        <div className='w-xs-100 d-flex justify-content-between align-items-center'>
          <div>
            <div className='fs-12'>650 ₽</div>
            <div className='gray fs-09 text-decoration-line-through'> 650 </div>
          </div>
          <button type='button' className='btn-light rounded-pill ms-3'>
            <HiOutlineShoppingBag className='fs-15 d-none d-md-block'/>
            <span className='d-md-none'>Добавить</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;