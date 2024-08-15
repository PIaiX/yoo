import React, { memo } from "react";
import { Link } from "react-router-dom";
import { getImageURL } from "../../helpers/all";

const ServiceItem = memo(({ data }) => {
  const image = getImageURL({ path: data.medias, type: "product" });
  return (
    <figure className="category-card">
      <img src={image} alt={data.title} />
      <figcaption>
        <h6>
          <Link to={`/service/${data.id}`} className="stretched-link">
            {data.title}
          </Link>
        </h6>
      </figcaption>
    </figure>
  );
});

export default ServiceItem;
