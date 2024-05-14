import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { customPrice, customWeight, getImageURL } from "../helpers/all";
import ButtonCart from "./ButtonCart";
import Tags from "./Tags";
// import BtnFav from "./utils/BtnFav";

const ProductCard = memo(({ data }) => {
  const themeProductImage = useSelector(
    (state) => state.settings?.options?.themeProductImage
  );
  const modifiersData =
    data?.modifiers?.length > 0
      ? [...data.modifiers]
          .sort((a, b) => a?.price - b?.price)
          .reduce((acc, item) => {
            const categoryId = item.categoryId ?? 0;
            if (!acc[categoryId]) {
              acc[categoryId] = [];
            }
            acc[categoryId].push(item);
            return acc;
          }, [])
      : [];

  var modifiers = [];

  if (modifiersData?.length > 0) {
    modifiersData.forEach((e1) => {
      let is = e1.find((e2) => e2?.main);
      if (is) {
        modifiers.push(is);
      }
    });
  }

  const price =
    modifiers?.length > 0
      ? data.options.modifierPriceSum
        ? modifiers.reduce((sum, item) => sum + item.price, 0) + data.price
        : modifiers.reduce((sum, item) => sum + item.price, 0)
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
        <Link to={"/product/" + data?.id}>
          {data?.tags?.length > 0 && (
            <div className="p-2 position-absolute">
              <Tags data={data.tags} mini />
            </div>
          )}
          <LazyLoadImage
            src={getImageURL({ path: data?.medias })}
            alt={data.title}
            loading="lazy"
          />
        </Link>
      </div>

      <h6 className="title text-center text-md-start">{data.title}</h6>
      <p className="d-none d-md-block text-muted fs-09">{data.description}</p>
      <hr className="d-none d-md-block" />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        {data?.energy?.weight > 0 && (
          <div className="text-muted d-none d-md-block">
            {customWeight({
              value: data.energy.weight,
              type: data.energy?.weightType,
            })}
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center mb-2 mb-md-0">
          <div>
            <div className="fs-12 fw-5">
              {modifiers?.length > 0 && Array.isArray(modifiers)
                ? "от " + customPrice(price > 0 ? price : data.price)
                : customPrice(data.price)}
            </div>
            {/* <div className="gray fs-09 text-decoration-line-through">
              {data?.modifiers?.length > 0
                ? "от " + customPrice(price)
                : customPrice(data.price)}
            </div> */}
          </div>
        </div>
        <ButtonCart product={data} />
      </div>
    </div>
  );
});

export default ProductCard;
