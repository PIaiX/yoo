import React, { memo } from "react";
import { Link } from "react-router-dom";

const WidgetText = memo((data) => {
  return (
    <section className="mb-4">
      {data.title ? <h1 className="mb-4 text-center">{data.title}</h1> : ""}
      {data?.desc && (
        <p className="white-space fs-12 text-center">{data.desc}</p>
      )}
      {data?.btnText && data?.btnLink && (
        <div className="d-flex mt-4 justify-content-center">
          <Link className="btn btn-40-light" to={data.btnLink}>
            {data.btnText}
          </Link>
        </div>
      )}
    </section>
  );
});

export default WidgetText;
