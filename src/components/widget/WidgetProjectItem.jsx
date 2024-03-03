import React, { memo } from "react";
import { Link } from "react-router-dom";
import { getImageURL } from "../../helpers/all";

const ProjectItem = memo(({ data }) => {
  const image = getImageURL({
    path: data.medias,
    type: "product",
    size: "full",
  });
  return (
    <figure className="project-card">
      <img src={image} alt={data.title} />
      <figcaption>
        <h6>
          <Link to={`/project/${data.id}`} className="stretched-link">
            {data.title}
          </Link>
        </h6>
      </figcaption>
    </figure>
  );
});

export default ProjectItem;
