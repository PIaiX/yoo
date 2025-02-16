import moment from "moment";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Element } from "react-scroll";
import { getImageURL } from "../../helpers/all";
import { Dropdown } from "react-bootstrap";
import { IoChevronDownOutline } from "react-icons/io5";

const Message = memo(({ support = false, onAnswer, onDelete, ...item }) => {
  const { t } = useTranslation();
  let user = useSelector((state) => state.auth.user);
  let time = item?.createdAt
    ? moment(item.createdAt).format("DD MMMM YYYY kk:mm")
    : moment().format("DD MMMM YYYY kk:mm");
  let image = getImageURL({ path: item?.user, type: "user", size: "mini" });

  const CustomToggle = React.forwardRef(({ onClick }, ref) => {
    return (
      <a
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <IoChevronDownOutline size={18} />
      </a>
    );
  });

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
          {!support && (
            <div>
              <Dropdown drop="end">
                <Dropdown.Toggle as={CustomToggle} />
                <Dropdown.Menu variant="dark">
                  <Dropdown.Item disabled>Редактировать</Dropdown.Item>
                  <Dropdown.Item
                    disabled
                    className="text-danger"
                    onClick={() => onDelete(item)}
                  >
                    Удалить
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>
        <p className="mb-0 fs-09">{item.text}</p>
        <div>
          <time className="fs-07 text-muted">{time}</time>
        </div>
      </div>
      {!support && (
        <div className="ps-3">
          <img src={image} className="avatar" />
        </div>
      )}
    </Element>
  ) : (
    <Element
      key={item.id}
      name={item.id}
      className="message yes-select d-flex flex-row align-self-start justify-content-start mb-3"
    >
      {!support && (
        <div className="pe-3">
          <img src={image} className="avatar" />
        </div>
      )}
      <div className="text">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <a className="fw-7">
              {item?.user?.firstName ?? null}
            </a>
          </div>
        </div>
        <p className="mb-0 fs-09">{item.text}</p>
        <div>
          <time className="fs-07 text-muted">{time}</time>
          {!support && (
            <a onClick={() => onAnswer(item)} className="ms-2 fs-07 text-muted">
              {t("Ответить")}
            </a>
          )}
        </div>
      </div>
    </Element>
  );
});

export default Message;
