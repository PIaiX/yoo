import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineHeart } from "react-icons/hi2";
// import Fish from "../assets/imgs/fish.png";
// import Halal from "../assets/imgs/halal.png";
// import Chicken from '../assets/imgs/chicken.png';
// import Meat from '../assets/imgs/meat.png';
// import Spicy from '../assets/imgs/pepper.png';
// import Vegetarian from '../assets/imgs/vegetarian.png';
// import useIsMobile from "../hooks/isMobile";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ProductCard = memo(({ data }) => {
  const auth = useSelector((state) => state.auth);
  const [isFav, setIsFav] = useState(false);

  var price = data.price ?? 0;
  if (Array.isArray(data.modifiers) && data?.modifiers?.length > 0) {
    var price = Math.min(...data.modifiers.map((item) => item.price));
  }

  return (
    <div className="product">
      <div className="product-img">
        <Link to={"/product/" + data.id}>
          <LazyLoadImage
            src={getImageURL({ path: data.medias })}
            alt={data.title}
          />
        </Link>
        {/* <ul className="product-stickers">
          <li>
            <img src={Fish} alt="рыба" />
          </li>
          <li>
            <img src={Halal} alt="халяль" />
          </li>
        </ul> */}
        {/* <ul className="product-tags">
          <li>
            <div className="hit">Хит!</div>
          </li>
          <li>
            <div className="new">Новинка</div>
          </li>
        </ul> */}
        {auth?.isAuth && (
          <button
            type="button"
            onClick={() => setIsFav(!isFav)}
            className={isFav ? "btn-fav active" : "btn-fav"}
          >
            <HiOutlineHeart />
          </button>
        )}
      </div>

      <h6>{data.title}</h6>
      {!isMobile && (
        <>
          <p className="text-muted fs-09">{data.description}</p>
          <hr />
        </>
      )}

      <div className="d-flex justify-content-between align-items-center">
        {data.energy.weight > 0 && (
          <div className="gray d-none d-md-block">
            {customWeight(data.energy.weight)}
          </div>
        )}
        <div className="w-xs-100 d-flex justify-content-between align-items-center">
          <div>
            <div className="fs-12">
              {data?.modifiers?.length > 0
                ? "от " + customPrice(price)
                : customPrice(price)}
            </div>
            {/* <div className="gray fs-09 text-decoration-line-through">
              {data?.modifiers?.length > 0
                ? "от " + customPrice(price)
                : customPrice(data.price)}
            </div> */}
          </div>
        </div>
        <ButtonCart product={data} />
      </div>
    </div>
  );
});

export default ProductCard;
