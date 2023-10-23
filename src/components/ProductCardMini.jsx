import React from "react";
import { Link } from "react-router-dom";

const ProductCardMini = () => {
  return (
    <figure className="product-card-mini">
      <Link to='/menu/product'><img src="/imgs/img3.png" alt="Ролл «Филадельфия»" /></Link>
      <figcaption>
        <div>
          <h6><Link to='/menu/product'>Ролл «Филадельфия»</Link></h6>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <p className='d-none d-lg-block fw-6'>340 ₽</p>
          <button type='button' className='btn-light'>
            <span className="d-lg-none">340 ₽</span>
            <span className="d-none d-lg-inline">В&nbsp;корзину</span>
          </button>
        </div>
      </figcaption>
    </figure>
  );
};

export default ProductCardMini;
