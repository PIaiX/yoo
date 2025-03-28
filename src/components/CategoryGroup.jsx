import React, { memo } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

const CategoryGroup = memo(({ data, onLoad }) => {
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
          <h4 className="d-block fw-6 mb-0">{data.title}</h4>
        </div>
      )}
      {products?.length > 0 && (
        <ul className="list-unstyled row row-cols-2 row-cols-sm-3 row-cols-lg-4 gx-4 gx-xl-5 gy-5">
          {products.map((e, index) => (
            <li key={index}>
              <ProductCard data={e} onLoad={onLoad} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});

export default CategoryGroup;
