import React, { memo } from "react";
import { customPrice, customWeight, getImageURL } from "../helpers/all";

const CheckoutProduct = memo(({ data }) => {
  return (
    <div className="checkoutProduct d-flex align-items-start">
      <img src={getImageURL({ path: data.medias })} alt={data.title} />
      <div className="flex-1">
        <h6>{data.title}</h6>
        <div className="d-flex align-items-center">
          {data?.energy?.weight > 0 && (
            <p>
              {customWeight({
                value: data.energy.weight,
                type: data.energy?.weightType,
              })}
            </p>
          )}
          <p className="ms-auto">
            {data.type == "gift"
              ? "Бесплатно"
              : customPrice(
                  data?.cart?.data?.modifiers?.price
                    ? data.options.modifierPriceSum
                      ? data.cart.data.modifiers.price + data.price
                      : data.cart.data.modifiers.price
                    : data.price
                )}
          </p>
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
