import React, { memo } from "react";
import { Link } from "react-router-dom";
import { getImageURL } from "../helpers/all";

const ArticleCard = memo(({ data }) => {
  const image = getImageURL({
    path: data.media,
    type: "blog",
  });
  return (
    <figure className="article-card">
      <Link to={"/blog/" + data.id}>
        {data?.media && (
          <img src={image} alt={data.title} width="100%" className="mb-3" />
        )}
        <figcaption>{data.title}</figcaption>
      </Link>
    </figure>
  );
});

export default ArticleCard;
