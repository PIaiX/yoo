import React, { memo } from "react";
import { customPrice, customWeight, getImageURL } from "../helpers/all";

const CheckoutProduct = memo(({ data }) => {
  const price = data?.cart?.data?.modifiers?.price
    ? data.cart.data.modifiers.price
    : data.price;
  const weight = data?.cart?.data?.modifiers?.energy?.weight
    ? data.cart.data.modifiers.energy.weight
    : data.weight;

  return (
    <div className="checkoutProduct d-flex align-items-start">
      <img src={getImageURL({ path: data.medias })} alt={data.title} />
      <div className="flex-1">
        <h6>{data.title}</h6>
        <div className="d-flex align-items-center">
          {weight > 0 && <p>{customWeight(weight)}</p>}
          <p className="ms-auto">{customPrice(price)}</p>
          <p className="checkoutProduct-count">x{data?.cart?.count ?? 1}</p>
        </div>
        {data?.cart?.data?.additions?.length > 0 && (
          <ul className="cart-item-ingredients border-top mt-2 pt-2">
            {data.cart.data.additions.map((e) => (
              <li>
                {e.title} +{customPrice(e.price)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

export default CheckoutProduct;
