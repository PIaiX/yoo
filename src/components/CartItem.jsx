import React, { memo, useState } from "react";
import { Badge, Collapse } from "react-bootstrap";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
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

  const [open, setOpen] = useState({ additions: false, wishes: false });

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
              <span className="fs-09 fw-7 card d-inline-block p-1 px-2 mb-3 me-2">
                {e.title}
              </span>
            ))}

          {data?.cart?.data?.additions?.length > 0 && (
            <p>
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
