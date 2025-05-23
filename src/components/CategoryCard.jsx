import React, { memo } from "react";
import { Link } from "react-router-dom";
import { getImageURL } from "../helpers/all";

const CategoryCard = memo(({ data }) => {
  const image = data?.media
    ? getImageURL({ path: data.media, type: "category" })
    : false;
  return (
    <figure className="category-card">
      {image && <img draggable="false" src={image} alt={data.title} />}
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

export default CategoryCard;
