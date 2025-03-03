import { Modal, ProgressBar } from "react-bootstrap";
import React, { useMemo, useState, memo } from "react";
import { HiOutlineGift } from "react-icons/hi2";
import { customPrice } from "../../helpers/all";
import ProductCard from "../ProductCard";
import { IoArrowForward } from "react-icons/io5";

const Gifts = memo(({ total, items }) => {
  if (!items || items?.length === 0) {
    return null;
  }

  const [show, setShow] = useState(false);

  const { prices, price, priceIndex } = useMemo(() => {
    let prices =
      items?.length > 0
        ? [
            ...new Set(
              items.map((item) =>
                item?.options?.minCart ? Number(item.options.minCart) : 0
              )
            ),
          ]
            .filter((e) => e !== 0)
            .sort((a, b) => a - b)
        : false;

    let price = null;
    let priceIndex = 0;
    if (prices?.length > 0) {
      prices.forEach((value, index) => {
        if (value > total) {
          if (price === null || value - total < price - total) {
            price = value;
            priceIndex = index;
          }
        }
      });
      if (price === null && prices.at(-1) <= total) {
        price = prices.at(-1);
      }
    }

    return { prices, price, priceIndex };
  }, [items, total]);

  if (!prices || prices?.length === 0) {
    return null;
  }

  return (
    <>
      <div className="gifts">
        {total < price && (
          <ul className="mb-2">
            {prices.map((e, index) => {
              let percent =
                Number(
                  Number(total) -
                    (prices[index - 1] != undefined
                      ? Number(prices[index - 1])
                      : 0)
                ) > 0
                  ? (Number(Number(total)) / Number(e)) * 100
                  : 0;

              return (
                <li>
                  <ProgressBar
                    animated
                    variant="danger"
                    now={percent}
                    className="bar"
                  />
                  <a
                    onClick={() => percent >= 100 && setShow(true)}
                    className={percent >= 100 ? "icon active" : "icon"}
                  >
                    <HiOutlineGift />
                    <div className={percent >= 100 ? "text active" : "text"}>
                      {customPrice(e)}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
        {total < price ? (
          <p className="text-muted fs-08">
            Добавьте товар на сумму {customPrice(price)}{" "}
            {priceIndex > 0
              ? " чтобы улучшить подарок"
              : " чтобы получить подарок"}
          </p>
        ) : (
          <a
            onClick={() => setShow(true)}
            className="fw-6 d-block cart-box px-3"
          >
            <b className="fs-12">Вам доступен подарок!</b>
            <br />
            <p className="color-main">
              Выберите из списка <IoArrowForward />
            </p>
          </a>
        )}
      </div>
      <Modal size="md" show={show} onHide={setShow} centered>
        <Modal.Header closeButton className="fw-7">
          Выберите товар
        </Modal.Header>
        <Modal.Body>
          {!items || items?.length === 0 ? (
            <Empty mini text="Ничего нет" image={() => <EmptyCatalog />} />
          ) : (
            items
              .filter((e) => e.options.minCart !== "0")
              .map((item) => (
                <ProductCard
                  key={item.id}
                  data={{ ...item, type: "gift", themeProduct: 0, total }}
                />
              ))
          )}
        </Modal.Body>
      </Modal>
    </>
  );
});

export default Gifts;
