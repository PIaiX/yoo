import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  customPrice,
  customWeight,
  getImageURL,
  sortMain,
} from "../helpers/all";
import ButtonCartProductMini from "./ButtonCartProductMini";
import { useSelector } from "react-redux";

const CartItemExtra = memo(({ data }) => {
  const { t } = useTranslation();
  const options = useSelector((state) => state.settings?.options);

  const modifiers =
    options?.brand?.options?.priceAffiliateType &&
    Array.isArray(data.modifiers) &&
    data?.modifiers?.length > 0
      ? data.modifiers
          .filter((e) => e?.modifierOptions?.length > 0)
          .sort((a, b) => a?.price - b?.price)
      : Array.isArray(data.modifiers) && data?.modifiers?.length > 0
      ? [...data.modifiers].sort((a, b) => a?.price - b?.price)
      : [];

  const price =
    Array.isArray(modifiers) && modifiers?.length > 0 && modifiers[0]?.price
      ? data?.options?.modifierPriceSum
        ? modifiers[0].price + data.price
        : modifiers[0].price
      : data.price;

  data = {
    ...data,
    modifiers: modifiers,
    cart: {
      modifiers: [],
      additions: [],
      wishes: [],
    },
  };

  const image = getImageURL({
    path:
      Array.isArray(data.medias) && data.medias?.length > 0
        ? sortMain(data.medias)[0]?.media
        : data.medias,
    type: "product",
  });

  return (
    <div className="cart-item" key={data.id}>
      <div className="left">
        <LazyLoadImage
          src={image}
          alt={data.title}
          draggable="false"
          loading="lazy"
        />
        <div className="text">
          <h6>
            <span>{data.title}</span>
          </h6>
          {data?.energy?.weight > 0 && (
            <p className="text-muted fs-09">
              {customWeight({
                value: data.energy.weight,
                type: data.energy?.weightType,
              })}
            </p>
          )}
          {data?.description && data?.description?.length > 0 && (
            <p className="text-muted fs-08 consist pe-3">{data.description}</p>
          )}
        </div>
      </div>
      <div className="right d-flex justify-content-between flex-row">
        <div className="order-2 order-md-1 me-3">
          <ButtonCartProductMini product={data} />
        </div>

        <div className="order-md-2 fw-7 d-flex justify-content-center flex-column align-items-end align-self-center">
          <p className="d-none d-lg-block fw-6">
            {modifiers?.length > 0 && Array.isArray(modifiers)
              ? "от " + customPrice(price > 0 ? price : data.price)
              : customPrice(data.price)}
          </p>
        </div>
      </div>
    </div>
  );
});

export default CartItemExtra;
