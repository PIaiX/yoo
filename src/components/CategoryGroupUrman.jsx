import React, { memo } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CategoryGroupUrman = memo(({
  data,
  onLoad,
  limit,
  hideTitle = false,
  affiliateId
}) => {
  const priceAffiliateType = useSelector(
    (state) => state.settings?.options?.brand?.options?.priceAffiliateType
  );
  const navigate = useNavigate();
  const products =
    priceAffiliateType && data?.products?.items?.length > 0
      ? data.products.items
        .filter((e) => e?.productOptions?.length > 0)
        .sort((a, b) => a.priority - b.priority)
      : priceAffiliateType && data?.products?.length > 0
        ? data.products
          .filter((e) => e?.productOptions?.length > 0)
          .sort((a, b) => a.priority - b.priority)
        : priceAffiliateType
          ? []
          : data?.products?.items ?? data?.products;

  const displayedProducts = limit ? products?.slice(0, limit) : products;

  return (
    <section className="CategoryGroup" id={"category-" + data?.id}>
      {!hideTitle && data?.title && (
        // <div className="filterGrid mb-5">
        //   <h4 className="d-block fw-6 mb-0 urman-dark-green">{data.title}</h4>
        // </div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-6 urman-dark-green m-0">{data.title}</h4>
          <button
            key={data.id}
            onClick={() => navigate(`/catalog/${affiliateId}#category=${data.id}`)}
            className="btn-greenFill"
          >
            Посмотреть все
          </button>
        </div>
      )}
      {displayedProducts?.length > 0 && (
        <ul className="list-unstyled row gx-4 gx-xl-5 gy-5">
          {displayedProducts.map((e, index) => (
            <li key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard data={e} onLoad={onLoad} affiliateId={affiliateId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

export default CategoryGroupUrman;