import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { getImageURL } from "../helpers/all";

const Offer = ({ data }) => {
  return (
    <div className="offer">
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
      <div className="offer-body">
        <div>
          {data?.title && <h5 className="offer-body-title">{data.title}</h5>}
          {data?.desc && (
            <p className="fw-4 text-muted offer-body-desc mb-3">{data.desc}</p>
          )}
        </div>
        <div className="d-flex justify-content-end">
          <Link
            to={
              data?.options?.link
                ? data.options.link
                : data?.id
                ? "/promo/" + data.id
                : ""
            }
            className="btn btn-light"
          >
            Перейти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Offer;
