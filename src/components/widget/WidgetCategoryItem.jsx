import React, { memo } from "react";
import { Link } from "react-router-dom";
import { getImageURL } from "../../helpers/all";

const WidgetCategoryItem = memo(({ data }) => {
  const image = getImageURL({ path: data.media, type: "category" });
  return (
    <figure className="category-card">
      {image && <img src={image} alt={data.title} />}
      <figcaption>
        <h6>
          <Link to={`/category/${data.id}`} className="stretched-link">
            {data.title}
          </Link>
        </h6>
      </figcaption>
    </figure>
  );
});

export default WidgetCategoryItem;
