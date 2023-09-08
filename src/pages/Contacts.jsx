import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useSelector } from "react-redux";

const Contacts = () => {
  const { affiliate } = useSelector((state) => state);

  const [mainAffiliate, setMainAffiliate] = useState(
    affiliate?.items?.length > 0 ? affiliate.items.find((e) => e.main) : false
  );

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
                <p className="mb-3">
                  <a href={"tel:" + mainAffiliate.phone[0]} className="d-flex">
                    <HiOutlineDevicePhoneMobile className="fs-15 main-color" />
                    <span className="fs-11 ms-2 main-color">Горячая линия</span>
                    <span className="fs-11 ms-2">{mainAffiliate.phone[0]}</span>
                  </a>
                </p>
                <a
                  href={"tel:" + mainAffiliate.phone[0]}
                  type="button"
                  className="btn-primary"
                >
                  Заказать звонок
                </a>

                <ul className="list-unstyled mt-4">
                  {affiliate.items.map((e) => (
                    <li>
                      <a onClick={() => setMainAffiliate(e)}>
                        <h6 className="mb-2">{e.full}</h6>
                        {/* <address className="mb-3">
                      <span className="main-color">•</span> ул. Белинского, 1
                    </address> */}
                        <p className="main-color mt-2 mb-1">
                          Доставка и самовывоз
                        </p>
                        <p>{e.desc}</p>
                        {/* <p className="main-color mt-2 mb-1">Ресторан</p>
                      <p>08:00 — 00:00</p> */}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
            <Col md={8}>
              <YMaps>
                <Map
                  state={{
                    center: [
                      mainAffiliate.options.coordinates.lat,
                      mainAffiliate.options.coordinates.lon,
                    ],
                    zoom: 17,
                  }}
                  width="100%"
                  height="100%"
                >
                  <Placemark
                    geometry={[
                      mainAffiliate.options.coordinates.lat,
                      mainAffiliate.options.coordinates.lon,
                    ]}
                  />
                </Map>
              </YMaps>

              {/* <div className="map">
                <img src="imgs/map.jpg" alt="map" />
              </div> */}
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Contacts;
