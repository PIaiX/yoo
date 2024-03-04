import React from "react";
import { Link } from "react-router-dom";
import { getImageURL } from "../helpers/all";

const ArticlePreview = (item) => {
  return (
    <div className="article-preview">
      <Link to={"/blog/" + item.alias}>
        <img
          src={getImageURL({ path: item.media, size: "mini", type: "blog" })}
          alt={item.title}
        />
      </Link>
      <div className="ms-sm-4 ms-xl-5 flex-1 d-flex flex-column justify-content-between">
        <h5>
          <Link to={"/blog/" + item.alias}>{item.title}</Link>
        </h5>
        <div dangerouslySetInnerHTML={{ __html: item.content }} />
        <Link to={"/blog/" + item.alias} className="btn-primary mt-auto">
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default ArticlePreview;
