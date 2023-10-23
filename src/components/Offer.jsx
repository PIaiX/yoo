import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { getImageURL } from "../helpers/all";

const Offer = ({ data }) => {
  return (
    <figure className="offer">
      {data?.medias && (
        <LazyLoadImage
          src={getImageURL({
            path: data.medias,
            type: "sale",
            size: "full",
          })}
          alt={data?.title}
          loading="lazy"
        />
      )}
      <figcaption>
        <Link
          to={
            data?.options?.link
              ? data.options.link
              : data?.id
              ? "/promo/" + data.id
              : ""
          }
          className="btn-light"
        >
          Заказать
        </Link>
      </figcaption>
    </figure>
  );
};

export default Offer;
