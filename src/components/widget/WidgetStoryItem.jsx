import React, { memo } from "react";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import { getImageURL } from "../../helpers/all";

const Story = memo(({ data, type = "", ...props }) => {
  const image = getImageURL({ path: data.medias, size: "mini", type: "story" });
  return (
    <figure className={"story " + type} onClick={props.onClick}>
      <div className="d-flex w-100 justify-content-center">
        <img src={image} alt={data.title} effect="opacity" />
      </div>
      {data?.title && <figcaption>{data.title}</figcaption>}
    </figure>
  );
});

export default Story;
