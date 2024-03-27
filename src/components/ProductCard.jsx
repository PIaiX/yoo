import React, { memo } from "react";
import { Link } from "react-router-dom";
// import Fish from "../assets/imgs/fish.png";
// import Halal from "../assets/imgs/halal.png";
// import Chicken from '../assets/imgs/chicken.png';
// import Meat from '../assets/imgs/meat.png';
// import Spicy from '../assets/imgs/pepper.png';
// import Vegetarian from '../assets/imgs/vegetarian.png';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";
// import BtnFav from "./utils/BtnFav";

const ProductCard = memo(({ data }) => {
  const modifiers =
    data?.modifiers?.length > 0
      ? [...data.modifiers].sort((a, b) => a?.price - b?.price)
      : [];

  const price =
    modifiers?.length > 0
      ? data.options.modifierPriceSum
        ? modifiers[0].price + data.price
        : modifiers[0].price
      : data.price;

  // const discount =
  //   modifiers?.length > 0
  //     ? data.options.modifierPriceSum
  //       ? modifiers[0].discount + data.discount
  //       : modifiers[0].discount
  //     : data.discount;

  return (
    <div className="product" key={data?.id}>
      <div className="product-img">
        <Link to={"/product/" + data?.id}>
          <LazyLoadImage
            src={getImageURL({ path: data?.medias })}
            alt={data.title}
            loading="lazy"
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
        {/* {isAuth && <BtnFav product={data} />} */}
      </div>

      <h6 className="title text-center text-md-start">{data.title}</h6>
      <p className="d-none d-md-block text-muted fs-09">{data.description}</p>
      <hr className="d-none d-md-block" />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        {data.energy.weight > 0 && (
          <div className="text-muted d-none d-md-block">
            {customWeight({
              value: data.energy.weight,
              type: data.energy?.weightType,
            })}
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center mb-2 mb-md-0">
          <div>
            <div className="fs-12 fw-5">
              {modifiers?.length > 0 && Array.isArray(modifiers)
                ? "от " + customPrice(price > 0 ? price : data.price)
                : customPrice(data.price)}
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
