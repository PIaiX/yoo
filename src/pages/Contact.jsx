import { Map, Placemark, Polygon, YMaps } from "@pbe/react-yandex-maps";
import moment from "moment-timezone";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Empty from "../components/Empty";
import EmptyWork from "../components/empty/work";
import Meta from "../components/Meta";
import Loader from "../components/utils/Loader";
import { customPrice } from "../helpers/all";

const Contact = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const affiliate = useSelector((state) => state.affiliate.items);
  const zones = useSelector((state) => state.affiliate.zones);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const options = useSelector((state) => state.settings.options);
  const [mainAffiliate, setMainAffiliate] = useState();
  const [showModalOrganization, setModalOrganization] = useState(false);
  const [showModalDelivery, setModalDelivery] = useState(false);

  const mapPoligone = useMemo(() => {
    return (
      <>
        {affiliate?.length > 0 &&
          affiliate.map(
            (e) =>
              e?.options?.coordinates?.lat &&
              e?.options?.coordinates?.lon && (
                <Placemark
                  key={e.id}
                  options={
                    mainAffiliate?.id === e.id
                      ? {
                          iconLayout: "default#image",
                          iconImageHref: "imgs/marker.png",
                          iconImageSize: [38, 54],
                        }
                      : {
                          iconLayout: "default#image",
                          iconImageHref: "imgs/marker-gray.png",
                          iconImageSize: [38, 54],
                        }
                  }
                  geometry={[
                    e.options.coordinates.lat,
                    e.options.coordinates.lon,
                  ]}
                />
              )
          )}

        {zones?.length > 0 &&
          zones.map((e) => {
            const geodata =
              e.data.length > 0 ? e.data.map((geo) => [geo[1], geo[0]]) : false;

            return (
              <Polygon
                key={e.id}
                defaultGeometry={[geodata]}
                options={{
                  fillColor: e?.color ? e.color : "#f56057",
                  strokeColor: e?.color ? e.color : "#f56057",
                  opacity: 0.3,
                  strokeWidth: 2,
                  strokeStyle: "solid",
                  visible: true,
                }}
                properties={{
                  balloonContent: `<address class='my-info'>
        <div class='my-info-body'>
        <h6 class='mb-0 fw-6'>${e.title}</h6>
        ${e.desc ? `<p>${e.desc}</p>` : ""}
        ${
          e.minPrice > 0
            ? `<p>${t("Минимальная сумма заказа")} ${customPrice(
                e.minPrice
              )}</p>`
            : ""
        }
        ${
          e.priceFree > 0
            ? `<p>${t("Бесплатная доставка от")} ${customPrice(
                e.priceFree
              )}</p>`
            : ""
        }
        ${
          e.price > 0
            ? `<p>${t("Стоимость доставки")} ${customPrice(e.price)}</p>`
            : ""
        }
        ${
          e.time > 0
            ? `<p>${t("Время доставки от")} ${e.time} ${t("мин")}</p>`
            : ""
        }
        </div>
        </address>`,
                }}
              />
            );
          })}
      </>
    );
  }, [zones, affiliate, mainAffiliate]);

  useLayoutEffect(() => {
    setMainAffiliate(
      affiliate?.length > 0
        ? affiliate.find((e) => e.main) ?? affiliate[0]
        : affiliate[0] ?? false
    );
  }, [selectedAffiliate]);

  if (!mainAffiliate) {
    return (
      <>
        <Meta
          title={
            options?.seo?.contact?.title
              ? options.seo.contact.title
              : selectedAffiliate?.title
              ? selectedAffiliate?.title + " - Контакты"
              : options?.title
              ? options.title + " - Контакты"
              : t("Контакты")
          }
          description={
            options?.seo?.contact?.description
              ? options.seo.contact.description
              : t(
                  "Хотите связаться с нами? Найдите все необходимые контактные данные, чтобы задать вопрос или оставить отзыв о нашей службе доставки еды."
                )
          }
        />
        <Empty
          text={t("В данный момент контактов нет")}
          desc={t("Вернитесь на эту страницу чуть позже")}
          image={() => <EmptyWork />}
          button={
            <a
              className="btn-primary"
              onClick={() => {
                location.reload();
                return false;
              }}
            >
              {t("Обновить страницу")}
            </a>
          }
        />
      </>
    );
  }

  return (
    <main>
      <Meta
        title={
          options?.seo?.contact?.title
            ? options.seo.contact.title
            : selectedAffiliate?.title
            ? selectedAffiliate?.title + " - Контакты"
            : options?.title
            ? options.title + " - Контакты"
            : t("Контакты")
        }
        description={
          options?.seo?.contact?.description
            ? options.seo.contact.description
            : t(
                "Хотите связаться с нами? Найдите все необходимые контактные данные, чтобы задать вопрос или оставить отзыв о нашей службе доставки еды."
              )
        }
      />
      <section className="sec-7 mb-5">
        <Container>
          <Row>
            <Col md={4}>
              <div className="box">
                <div className="d-flex align-items-baseline mb-3">
                  <h1 className="mb-0 h4 fw-6">{t("Контакты")}</h1>
                </div>
                <ul className="list-unstyled pe-3">
                  {affiliate.map((e) => (
                    <a
                      key={e.id}
                      onClick={() => setMainAffiliate(e)}
                      className={mainAffiliate.id === e.id ? "active" : ""}
                    >
                      <li>
                        <h6>{e.full}</h6>
                        {e?.options?.work?.length > 0 &&
                        e.options.work[moment().weekday()]?.start &&
                        e.options.work[moment().weekday()]?.end ? (
                          <>
                            <p className="mt-2">{`${t("Работает с")} ${
                              e.options.work[moment().weekday()].start
                            } ${t("до")} ${
                              e.options.work[moment().weekday()].end
                            }`}</p>
                          </>
                        ) : null}

                        {e?.phone && e?.phone[0] && (
                          <p className="mt-2 mt-0 fw-5">{e.phone[0]}</p>
                        )}

                        {e?.desc && (
                          <p className="white-space-break m-0 mt-2 fs-08">
                            {e.desc.trim()}
                          </p>
                        )}
                      </li>
                    </a>
                  ))}
                </ul>
                {mainAffiliate?.options?.organization && (
                  <div className="d-flex justify-content-center text-center pt-3">
                    <a
                      className="btn btn-light w-100 fw-6 fs-09"
                      onClick={() => setModalOrganization(true)}
                    >
                      Юридическое лицо
                    </a>
                  </div>
                )}
                {mainAffiliate?.options?.delivery && (
                  <div className="d-flex justify-content-center text-center pt-2">
                    <a
                      className="btn btn-light fw-6 w-100 fs-09"
                      onClick={() => setModalDelivery(true)}
                    >
                      Условия доставки
                    </a>
                  </div>
                )}
              </div>
            </Col>
            <Col md={8}>
              <div className="map">
                {loading && <Loader />}
                {mainAffiliate?.options?.coordinates?.lat &&
                  mainAffiliate?.options?.coordinates?.lon && (
                    <YMaps>
                      <Map
                        onLoad={() => setLoading(false)}
                        state={{
                          center: [
                            mainAffiliate.options.coordinates.lat,
                            mainAffiliate.options.coordinates.lon,
                          ],
                          zoom: 12,
                        }}
                        width="100%"
                        height="100%"
                        modules={["geoObject.addon.balloon"]}
                      >
                        {mapPoligone}
                      </Map>
                    </YMaps>
                  )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Modal
        centered
        show={showModalOrganization}
        onHide={() => setModalOrganization(false)}
      >
        <Modal.Header closeButton className="fw-6 h5">
          {t("Информация")}
        </Modal.Header>
        <Modal.Body className="p-4">
          {mainAffiliate?.options?.organization &&
            mainAffiliate.options.organization}
        </Modal.Body>
      </Modal>
      <Modal
        centered
        show={showModalDelivery}
        onHide={() => setModalDelivery(false)}
      >
        <Modal.Header closeButton className="fw-6 h5">
          {t("Условия доставки")}
        </Modal.Header>
        <Modal.Body className="p-4">
          {mainAffiliate?.options?.delivery && mainAffiliate.options.delivery}
        </Modal.Body>
      </Modal>
    </main>
  );
};

export default Contact;
