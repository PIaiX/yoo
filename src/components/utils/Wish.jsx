import React, { memo } from "react";
import { customPrice } from "../../helpers/all";

const Wish = memo(({ data, active, onChange }) => {
  const wish = data;

  if (!wish) {
    return null;
  }

  return (
    <a
      className={"wish" + (active ? " active" : "")}
      onClick={() => onChange(wish)}
    >
      <div className="wish-title">{wish?.title}</div>
      {wish?.price > 0 && (
        <div className="wish-price">{customPrice(wish.price)}</div>
      )}
    </a>
  );
});

export default Wish;
