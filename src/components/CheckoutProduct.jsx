import React, { memo, useState } from "react";
import { Badge, Collapse } from "react-bootstrap";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { customPrice, customWeight, getImageURL } from "../helpers/all";

const CheckoutProduct = memo(({ data }) => {
  const price =
    data?.cart?.data?.modifiers?.length > 0
      ? data.options.modifierPriceSum
        ? data.cart.data.modifiers.reduce((sum, item) => sum + item.price, 0) +
          data.price
        : data.cart.data.modifiers.reduce((sum, item) => sum + item.price, 0)
      : data.price;

  const [open, setOpen] = useState({ additions: false, wishes: false });

  return (
    <div className="checkoutProduct d-flex align-items-start ">
      <img src={getImageURL({ path: data.medias })} alt={data.title} />
      <div className="flex-1">
        <h6 className="fs-09">{data.title}</h6>
        <div className="d-flex justify-content-between align-items-center">
          {data?.energy?.weight > 0 && (
            <p>
              {customWeight({
                value: data.energy.weight,
                type: data.energy?.weightType,
              })}
            </p>
          )}
          <p className="fw-7">
            {data.type == "gift" ? "Бесплатно" : customPrice(price)}
          </p>
          <p className="checkoutProduct-count fs-08">
            x{data?.cart?.count ?? 1}
          </p>
        </div>
        {(data?.cart?.data?.additions?.length > 0 ||
          data?.cart?.data?.wishes?.length > 0) && (
          <div className="border-bottom my-2" />
        )}
        {data?.cart?.data?.additions?.length > 0 && (
          <p className="mb-1">
            <a
              className="fs-09 fw-6 d-flex align-items-center mb-0"
              onClick={() =>
                setOpen((prev) => ({ ...prev, additions: !open.additions }))
              }
              aria-controls="collapse-additions"
              aria-expanded={open}
            >
              <span>Добавки</span>{" "}
              <Badge bg="secondary" className="mx-2">
                {data?.cart?.data?.additions?.length}
              </Badge>
              {open.additions ? (
                <IoChevronUp color="#666" />
              ) : (
                <IoChevronDown color="#666" />
              )}
            </a>
            <Collapse in={open.additions}>
              <div id="collapse-additions">
                <ul className="cart-item-ingredients">
                  {data.cart.data.additions.map((e) => (
                    <li>
                      {e.title}{" "}
                      <span className="fw-7">+{customPrice(e.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Collapse>
          </p>
        )}
        {data?.cart?.data?.wishes?.length > 0 && (
          <p>
            <a
              className="fs-09 fw-6 d-flex align-items-center mb-0"
              onClick={() =>
                setOpen((prev) => ({ ...prev, wishes: !open.wishes }))
              }
              aria-controls="collapse-wishes"
              aria-expanded={open}
            >
              <span>Пожелания</span>{" "}
              <Badge bg="secondary" className="mx-2">
                {data?.cart?.data?.wishes?.length}
              </Badge>
              {open.wishes ? (
                <IoChevronUp color="#666" />
              ) : (
                <IoChevronDown color="#666" />
              )}
            </a>
            <Collapse in={open.wishes}>
              <div id="collapse-wishes">
                <ul className="cart-item-ingredients-minus">
                  {data.cart.data.wishes.map((e) => (
                    <li>
                      {e.title}{" "}
                      <span className="fw-7">+{customPrice(e.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Collapse>
          </p>
        )}
      </div>
    </div>
  );
});

export default CheckoutProduct;
