import moment from "moment";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Element } from "react-scroll";

const Message = memo(({ onAnswer, onDelete, ...item }) => {
  let user = useSelector((state) => state.auth.user);
  let time = item?.createdAt
    ? moment(item.createdAt).format("DD MMMM YYYY kk:mm")
    : moment().format("DD MMMM YYYY kk:mm");

  return user?.id === item?.userId ? (
    <Element
      key={item.id}
      name={item.id}
      className="message yes-select d-flex flex-column align-self-end justify-content-end mb-3 mb-3"
    >
      <div className="text my">
        <div className="d-flex align-items-center justify-content-between">
          {item?.user?.firstName && (
            <div>
              <a className="fw-7">{item.user.firstName}</a>
            </div>
          )}
        </div>
        <p className="mb-0 fs-09">{item.text}</p>
        <div>
          <time className="fs-07 text-muted">{time}</time>
        </div>
      </div>
    </Element>
  ) : (
    <Element
      key={item.id}
      name={item.id}
      className="message yes-select d-flex flex-row align-self-start justify-content-start mb-3"
    >
      <div className="text">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <a className="fw-7">{item?.user?.firstName ?? null}</a>
          </div>
        </div>
        <p className="mb-0 fs-09">{item.text}</p>
        <div>
          <time className="fs-07 text-muted">{time}</time>
        </div>
      </div>
    </Element>
  );
});

export default Message;
