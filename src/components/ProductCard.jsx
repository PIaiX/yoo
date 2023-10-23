import React, { memo } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";
import BtnFav from "./utils/BtnFav";

const ProductCard = memo(({ data }) => {
  const isAuth = useSelector((state) => state.auth.isAuth);

  var price = data.price ?? 0;
  if (Array.isArray(data.modifiers) && data?.modifiers?.length > 0) {
    var price = Math.min(...data.modifiers.map((item) => item.price));
  }

  return (
    <div className="product" key={data.id}>
      <div className="product-img">
        <Link to={"/product/" + data.id}>
          <LazyLoadImage
            src={getImageURL({ path: data.medias })}
            alt={data.title}
            loading="lazy"
          />
        </Link>
        {isAuth && <BtnFav product={data} />}
      </div>

      <h6 className="text-center text-md-start">{data.title}</h6>
      {/* <p className="d-none d-md-block text-muted fs-09">{data.description}</p> */}

      <div className='d-flex justify-content-between align-items-center'>
        <div className="fs-12">
          {data?.modifiers?.length > 0
            ? "от " + customPrice(price)
            : customPrice(price)}
        </div>
        <ButtonCart product={data} />
      </div>
    </div>
  );
});

export default ProductCard;
