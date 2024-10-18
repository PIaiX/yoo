import React, { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { customPrice, getImageURL } from "../helpers/all";

const ServiceItem = memo(({ data }) => {
  var price = data.price ?? 0;

  return (
    <div className="product" key={data.id}>
      <div className="product-img">
        <Link to={"/service/" + data.id} state={data}>
          <LazyLoadImage
            wrapperClassName="d-flex"
            src={getImageURL({ path: data?.medias })}
            alt={data.title}
            loading="lazy"
            effect="blur"
          />
        </Link>
      </div>
      <Link to={"/service/" + data.id}>
        <h6 className="text-center text-md-start">{data.title}</h6>
      </Link>
      <Link
        to={"/service/" + data.id}
        className="d-flex justify-content-between align-items-center"
      >
        {price > 0 && <div className="fs-11">{customPrice(price)}</div>}
        {/* <div>
          <Link to={"/project/" + data.id} className="btn btn-sm btn-primary">
            Подробнее
          </Link>
        </div> */}
      </Link>
    </div>
  );
});

export default ServiceItem;
