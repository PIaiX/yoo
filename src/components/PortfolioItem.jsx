import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { getImageURL } from "../helpers/all";

const PortfolioItem = ({ data }) => {
  return (
    <Link to={"/portfolio/" + data.id} className="portfolio-item mb-4">
      <LazyLoadImage
        src={getImageURL({
          path:
            data?.medias?.length > 0
              ? data.medias.filter((e) => e.main)[0]?.media ??
                data.medias[0]?.media
              : false,
          type: "portfolio",
        })}
        loading="lazy"
        effect="blur"
      />
      <div className="portfolio-item-body">
        <Link to={"/portfolio/" + data.id} className="btn-white">
          Перейти
        </Link>
      </div>
    </Link>
  );
};

export default PortfolioItem;
