import React from "react";
import { Link } from "react-router-dom";
import useIsMobile from '../hooks/isMobile';

const OfferProduct = () => {
  const isMobileMD = useIsMobile('767px');

  return (
    <div className="offer-product">
      <Link to='/menu/product' className="offer-product-img">
        <img src="/imgs/img3.png" alt="Ролл «Филадельфия»" />
      </Link>
      <div className="offer-product-about">
        <h6><Link to='/menu/product'>Название товара</Link></h6>
        <p className='fs-08'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, non saepe! Eum, magni assumenda officiis et nam perspiciatis libero similique ex autem ratione reiciendis, vel, incidunt accusamus! Fugit, deleniti? Fugit.</p>
      </div>
      <div className="offer-product-price">
        <div className='d-sm-flex justify-content-end align-items-center mb-2'>
          <div className='gray fs-08 text-decoration-line-through me-2'> 650 </div>
          <div>650 ₽</div>
        </div>
        <button type='button' className={(isMobileMD) ? 'btn-light ms-3 ms-xl-4' : 'btn-secondary ms-3 ms-xl-4 mb-3'}>
          {
            (isMobileMD)
            ? <span className='fw-4 me-2'>Добавить</span>
            : <span className='fw-4 me-2'>В корзину</span>
          }
        </button>
        <BtnFav checked={false}/>
      </div>
    </div>
  );
};

export default OfferProduct;
