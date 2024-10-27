import React from "react";
import { HiChevronRight } from "react-icons/hi2";
import { BsExclamationLg } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const LiNotification = ({ data }) => {
  const { t } = useTranslation();
  return (
    <li>
      <div className="info">
        {data?.title && (
          <h6>
            <BsExclamationLg className="NB d-md-none" />
            {data.status === 1 && (
              <span className="NB d-none d-md-inline">{t("Новое")}</span>
            )}
            {data.title}
          </h6>
        )}
        {data?.desc && <p>{data.desc}</p>}
      </div>
      {data.createdAt && (
        <div className="date">
          {moment(data.createdAt).format("DD MMM YYYY kk:mm")}
        </div>
      )}
      {data?.orderId && (
        <div className="links">
          <Link
            to={"/account/orders/" + data.orderId}
            className="btn-6 d-flex align-items-center px-2 py-1"
          >
            <span>Перейти</span>
            <HiChevronRight />
          </Link>
        </div>
      )}
    </li>
  );
};

export default LiNotification;
