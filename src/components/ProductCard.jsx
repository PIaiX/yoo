import React, { memo, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import {
  customPrice,
  customWeight,
  getImageURL,
  keyGenerator,
  sortMain,
} from "../helpers/all";
import ButtonCartProductMini from "./ButtonCartProductMini";
import Tags from "./Tags";
import ButtonCartProductGift from "./ButtonCartProductGift";

const ProductCard = memo(({ data, onLoad }) => {
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

  // const discount =
  //   modifiers?.length > 0
  //     ? data.options.modifierPriceSum
  //       ? modifiers.reduce((sum, item) => sum + item.discount, 0) +
  //         data.discount
  //       : modifiers.reduce((sum, item) => sum + item.discount, 0)
  //     : data.discount;

  const [activeIndex, setActiveIndex] = useState(0);

  if (data?.type == "gift") {
    return (
      <div className="product product-gift" key={data?.id}>
        <div className="left">
          <div
            className={
              (options?.themeProductImageSize ? " product-img-contain" : "") +
              (Array.isArray(data?.medias) && data?.medias?.length > 1
                ? " no-hover"
                : "")
            }
          >
            <a onClick={() => onLoad(data)}>
              {data?.tags?.length > 0 && (
                <div className="p-2 z-3 position-absolute">
                  <Tags data={data.tags} mini />
                </div>
              )}

              {Array.isArray(data?.medias) && data?.medias?.length > 1 ? (
                <div
                  onMouseLeave={() => setActiveIndex(0)}
                  onMouseMove={(e) =>
                    data?.medias?.length <= 2 && setActiveIndex(1)
                  }
                >
                  {sortMain(data?.medias).map((e, index) => (
                    <LazyLoadImage
                      className={activeIndex === index ? "show" : "hide"}
                      src={getImageURL({
                        path: e.media,
                      })}
                      alt={data.title}
                      loading="lazy"
                      effect="blur"
                    />
                  ))}
                  {Array.isArray(data?.medias) && data?.medias?.length > 2 && (
                    <div className="pagination-mouse">
                      {data.medias.map((e, index) => (
                        <div
                          key={index}
                          className={
                            "pagination-mouse-item " +
                            (activeIndex === index
                              ? "pagination-mouse-item-active"
                              : "")
                          }
                          onMouseMove={(e) => setActiveIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <LazyLoadImage
                  wrapperClassName="d-flex"
                  src={getImageURL({ path: data?.medias })}
                  alt={data.title}
                  loading="lazy"
                  effect="blur"
                />
              )}
            </a>
          </div>
        </div>
        <div className="right w-100">
          <a onClick={() => onLoad(data)}>
            <h6 className={data?.options?.subtitle ? " fs-09" : ""}>
              {data.title}
              {data?.options?.subtitle ? (
                <div className="subtitle fw-5">{data.options.subtitle}</div>
              ) : (
                ""
              )}
            </h6>
            {options?.themeProductDesc ? (
              <p className="desc desc-full d-none d-md-block fs-09">
                {data.description}
              </p>
            ) : (
              <p className="desc d-none d-md-block fs-09">{data.description}</p>
            )}
          </a>
          {data?.options?.сompound && (
            <div className="d-flex d-lg-none justify-content-center align-items-center">
              <OverlayTrigger
                trigger={["focus", "click"]}
                rootClose
                className="ms-2"
                key="top"
                placement="top"
                overlay={
                  <Popover id="popover-positioned-top">
                    <Popover.Header className="fs-09 fw-6 d-flex justify-content-between">
                      {t("Состав")}
                      {data?.energy?.weight > 0 && (
                        <div className="fw-6">
                          {options?.productWeightDiscrepancy ? "±" : ""}
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
                <a className="fw-5 text-decoration-underline">Состав</a>
              </OverlayTrigger>
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center">
            {data?.options?.сompound && (
              <div className="d-none d-lg-flex justify-content-between align-items-center">
                <OverlayTrigger
                  trigger={["focus", "click"]}
                  rootClose
                  className="ms-2"
                  key="top"
                  placement="top"
                  overlay={
                    <Popover id="popover-positioned-top">
                      <Popover.Header className="fs-09 fw-6 d-flex justify-content-between">
                        {t("Состав")}
                        {data?.energy?.weight > 0 && (
                          <div className="fw-6">
                            {options?.productWeightDiscrepancy ? "±" : ""}
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
                  <a className="fw-5 text-decoration-underline">Состав</a>
                </OverlayTrigger>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <a onClick={() => onLoad(data)} className="price fw-5">
                  {"от " + customPrice(data.options.minCart)}
                </a>
              </div>
            </div>

            {data?.energy?.weight > 0 && !data?.options?.сompound && (
              <a
                onClick={() => onLoad(data)}
                className="text-muted d-none d-md-block"
              >
                {options?.productWeightDiscrepancy ? "±" : ""}
                {customWeight({
                  value: data.energy.weight,
                  type: data.energy?.weightType,
                })}
              </a>
            )}

            <ButtonCartProductGift
              product={data}
              isValid={data.total >= data.options.minCart}
              onLoad={onLoad}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product" key={keyGenerator(data)}>
      <div
        className={
          (options?.themeProductImage == 1
            ? "product-img rectangle"
            : "product-img") +
          (options?.themeProductImageSize ? " product-img-contain" : "") +
          (Array.isArray(data?.medias) && data?.medias?.length > 1
            ? " no-hover"
            : "")
        }
      >
        <a onClick={() => onLoad(data)}>
          {data?.tags?.length > 0 && (
            <div className="p-2 z-3 position-absolute">
              <Tags data={data.tags} mini />
            </div>
          )}

          {Array.isArray(data?.medias) && data?.medias?.length > 1 ? (
            <div
              onMouseLeave={() => setActiveIndex(0)}
              onMouseMove={(e) =>
                data?.medias?.length <= 2 && setActiveIndex(1)
              }
            >
              {sortMain(data?.medias).map((e, index) => (
                <LazyLoadImage
                  draggable="false"
                  className={activeIndex === index ? "show" : "hide"}
                  src={getImageURL({
                    path: e.media,
                  })}
                  alt={data.title}
                  loading="lazy"
                  effect="blur"
                />
              ))}
              {Array.isArray(data?.medias) && data?.medias?.length > 2 && (
                <div className="pagination-mouse">
                  {data.medias.map((e, index) => (
                    <div
                      key={index}
                      className={
                        "pagination-mouse-item " +
                        (activeIndex === index
                          ? "pagination-mouse-item-active"
                          : "")
                      }
                      onMouseMove={(e) => setActiveIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <LazyLoadImage
              wrapperClassName="d-flex"
              src={getImageURL({ path: data?.medias })}
              alt={data.title}
              loading="lazy"
              effect="blur"
            />
          )}
        </a>
      </div>
      <a onClick={() => onLoad(data)}>
        <h6 className={"title" + (data?.options?.subtitle ? " fs-09" : "")}>
          {data.title}
          {data?.options?.subtitle ? (
            <div className="subtitle fw-5">{data.options.subtitle}</div>
          ) : (
            ""
          )}
        </h6>
        {data?.description &&
          (options?.themeProductDesc ? (
            <p className="desc desc-full d-none d-md-block fs-09">
              {data.description}
            </p>
          ) : (
            <p className="desc d-none d-md-block fs-09">{data.description}</p>
          ))}
      </a>
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
                      {options?.productWeightDiscrepancy ? "±" : ""}
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
            <a className="fw-5 text-decoration-underline">Состав</a>
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
                        {options?.productWeightDiscrepancy ? "±" : ""}
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
              <a className="fw-5 text-decoration-underline">Состав</a>
            </OverlayTrigger>
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <a onClick={() => onLoad(data)} className="price fw-5">
              {modifiers?.length > 1 && Array.isArray(modifiers)
                ? "от " + customPrice(price > 0 ? price : data.price)
                : customPrice(price > 0 ? price : data.price)}
            </a>
          </div>
        </div>
        {data?.energy?.weight > 0 && !data?.options?.сompound && (
          <a
            onClick={() => onLoad(data)}
            className="text-muted d-none d-md-block"
          >
            {options?.productWeightDiscrepancy ? "±" : ""}
            {customWeight({
              value: data.energy.weight,
              type: data.energy?.weightType,
            })}
          </a>
        )}
        <div>
          <ButtonCartProductMini product={data} onLoad={onLoad} />
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
