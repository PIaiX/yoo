import React, { memo } from "react";
import { customPrice, customWeight, getImageURL } from "../helpers/all";

const CheckoutProduct = memo(({ data }) => {
  const price = data?.cart?.data?.modifiers?.price
    ? data.cart.data.modifiers.price
    : data.price;

  return (
    <div className="checkoutProduct">
      <img src={getImageURL({ path: data.medias })} alt={data.title} />
      <div className="flex-1">
        <h6>{data.title}</h6>
        <div className="d-flex align-items-center">
          {data?.energy?.weight && <p>{customWeight(data.energy.weight)}</p>}
          <p className="ms-auto">{customPrice(price)}</p>
          <p className="checkoutProduct-count">x{data?.cart?.count ?? 1}</p>
        </div>
      </div>
    </div>
  );
});

export default CheckoutProduct;
