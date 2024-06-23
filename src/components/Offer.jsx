import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { getImageURL } from "../helpers/all";
import { useTranslation } from "react-i18next";

const Offer = ({ data }) => {
  const { t } = useTranslation();

  return (
    <div className="offer">
      {data?.medias && (
        <Link
          to={
            data?.options?.link
              ? data.options.link
              : data?.id
              ? "/promo/" + data.id
              : ""
          }
        >
          <LazyLoadImage
            src={getImageURL({
              path: data.medias,
              type: "sale",
              size: "full",
            })}
            alt={data?.title}
            loading="lazy"
          />
        </Link>
      )}
      <div className="offer-body">
        <div>
          <Link
            to={
              data?.options?.link
                ? data.options.link
                : data?.id
                ? "/promo/" + data.id
                : ""
            }
          >
            {data?.title && <h5 className="offer-body-title">{data.title}</h5>}
          </Link>
          {/* {data?.desc && (
            <p className="fw-4 text-muted offer-body-desc mb-3">{data.desc}</p>
          )} */}
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
            {t("Перейти")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Offer;
