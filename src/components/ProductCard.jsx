import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";
import Tags from "./Tags";
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { HiOutlineInformationCircle } from "react-icons/hi2";
// import BtnFav from "./utils/BtnFav";

const ProductCard = memo(({ data }) => {
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
        <Link to={"/product/" + data?.id} state={data}>
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
        </Link>
      </div>
      <Link to={"/product/" + data?.id} state={data}>
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
      </Link>
      <hr className="d-none d-md-block" />
      {data?.options?.сompound && (
        <div className="d-flex d-lg-none justify-content-center align-items-center">
          <OverlayTrigger
            trigger={["hover", "focus"]}
            className="ms-2"
            key="top"
            placement="top"
            overlay={
              <Popover id="popover-positioned-top">
                <Popover.Header className="fs-09 fw-6 d-flex justify-content-between">
                  {t("Состав")}
                  {data?.energy?.weight > 0 && (
                    <div className="fw-6">
                      {customWeight({
                        value: data.energy.weight,
                        type: data.energy?.weightType,
                      })}
                    </div>
                  )}
                </Popover.Header>
                <Popover.Body className="white-space">
                  {data.options.сompound}
                </Popover.Body>
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
              trigger={["hover", "focus"]}
              className="ms-2"
              key="top"
              placement="top"
              overlay={
                <Popover id="popover-positioned-top">
                  <Popover.Header className="fs-09 fw-6 d-flex justify-content-between">
                    {t("Состав")}
                    {data?.energy?.weight > 0 && (
                      <div className="fw-6">
                        {customWeight({
                          value: data.energy.weight,
                          type: data.energy?.weightType,
                        })}
                      </div>
                    )}
                  </Popover.Header>
                  <Popover.Body className="white-space">
                    {data.options.сompound}
                  </Popover.Body>
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
        {data?.energy?.weight > 0 && !data?.options?.сompound && (
          <div className="text-muted d-none d-md-block">
            {customWeight({
              value: data.energy.weight,
              type: data.energy?.weightType,
            })}
          </div>
        )}
        <ButtonCart product={data} />
      </div>
    </div>
  );
});

export default ProductCard;
