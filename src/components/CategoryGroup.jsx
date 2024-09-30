import React, { memo } from "react";
import ProductCard from "./ProductCard";

const CategoryGroup = memo(({ data }) => {
  return (
    <section className="сategoryGroup" id={"category-" + data.id}>
      <div className="filterGrid mb-3">
        <h4 className="d-block fw-7 mb-0">{data.title}</h4>
      </div>
      {data.products.length > 0 ? (
        <ul className="list-unstyled row row-cols-2 row-cols-sm-3 row-cols-lg-4 gx-4 gx-xl-5 gy-5">
          {data.products.map((e) => (
            <li key={e.id}>
              <ProductCard data={e} />
            </li>
          ))}
        </ul>
      ) : (
        data.products.items.length > 0 && (
          <ul className="list-unstyled row row-cols-2 row-cols-sm-3 row-cols-lg-4 gx-4 gx-xl-5 gy-5">
            {data.products.items.map((e) => (
              <li key={e.id}>
                <ProductCard data={e} />
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  );
});

export default CategoryGroup;
