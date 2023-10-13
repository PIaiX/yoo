import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";

const Contacts = () => {
  return (
    <main>
      <section className="sec-7 pt-4 mb-5">
        <Container>
          <Row>
            <Col lg={4}>
              <div className="box">
                <h1 className='mb-4'>Контакты</h1>

                <h6 className='mb-3'>ООО “Вкусные решения”</h6>
                <p className='mb-3'>
                  <a href="tel:+7987987-78-78" className='d-flex'>
                    <HiOutlineDevicePhoneMobile className='fs-15 secondary'/>
                    <span className='fs-11 ms-2 secondary'>Горячая линия</span>
                    <span className='fs-11 ms-2'>+7 987 987-78-78</span>
                  </a>
                </p>
                <button type='button' className='btn-primary'>Заказать звонок</button>
                
                <ul className='list-unstyled mt-2 mt-md-4'>
                  <li>
                    <h6 className='mb-2 mb-sm-4'>Советский район</h6>
                    <address className='mb-2 mb-sm-3'><span className='secondary'>•</span> А. Губкина, 17 </address>
                    <p className='secondary mt-2'>Доставка и самовывоз</p>
                    <p>9:00-21:00 без выходных  </p>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={8}>
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