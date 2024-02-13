import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { YMaps, Map, Placemark, Polygon } from "@pbe/react-yandex-maps";
import { useSelector } from "react-redux";
import EmptyWork from "../components/empty/work";
import Empty from "../components/Empty";
import { customPrice } from "../helpers/all";
import moment from "moment";

const Contact = () => {
  const affiliate = useSelector((state) => state.affiliate.items);
  const colors = ["#f56057", "#007aff", "#222222"];
  const zones = useSelector((state) => state.affiliate.zones);

  const [mainAffiliate, setMainAffiliate] = useState(
    affiliate?.length > 0 ? affiliate.find((e) => e.main) : false
  );

  if (!mainAffiliate || !mainAffiliate?.phone?.length > 0) {
    return (
      <Empty
        text="В данный момент контактов нет"
        desc="Вернитесь на эту страницу чуть позже"
        image={() => <EmptyWork />}
        button={
          <a
            className="btn-primary"
            onClick={() => {
              location.reload();
              return false;
            }}
          >
            Обновить страницу
          </a>
        }
      />
    );
  }

  return (
    <main>
      <section className="sec-7 mb-5">
        <Container>
          <Row>
            <Col md={4}>
              <div className="box">
                <div className="d-flex align-items-baseline mb-5">
                  <h1 className="mb-0">Контакты </h1>
                  <h5 className="mb-0">
                    <span className="mx-3">•</span>
                    {mainAffiliate.options.city}
                  </h5>
                </div>

                <h6 className="mb-3">{mainAffiliate.full}</h6>
                {mainAffiliate?.phone[0] && (
                  <>
                    <p className="mb-3">
                      <a
                        href={"tel:" + mainAffiliate.phone[0]}
                        className="d-flex"
                      >
                        <HiOutlineDevicePhoneMobile className="fs-15 main-color" />
                        <span className="fs-11 ms-2 main-color">
                          Горячая линия
                        </span>
                        <span className="fs-11 ms-2">
                          {mainAffiliate.phone[0]}
                        </span>
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
                )}

                <ul className="list-unstyled mt-4">
                  {affiliate.map((e) => (
                    <li>
                      <a onClick={() => setMainAffiliate(e)}>
                        <h6 className="mb-2">{e.full}</h6>
                        <p className="main-color mt-2 mb-1">
                          Доставка и самовывоз
                        </p>
                        <p className="mb-3">
                          {e?.options?.work &&
                          e.options.work[moment().weekday()]?.start &&
                          e.options.work[moment().weekday()]?.end
                            ? `Работает с ${
                                e.options.work[moment().weekday()].start
                              } до ${e.options.work[moment().weekday()].end}`
                            : ""}
                        </p>

                        {e?.phone[0] && (
                          <>
                            <p className="main-color mt-2 mb-1">
                              Номер телефона
                            </p>
                            <p className="mb-3">{e.phone[0]}</p>
                          </>
                        )}
                      </a>
                      {e?.desc && <p className="white-space-break">{e.desc}</p>}
                    </li>
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
                            options={{
                              iconLayout: "default#image",
                              iconImageHref: "imgs/marker.png",
                              iconImageSize: [38, 54],
                            }}
                            geometry={[
                              e.options.coordinates.lat,
                              e.options.coordinates.lon,
                            ]}
                            properties={{
                              balloonContentBody: [
                                "<address className='my-info'>",
                                "<div className='my-info-body'>",
                                `<h6 className='mb-0 fw-6'>${e.full}</h6>`,
                                "</div>",
                                "</address>",
                              ].join(""),
                            }}
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
                              }}
                              properties={{
                                balloonContentBody: [
                                  "<address className='my-info'>",
                                  "<div className='my-info-body'>",
                                  `<h6 className='mb-0 fw-6'>${e.title}</h6>`,
                                  e.desc && `<p>${e.desc}</p>`,
                                  e.minPrice > 0
                                    ? `<p>Минимальная сумма заказа ${customPrice(
                                        e.minPrice
                                      )}</p>`
                                    : "",
                                  e.priceFree > 0
                                    ? `<p>Бесплатная доставка от ${customPrice(
                                        e.priceFree
                                      )}</p>`
                                    : "",
                                  e.price > 0
                                    ? `<p>Стоимость доставки ${customPrice(
                                        e.price
                                      )}</p>`
                                    : "",
                                  e.time > 0
                                    ? `<p>Время доставки от ${e.time} мин</p>`
                                    : "",
                                  "</div>",
                                  "</address>",
                                ].join(""),
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
