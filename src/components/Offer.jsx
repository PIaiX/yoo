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
        <div>
          {data?.title && (
            <h4 className={data?.blackText ? "black" : ""}>{data.title}</h4>
          )}
          {data?.desc && (
            <h6 className={data?.blackText ? "black fw-4" : "fw-4"}>
              {data.desc}
            </h6>
          )}
        </div>
        <Link
          to={
            data?.options?.link
              ? data.options.link
              : data?.id
              ? "/promo/" + data.id
              : ""
          }
          className="btn-white"
        >
          Заказать
        </Link>
      </figcaption>
    </figure>
  );
};

export default Offer;
