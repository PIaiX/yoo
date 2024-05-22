import React, { memo } from "react";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";
// import BtnFav from "./utils/BtnFav";
// import { useSelector } from "react-redux";

const CartItem = memo(({ data }) => {
  const price =
    data?.cart?.data?.modifiers?.length > 0
      ? data.options.modifierPriceSum
        ? data.cart.data.modifiers.reduce((sum, item) => sum + item.price, 0) +
          data.price
        : data.cart.data.modifiers.reduce((sum, item) => sum + item.price, 0)
      : data.price;

  return (
    <div className="cart-item" key={data.id}>
      <div className="left">
        {/* <input type="checkbox" className="me-1 me-sm-3" /> */}
        <img src={getImageURL({ path: data.medias })} alt={data.title} />
        <div className="text">
          <h6>
            {data.title}
            {/* <span className="tag">Подарок</span> */}
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
            <p className="text-muted fs-09 consist">{data.description}</p>
          )}
          {data?.cart?.data?.modifiers?.length > 0 &&
            data.cart.data.modifiers.map((e) => (
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
      </div>
      <div className="right">
        <div className="order-2 order-md-1">
          <ButtonCart cart product={data} />
        </div>

        <div className="order-1 order-md-2 fw-7">
          {data.type == "gift" ? "Бесплатно" : customPrice(price)}
        </div>

        {/* {isAuth && <BtnFav checked={false} />} */}
      </div>
    </div>
  );
});

export default CartItem;
