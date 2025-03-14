import React from "react";
import { Link } from "react-router-dom";
import { IoCaretDownOutline } from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const OfferProduct = () => {
  return (
    <div className="offer-product">
      <Link to="/product" className="offer-product-img">
        <img draggable="false" src="imgs/img3.png" alt="Ролл «Филадельфия»" />
      </Link>
      <div className="offer-product-about">
        <h6>
          <Link to="/product">Ролл «Филадельфия»</Link>
        </h6>
        <p>
          Лосось, помело, сыр сливочный, соус гуакамоле, соус васаби, соус манго
          чили, темпура,{" "}
        </p>
        <p className="d-none d-md-block">230г</p>
        <button draggable={false}  type="button" className="d-none d-md-flex align-items-center">
          <span>Показать ещё</span>
          <IoCaretDownOutline className="fs-08 ms-2" />
        </button>
      </div>
      <div className="offer-product-price">
        <div>
          <div>650 ₽</div>
          <div className="gray fs-08 text-decoration-line-through"> 650 </div>
        </div>

        <button draggable={false}  type="button" className="d-md-none btn-light ms-3 ms-xl-4">
          <span className="fw-4 me-2">Добавить</span>
          <HiOutlineShoppingBag className="fs-13" />
        </button>

        <button draggable={false} 
          type="button"
          className="d-none d-md-flex btn-secondary ms-3 ms-xl-4"
        >
          <span className="fw-4 me-2">В корзину</span>
          <HiOutlineShoppingBag className="fs-13" />
        </button>
      </div>
    </div>
  );
};

export default OfferProduct;
