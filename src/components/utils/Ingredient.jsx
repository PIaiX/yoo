import React, { memo } from "react";
import { customPrice, getImageURL } from "../../helpers/all";

const Ingredient = memo(({ data }) => {
  return (
    <div className="ingredient">
      {data?.media && (
        <img
          src={getImageURL({ path: data.media })}
          alt={data?.title}
          className="ingredient-img"
        />
      )}
      <div className="ingredient-title">{data?.title}</div>
      <button type="button" className="btn-90">
        x1
      </button>
      <button type="button" className="btn-90">
        x2
      </button>
      <div className="ingredient-price">{customPrice(data.price)}</div>
    </div>
  );
});

export default Ingredient;
