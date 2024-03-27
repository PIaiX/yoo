import React, { memo, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { IoCaretDownOutline } from "react-icons/io5";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";
// import BtnFav from "./utils/BtnFav";
// import { useSelector } from "react-redux";

const CartItem = memo(({ data }) => {
  const [open, setOpen] = useState(false);

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
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>{data.description}</Tooltip>}
            >
              <p className="text-muted fs-09 consist">{data.description}</p>
            </OverlayTrigger>
          )}
          {data?.cart?.data?.modifiers && (
            <p className="fs-09">{data.cart.data.modifiers.title}</p>
          )}

          {data?.cart?.data?.additions?.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="d-flex align-items-center"
              >
                <span>Показать ещё</span>
                <IoCaretDownOutline className="fs-08 ms-2" />
              </button>
              <Collapse in={open}>
                <ul className="cart-item-ingredients">
                  {data.cart.data.additions.map((e) => (
                    <li>
                      {e.title} +{customPrice(e.price)}
                    </li>
                  ))}
                </ul>
              </Collapse>
            </>
          )}
        </div>
      </div>
      <div className="right">
        <div className="order-2 order-md-1">
          <ButtonCart cart product={data} />
        </div>

        <div className="order-1 order-md-2">
          {data.type == "gift"
            ? "Бесплатно"
            : customPrice(
                data?.cart?.data?.modifiers?.price
                  ? data.options.modifierPriceSum
                    ? data.cart.data.modifiers.price + data.price
                    : data.cart.data.modifiers.price
                  : data.price
              )}
        </div>

        {/* {isAuth && <BtnFav checked={false} />} */}
      </div>
    </div>
  );
});

export default CartItem;
