import React, { memo } from "react";
import { Link } from "react-router-dom";
import { getImageURL } from "../../helpers/all";

const WidgetHello = memo((data) => {
  return (
    <section
      className="hello mb-6"
      style={
        data.media && {
          backgroundImage: `url(${getImageURL({
            path: data.media,
            type: "all/web/hello",
            size: "full",
          })})`,
        }
      }
    >
      <div className="hello-box">
        <h1 className="mb-4">{data.title}</h1>
        {data?.desc && <p>{data.desc}</p>}
        {data?.btnText && data?.btnLink && (
          <div className="d-flex mt-5 justify-content-center">
            <Link className="btn btn-40-light" to={data.btnLink}>
              {data.btnText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
});

export default WidgetHello;
