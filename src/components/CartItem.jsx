import React, { memo, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { IoCaretDownOutline } from "react-icons/io5";
import { customPrice, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";
import BtnFav from "./utils/BtnFav";

const CartItem = memo(({ data }) => {
  const [open, setOpen] = useState(false);
  const price = data?.cart?.data?.modifiers?.price ?? data.price;

  return (
    <div className="cart-item">
      <div className="left">
        <input type="checkbox" className="me-1 me-sm-3" />
        <img src={getImageURL({ path: data.medias })} alt={data.title} />
        <div className="text">
          <h6>
            {data.title}
            {/* <span className="tag">Подарок</span> */}
          </h6>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{data.description}</Tooltip>}
          >
            <p className="consist">{data.description}</p>
          </OverlayTrigger>
          {data?.cart?.data?.modifiers && (
            <p>{data.cart.data.modifiers.title}</p>
          )}

          {/* Кнопка с разворачивающимся блоком появляются только если есть дополнительные ингредиенты */}

          {data?.cart?.data?.additions?.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="d-flex align-items-center"
              >
                <span>Показать ещё</span>
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
          <p className="d-none d-md-block text-center mb-2">Количество</p>
          <ButtonCart cart data={data} />
        </div>

        <div className="order-1 order-md-2">{customPrice(price)}</div>

        <BtnFav checked={false} />
      </div>
    </div>
  );
});

export default CartItem;
