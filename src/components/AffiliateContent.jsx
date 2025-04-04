import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getImageURL } from "../helpers/all";
import { useSelector } from "react-redux";
import moment from "moment";
import { isWork } from "../hooks/all";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import TelegramLine from "./svgs/TelegramLine";
import WhatsAppLine from "./svgs/WhatsAppLine";

const AffiliateContent = memo(({ affiliate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section >
      <Container>
        <div className="affiliate-content">
          <div className="content">
            <div className="topic">
              <div className="title">{affiliate?.title}</div>
              <div className="social-content">
                <Link to="/" >
                  <WhatsAppLine />
                </Link>
                <Link to="/" className="me-2">
                  <TelegramLine />
                </Link>

                <Link className="btn-greenBoard">Карта</Link>
              </div>
            </div>
            {affiliate.status === 0 ? (
              <div className="time">
                <span className="text-danger">
                  {t("Сейчас закрыто")}
                </span>
              </div>
            ) : affiliate?.options?.work &&
            affiliate?.options?.work[moment().weekday()].start &&
            affiliate?.options?.work[moment().weekday()].end && (
              isWork(
                affiliate?.options?.work[moment().weekday()].start,
                affiliate?.options?.work[moment().weekday()].end
              ) ? (
                <div className="time">
                  <span >
                    {t("Работаем c")}{" "}
                    {affiliate?.options?.work[moment().weekday()].start}{" "}
                    {t("до")}{" "}
                    {affiliate?.options?.work[moment().weekday()].end}
                  </span>
                </div>
              ) : (
                <div className="time">
                  <span className="text-danger">
                    {t("Сейчас закрыто")}
                  </span>
                </div>
              ))}
            {affiliate?.phone && <p className="phone">{affiliate.phone}</p>}
            {affiliate?.desc && <p className="desc">{affiliate.desc}</p>}
            <div className="buttons">
              <Link className="btn-greenFill w-100">Забронировать столик</Link>
              <Link className="btn-greenBoard w-100" onClick={() => navigate(`/catalog/${affiliate.id}`)}>Заказать доставку</Link>
            </div>


          </div>
          {affiliate?.media && (
            <div className="images">
              <img
                src={getImageURL({
                  path: affiliate?.media,
                  type: "affiliate",
                  size: "full",
                })}
                alt={affiliate?.title}
              />
              <img
                src={getImageURL({
                  path: affiliate?.media,
                  type: "affiliate",
                  size: "full",
                })}
                alt={affiliate?.title}
              />
            </div>
          )}

        </div>
      </Container>
    </section>
  );
});

export default AffiliateContent;
