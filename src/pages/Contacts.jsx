import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";

const Contacts = () => {
  return (
    <main>
      <section className="sec-7 mb-5">
        <Container>
          <Row>
            <Col md={4}>
              <div className="box">
                <div className="d-flex align-items-baseline mb-5">
                  <h1 className='mb-0'>Контакты </h1>
                  <h5 className='mb-0'><span className='mx-3'>•</span>Казань</h5>
                </div>

                <h6 className='mb-3'>ООО “Вкусные решения”</h6>
                <p className='mb-3'>
                  <a href="tel:+7987987-78-78" className='d-flex'>
                    <HiOutlineDevicePhoneMobile className='fs-15 main-color'/>
                    <span className='fs-11 ms-2 main-color'>Горячая линия</span>
                    <span className='fs-11 ms-2'>+7 987 987-78-78</span>
                  </a>
                </p>
                <button type='button' className='btn-primary'>Заказать звонок</button>
                
                <ul className='list-unstyled mt-4'>
                  <li>
                    <h6 className='mb-4'>Авиастроительный</h6>
                    <address className='mb-3'><span className='main-color'>•</span> ул. Белинского, 1</address>
                    <p className='main-color mt-2 mb-1'>Доставка и самовывоз</p>
                    <p>08:00 — 00:00</p>
                    <p className='main-color mt-2 mb-1'>Ресторан</p>
                    <p>08:00 — 00:00</p>
                  </li>
                  <li>
                    <h6 className='mb-4'>Авиастроительный</h6>
                    <address className='mb-3'><span className='main-color'>•</span> ул. Белинского, 1</address>
                    <p className='main-color mt-2 mb-1'>Доставка и самовывоз</p>
                    <p>08:00 — 00:00</p>
                    <p className='main-color mt-2 mb-1'>Ресторан</p>
                    <p>08:00 — 00:00</p>
                  </li>
                </ul>
              </div>
            </Col>
            <Col md={8}>
              <div className="map">
                <img src="/imgs/map.jpg" alt="map" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
    </main>
  );
};

export default Contacts;