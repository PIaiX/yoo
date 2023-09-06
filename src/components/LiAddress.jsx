import React, { memo } from "react";
import { HiOutlineMap, HiOutlineTrash } from "react-icons/hi2";
import { Link } from "react-router-dom";

const LiAddress = memo(({ data }) => {
  return (
    <li>
      <div className="d-flex align-items-center">
        <HiOutlineMap className="fs-15 main-color-60 me-3" />
        <div>
          {data?.title ? (
            <>
              <p className="fw-6 fs-09">{data.title}</p>
              <p className="fs-07 text-muted">{data.full}</p>
            </>
          ) : (
            <p className="fw-6">{data?.full}</p>
          )}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-end mt-2 mt-sm-0 ms-sm-4">
        <Link to={"/account/address/" + data.id} className="green fs-09">
          Изменить
        </Link>
        <button type="button" className="dark-gray fs-12 ms-4">
          <HiOutlineTrash />
        </button>
      </div>
    </li>
  );
});

export default LiAddress;
