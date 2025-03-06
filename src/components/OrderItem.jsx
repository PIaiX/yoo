import React, { memo } from "react";
import { customPrice, customWeight } from "../helpers/all";

const OrderItem = memo(({ data }) => {
  return (
    <div className="order-item d-flex justify-content-between">
      <div className="text">
        <h6>
          {data.title}
          {data.additions?.length > 0 ? " с добавками" : ""}
        </h6>
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
        {data?.modifiers?.length > 0 &&
          data.modifiers.map((e) => <p className="fs-09 fw-6">{e.title}</p>)}
        {data?.wishes?.length > 0 &&
          data.wishes.map((e) => <p className="fs-09 fw-6">{e.title}</p>)}
        {data?.additions?.length > 0 &&
          data.additions.reduce((sum, item) => sum + item.price, 0) > 0 && (
            <li className="ms-3 fs-09">
              {data.title}{" "}
              <span className="fw-7">
                {customPrice(
                  data?.modifiers?.price
                    ? data.options.modifierPriceSum
                      ? data.modifiers.price + data.price
                      : data.modifiers.price
                    : data.price
                )}
              </span>
            </li>
          )}
        {data?.additions?.length > 0 && (
          <ul className="cart-item-ingredients">
            {data.additions.map((e) => (
              <li>
                {e.title} <span className="fw-7">+{customPrice(e.price)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="d-flex">
        <div className="price d-flex flex-column justify-content-start align-items-end">
          {data?.count > 1 && (
            <div className="checkoutProduct-count fs-08 fw-4 mb-2">
              {customPrice(
                (data?.modifiers?.price
                  ? data.options.modifierPriceSum
                    ? data.modifiers.price + data.price
                    : data.modifiers.price
                  : data.price) +
                  (data.additions?.length > 0
                    ? data.additions.reduce((sum, item) => sum + item.price, 0)
                    : 0)
              )}
            </div>
          )}
          {data?.count > 1 && (
            <div className="checkoutProduct-count fs-08 fw-4 mb-2">
              х&nbsp;{data?.count ?? 1}
            </div>
          )}
          {data?.type == "gift"
            ? "Бесплатно"
            : customPrice(
                (data?.modifiers?.price
                  ? data.options.modifierPriceSum
                    ? (data.modifiers.price + data.price) * data.count
                    : data.modifiers.price * data.count
                  : data.price * data.count) +
                  (data?.additions?.length > 0
                    ? data.additions.reduce((sum, item) => sum + item.price, 0)
                    : 0) *
                    data.count
              )}
        </div>
      </div>
    </div>
  );
});

export default OrderItem;
