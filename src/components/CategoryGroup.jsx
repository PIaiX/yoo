import React, { memo } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

const CategoryGroup = memo(({ data, onLoad, affiliateId }) => {
  const priceAffiliateType = useSelector(
    (state) => state.settings?.options?.brand?.options?.priceAffiliateType
  );
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

  return (
    <section className="CategoryGroup" id={"category-" + data?.id}>
      {data?.title && (
        <div className="filterGrid mb-5">
          <h4 className="d-block fw-6 mb-0 urman-dark-green">{data.title}</h4>
        </div>
      )}
      {products?.length > 0 && (
        <ul className="list-unstyled row gx-4 gx-xl-5 gy-5">
          {products.map((e, index) => (
            <li key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard data={e} onLoad={onLoad} affiliateId={affiliateId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

export default CategoryGroup;
