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
  console.log(
    data?.cart?.data?.additions?.length,
    data?.cart?.data?.modifiers?.length,
    data?.cart?.data?.wishes?.length
  );
  return (
    <div
      className={
        "cart-item" +
        ((!data?.cart?.data?.additions ||
          data?.cart?.data?.additions?.length === 0) &&
        (!data?.cart?.data?.modifiers ||
          data?.cart?.data?.modifiers?.length === 0) &&
        (!data?.cart?.data?.wishes || data?.cart?.data?.wishes?.length === 0)
          ? " mini-cart-item"
          : "")
      }
      key={data.id}
    >
      <div className="left">
        <img src={getImageURL({ path: data.medias })} alt={data.title} />
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
            <p className="text-muted fs-08 consist pe-3">{data.description}</p>
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
      <div className="right d-flex justify-content-between flex-row">
        {!data?.noCount ? (
          <div className="order-2 order-md-1 me-3">
            <ButtonCart cart product={data} data={data} />
          </div>
        ) : (
          <div className="d-flex flex-1 w-100 me-3">
            <div className="checkoutProduct-count fs-08">
              x{data?.cart?.count ?? 1}
            </div>
          </div>
        )}

        <div className="order-md-2 fw-7 d-flex justify-content-center flex-column align-items-md-end align-self-center">
          {data.type == "gift" ? (
            "Бесплатно"
          ) : data?.discount > 0 ? (
            <>
              <div className="text-right">
                {customPrice(price * data.cart.count - data.discount)}
              </div>
              <div className="text-right">
                <s class="text-muted fw-4 fs-08">
                  {customPrice(price * data.cart.count)}
                </s>
              </div>
            </>
          ) : (
            customPrice(price)
          )}
        </div>

        {/* {isAuth && <BtnFav checked={false} />} */}
      </div>
    </div>
  );
});

export default CartItem;
