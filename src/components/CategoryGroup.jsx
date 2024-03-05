import React, { memo } from "react";
// import {
//   HiOutlineAdjustmentsHorizontal,
//   HiOutlineBars3,
// } from "react-icons/hi2";
// import SelectImitation from "./utils/SelectImitation";
// import SearchForm from "./forms/SearchForm";
import ProductCard from "./ProductCard";

const CategoryGroup = memo(({ data }) => {
  return (
    <section className="CategoryGroup" id={"category-" + data.id}>
      <div className="filterGrid mb-5">
        {/* <div className="filterGrid-search"> */}
        <h4 className=" d-xl-block title mb-0">{data.title}</h4>
        {/* <ul className="subcategories-list">
            <li>
              <button type="button" className="btn-90 rounded-pill">
                Фирменные
              </button>
            </li>
            <li>
              <button type="button" className="btn-90 rounded-pill active">
                Запечённые
              </button>
            </li>
            <li>
              <button type="button" className="btn-90 rounded-pill">
                Классические
              </button>
            </li>
            <li>
              <button type="button" className="btn-90 rounded-pill">
                В темпуре
              </button>
            </li>
          </ul> */}
        {/* <SearchForm /> */}
        {/* </div> */}
        {/* <div className="filterGrid-filter">
          <button type="button" className="btn-filter btn-10">
            <HiOutlineAdjustmentsHorizontal className="fs-15" />
          </button>
          <button type="button" className="d-lg-none btn-10 ms-2 ms-sm-3">
            <HiOutlineBars3 className="fs-15" />
          </button>
        </div> */}
        {/* <div className="filterGrid-sort">
          <SelectImitation
            btnClass={"rounded-pill"}
            imgClass={"round"}
            optionsArr={[
              {
                value: 1,
                label: "По увеличению",
                defaultChecked: true,
              },
              {
                value: 2,
                label: "По уменьшению",
                defaultChecked: false,
              },
            ]}
          />
        </div> */}
      </div>
      {data.products.length > 0 ? (
        <ul className="list-unstyled row row-cols-2 row-cols-sm-3 row-cols-lg-4 gx-4 gx-xl-5 gy-5">
          {data.products.map((e) => (
            <li>
              <ProductCard data={e} />
            </li>
          ))}
        </ul>
      ) : (
        data.products.items.length > 0 && (
          <ul className="list-unstyled row row-cols-2 row-cols-sm-3 row-cols-lg-4 gx-4 gx-xl-5 gy-5">
            {data.products.items.map((e) => (
              <li>
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
