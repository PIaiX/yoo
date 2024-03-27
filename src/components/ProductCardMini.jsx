import React, { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";

const ProductCardMini = memo(({ data }) => {
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

  const image = getImageURL({
    path: data.medias,
    type: "product",
  });

  return (
    <figure className="product-card-mini">
      <Link to={"/product/" + data?.id}>
        <LazyLoadImage src={image} alt={data.title} loading="lazy" />
      </Link>
      <figcaption>
        <div>
          <h6 className="mb-2">
            <Link to={"/product/" + data?.id}>{data.title}</Link>
          </h6>
          {data.energy.weight > 0 && (
            <p className="text-muted d-none d-lg-block">
              {customWeight({
                value: data.energy.weight,
                type: data.energy?.weightType,
              })}
            </p>
          )}
        </div>
        <div className="d-flex justify-content-md-between justify-content-center align-items-center">
          <p className="d-none d-lg-block fw-6">
            {modifiers?.length > 0 && Array.isArray(modifiers)
              ? "от " + customPrice(price > 0 ? price : data.price)
              : customPrice(data.price)}
          </p>
          <ButtonCart product={data} />
        </div>
      </figcaption>
    </figure>
  );
});

export default ProductCardMini;
