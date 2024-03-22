import React, { memo, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { IoCaretDownOutline } from "react-icons/io5";
import { customPrice, customWeight, getImageURL } from "../helpers/all";

const OrderItem = memo(({ data }) => {
  const [open, setOpen] = useState(false);
  const price = data?.data?.modifiers?.price
    ? data.data.modifiers.price
    : data.price;
  const weight = data?.data?.modifiers?.energy?.weight
    ? data.data.modifiers.energy.weight
    : data.weight;

  return (
    <div className="order-item">
      <div className="text">
        <h6>
          {data.title}
          {/* <span className="tag">Подарок</span> */}
        </h6>
        {weight > 0 && (
          <p className="text-muted fs-09">{customWeight(weight)}</p>
        )}
        {data?.description && (
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{data.description}</Tooltip>}
          >
            <p className="consist text-muted">{data.description}</p>
          </OverlayTrigger>
        )}
        {data?.cart?.data?.modifiers && <p>{data.cart.data.modifiers.title}</p>}
      </div>

      <div className="quantity">
        <div className="d-xxl-none input w-50p py-1 px-2 rounded-4 text-center">
          x{data.count}
        </div>
      </div>
      <div className="price">{customPrice(price)}</div>
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
  );
});

export default OrderItem;
