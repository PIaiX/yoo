import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { YMaps, Map, Placemark, Polygon } from "@pbe/react-yandex-maps";
import { useSelector } from "react-redux";
import EmptyWork from "../components/empty/work";
import Empty from "../components/Empty";
import { customPrice } from "../helpers/all";
import moment from "moment";
import Meta from "../components/Meta";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  const affiliate = useSelector((state) => state.affiliate.items);
  const colors = ["#f56057", "#007aff", "#222222"];
  const zones = useSelector((state) => state.affiliate.zones);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const options = useSelector((state) => state.settings.options);

  const [mainAffiliate, setMainAffiliate] = useState(
    affiliate?.length > 0
      ? affiliate.find((e) => e.main) ?? affiliate[0]
      : affiliate[0] ?? false
  );

  if (!mainAffiliate) {
    return (
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
    );
  }

  return (
    <main>
      <Meta
        title={`${selectedAffiliate?.title ?? options?.title} — ${t(
          "Контакты"
        )}`}
        description={`${selectedAffiliate?.title ?? options?.title} — ${t(
          "Контакты"
        )}`}
      />
      <section className="sec-7 mb-5">
        <Container>
          <Row>
            <Col md={4}>
              <div className="box">
                <div className="d-flex align-items-baseline mb-2">
                  <h1 className="mb-0">{t("Контакты")}</h1>
                </div>

                {/* <h6 className="mb-3">{mainAffiliate.full}</h6> */}
                {/* {mainAffiliate?.phone && mainAffiliate?.phone[0] && (
                  <>
                    <p className="mb-3">
                      <a href={"tel:" + mainAffiliate.phone[0]}>
                        <p className="fs-11 ms-2 main-color">
                          <HiOutlineDevicePhoneMobile className="fs-15 main-color me-1" />
                          <span>Горячая линия</span>
                        </p>
                        <p className="fs-11 ms-2">{mainAffiliate.phone[0]}</p>
                      </a>
                    </p>
                    <p className="mb-3">
                      {mainAffiliate?.options?.work &&
                      mainAffiliate.options.work[moment().weekday()]?.start &&
                      mainAffiliate.options.work[moment().weekday()]?.end
                        ? `Работает с ${
                            mainAffiliate.options.work[moment().weekday()].start
                          } до ${
                            mainAffiliate.options.work[moment().weekday()].end
                          }`
                        : ""}
                    </p>
                    <a
                      href={"tel:" + mainAffiliate.phone[0]}
                      type="button"
                      className="btn-primary"
                    >
                      Позвонить
                    </a>
                  </>
                )} */}

                <ul className="list-unstyled">
                  {affiliate.map((e) => (
                    <a
                      onClick={() => setMainAffiliate(e)}
                      className={mainAffiliate.id === e.id ? "active" : ""}
                    >
                      <li key={e.id}>
                        <h6 className="mb-2">{e.full}</h6>
                        {e?.options?.work?.length > 0 &&
                        e.options.work[moment().weekday()]?.start &&
                        e.options.work[moment().weekday()]?.end ? (
                          <>
                            <p className="main-color m-0">
                              {t("Доставка и самовывоз")}
                            </p>
                            <p className="mb-2">{`${t('Работает с')} ${
                              e.options.work[moment().weekday()].start
                            } ${t('до')} ${e.options.work[moment().weekday()].end}`}</p>
                          </>
                        ) : null}

                        {e?.phone && e?.phone[0] && (
                          <p className="mb-2 mt-0 fw-5">{e.phone[0]}</p>
                        )}

                        {e?.desc && (
                          <p className="white-space-break m-0 fs-08 text-muted">
                            {e.desc}
                          </p>
                        )}
                      </li>
                    </a>
                  ))}
                </ul>
              </div>
            </Col>
            <Col md={8}>
              {mainAffiliate?.options?.coordinates?.lat &&
                mainAffiliate?.options?.coordinates?.lon && (
                  <YMaps>
                    <Map
                      className="map"
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
                      {affiliate?.length > 0 &&
                        affiliate.map((e) => (
                          <Placemark
                            options={
                              mainAffiliate.id === e.id
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
                        ))}

                      {zones?.length > 0 &&
                        zones.map((e) => {
                          const geodata =
                            e.data.length > 0
                              ? e.data.map((geo) => [geo[1], geo[0]])
                              : false;

                          let color =
                            affiliate.findIndex(
                              (a) => a.id === e.affiliateId
                            ) ?? 0;

                          return (
                            <Polygon
                              defaultGeometry={[geodata]}
                              options={{
                                fillColor: colors[color],
                                strokeColor: colors[color],
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
                                  ? `<p>${t('Минимальная сумма заказа')} ${customPrice(
                                      e.minPrice
                                    )}</p>`
                                  : ""
                              }
                              ${
                                e.priceFree > 0
                                  ? `<p>${t('Бесплатная доставка от')} ${customPrice(
                                      e.priceFree
                                    )}</p>`
                                  : ""
                              }
                              ${
                                e.price > 0
                                  ? `<p>${t('Стоимость доставки')} ${customPrice(
                                      e.price
                                    )}</p>`
                                  : ""
                              }
                              ${
                                e.time > 0
                                  ? `<p>${t('Время доставки от')} ${e.time} ${t('мин')}</p>`
                                  : ""
                              }
                              </div>
                              </address>`,
                              }}
                            />
                          );
                        })}
                    </Map>
                  </YMaps>
                )}
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Contact;
