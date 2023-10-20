import React, { memo, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { IoCaretDownOutline } from "react-icons/io5";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";

const OrderItem = memo(({ data }) => {
  const [open, setOpen] = useState(false);
  const price = data?.data?.modifiers?.price
    ? data.data.modifiers.price
    : data.price;


  return (
    <div className="order-item">
      <img src={getImageURL({ path: data.medias })} alt={data.title} />
      <div className="text">
        <h6>
          {data.title}
          {/* <span className="tag">Подарок</span> */}
        </h6>
        {data?.description && (
          <p className="fs-08 dark-gray">{data.description}</p>
        )}
      </div>

      <div className="quantity">
        <div className="input w-50p py-1 px-2 rounded-4 text-center">
          x{data.count}
        </div>
      </div>
      <div className="price">{customPrice(price)}</div>
    </div>
  );
});

export default OrderItem;
