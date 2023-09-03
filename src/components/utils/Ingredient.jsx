import React, { memo } from "react";
import { customPrice, getImageURL } from "../../helpers/all";

const Ingredient = memo(({ data, active, onChange }) => {
  const addition = data?.addition;

  if (!addition) {
    return null;
  }

  return (
    <a
      className={"ingredient" + (active ? " active" : "")}
      onClick={() => onChange(addition)}
    >
      {addition?.media && (
        <img
          src={getImageURL({ path: addition.media })}
          alt={addition?.title}
          className="ingredient-img"
        />
      )}
      <div className="ingredient-title">{addition?.title}</div>
      {/* <button type="button" className="btn-90">
        x1
      </button>
      <button type="button" className="btn-90">
        x2
      </button> */}
      <div className="ingredient-price">{customPrice(addition.price)}</div>
    </a>
  );
});

export default Ingredient;
