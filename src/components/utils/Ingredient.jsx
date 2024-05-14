import React, { memo } from "react";
import { customPrice, getImageURL } from "../../helpers/all";

const Ingredient = memo(({ data, active, onChange }) => {
  const addition = data;

  if (!addition) {
    return null;
  }

  return (
    <a
      className={"ingredient" + (active ? " active" : "")}
      onClick={() => onChange(addition)}
    >
      <img
        src={getImageURL({ path: addition?.media, type: "addition" })}
        alt={addition?.title}
        className="ingredient-img"
      />

      <div className="ingredient-title">{addition?.title}</div>
      {addition?.price > 0 && (
        <div className="ingredient-price">{customPrice(addition.price)}</div>
      )}
    </a>
  );
});

export default Ingredient;
