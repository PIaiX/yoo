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
import { AffiliateOne } from "../helpers/data";

const AffiliateContent = memo(({ affiliate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const data = AffiliateOne(affiliate.id)
  return (
    <section >
      <Container>
        <div className="affiliate-content">
          <div className="content">
            <div className="topic">
              <div className="title">{affiliate?.title}</div>
              <div className="social-content">
                {/* <Link
                  to={data?.whatsappLink}
                  className="me-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppLine />
                </Link> */}
                <Link
                  to={data?.telegramLink}
                  className="me-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TelegramLine />
                </Link>

                {/* <Link className="btn-greenBoard">Карта</Link> */}
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
              <Link
                to={data?.telegramLink}
                className="btn-greenFill w-100"
                target="_blank"
                rel="noopener noreferrer"
              >Забронировать столик</Link>
              <Link className="btn-greenBoard w-100" onClick={() => navigate(`/catalog/${affiliate.id}`)}>Заказать доставку</Link>
            </div>


          </div>
          {data?.images && (
            <div className="images">
              {data?.images.map(item =>
                <img
                  src={item}
                  alt={affiliate?.title}
                />
              )}

            </div>
          )}

        </div>
      </Container>
    </section>
  );
});

export default AffiliateContent;
