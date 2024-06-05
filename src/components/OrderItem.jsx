import React, { memo } from "react";
import { customPrice, customWeight } from "../helpers/all";

const OrderItem = memo(({ data }) => {
  return (
    <div className="order-item d-flex justify-content-between">
      <div className="text">
        <h6>{data.title}</h6>
        {data?.energy?.weight > 0 && (
          <p className="text-muted fs-09">
            {customWeight({
              value: data.energy.weight,
              type: data.energy?.weightType,
            })}
          </p>
        )}
        {data?.description && (
          <p className="fs-09 mb-2 text-muted">{data.description}</p>
        )}
        {data?.cart?.data?.modifiers?.length > 0 &&
          data.cart.data.modifiers.map((e) => (
            <p className="fs-09 fw-6">{e.title}</p>
          ))}
        {data?.cart?.data?.wishes?.length > 0 &&
          data.cart.data.wishes.map((e) => (
            <p className="fs-09 fw-6">{e.title}</p>
          ))}

        {data?.cart?.data?.additions?.length > 0 && (
          <>
            <ul className="cart-item-ingredients">
              {data.cart.data.additions.map((e) => (
                <li>
                  {e.title}{" "}
                  <span className="fw-7">+{customPrice(e.price)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="d-flex">
        <div className="quantity me-2">
          <div className="checkoutProduct-count">x{data?.count ?? 1}</div>
        </div>
        <div className="price">
          {data?.type == "gift"
            ? "Бесплатно"
            : customPrice(
                data?.modifiers?.price
                  ? data.options.modifierPriceSum
                    ? (data.modifiers.price + data.price) * data.count
                    : data.modifiers.price * data.count
                  : data.price * data.count
              )}
        </div>
      </div>
    </div>
  );
});

export default OrderItem;
