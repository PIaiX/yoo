import React, { memo } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { customPrice, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";
import Tags from "./Tags";
// import BtnFav from "./utils/BtnFav";

const ProductCard = memo(({ data, onShow }) => {
  const { t } = useTranslation();
  const themeProductImage = useSelector(
    (state) => state.settings?.options?.themeProductImage
  );

  const modifiers =
    Array.isArray(data.modifiers) && data?.modifiers?.length > 0
      ? [...data.modifiers].sort((a, b) => a?.price - b?.price)
      : [];

  const price =
    Array.isArray(modifiers) && modifiers?.length > 0 && modifiers[0]?.price
      ? data?.options?.modifierPriceSum
        ? modifiers[0].price + data.price
        : modifiers[0].price
      : data.price;

  // const discount =
  //   modifiers?.length > 0
  //     ? data.options.modifierPriceSum
  //       ? modifiers.reduce((sum, item) => sum + item.discount, 0) +
  //         data.discount
  //       : modifiers.reduce((sum, item) => sum + item.discount, 0)
  //     : data.discount;

  return (
    <div className="product" key={data?.id}>
      <div
        className={
          themeProductImage == 1 ? "product-img rectangle" : "product-img"
        }
      >
        <a onClick={() => onShow()}>
          {data?.tags?.length > 0 && (
            <div className="p-2 position-absolute">
              <Tags data={data.tags} mini />
            </div>
          )}
          <LazyLoadImage
            wrapperClassName="d-flex"
            src={getImageURL({ path: data?.medias })}
            alt={data.title}
            loading="lazy"
            effect="blur"
          />
        </a>
      </div>
      <a onClick={() => onShow()}>
        <h6
          className={
            "title text-center text-md-start " +
            (data?.options?.subtitle ? "fs-09" : "")
          }
        >
          {data.title}
          {data?.options?.subtitle ? (
            <div className="subtitle fw-5">{data?.options.subtitle}</div>
          ) : null}
        </h6>
        <p className="d-none d-md-block fs-09">{data.description}</p>
      </a>
      <hr className="d-none d-md-block" />
      {data?.options?.сompound && (
        <div className="d-flex d-lg-none justify-content-center align-items-center">
          <OverlayTrigger
            trigger={["hover"]}
            className="ms-2"
            key="top"
            placement="top"
            overlay={
              <Popover id="popover-positioned-top">
                <Popover.Header className="fs-09 fw-6">
                  {t("Состав")}
                </Popover.Header>
                <Popover.Body>{data.options.сompound}</Popover.Body>
              </Popover>
            }
          >
            <a className="fw-5">Состав</a>
          </OverlayTrigger>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center">
        {data?.options?.сompound && (
          <div className="d-none d-lg-flex justify-content-between align-items-center">
            <OverlayTrigger
              trigger={["hover"]}
              className="ms-2"
              key="top"
              placement="top"
              overlay={
                <Popover id="popover-positioned-top">
                  <Popover.Header className="fs-09 fw-6">
                    {t("Состав")}
                  </Popover.Header>
                  <Popover.Body>{data.options.сompound}</Popover.Body>
                </Popover>
              }
            >
              <a className="fw-5">Состав</a>
            </OverlayTrigger>
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="price fw-5">
              {modifiers?.length > 0 && Array.isArray(modifiers)
                ? "от " + customPrice(price > 0 ? price : data.price)
                : customPrice(data.price)}
            </div>
          </div>
        </div>
        <ButtonCart product={data} />
      </div>
    </div>
  );
});

export default ProductCard;
