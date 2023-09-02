import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OfferProduct from '../components/OfferProduct';

const OfferPage = () => {
  return (
    <main>
      <section className='sec-6 pt-4 pt-lg-0 mb-5'>
        <Container>
          <Row className='flex-row flex-lg-row-reverse gx-4 gx-xxl-5'>
            <Col xs={12} md={6} lg={4} className='mb-4'>
              <figure className='offer full'>
                <img src="imgs/offers/offer4.jpg" alt="Акция «Счастливые часы»"/>
                <figcaption>
                  <div>
                    <h4>Счастливые часы</h4>
                    <h6 className='fw-4'>Скидка 20% на весь ассортимент японской кухни*</h6>
                  </div>
                </figcaption>
              </figure>
            </Col>
            <Col xs={12} lg={8}>
              <h1>Акция «Счастливые часы»</h1>
              <div className="box mb-5">
                <p>Специальная цена на определённые позиции из ассортимента японской кухни</p>
                <p>Акция действует на заказы оформленные на доставку, в зале и на самовывоз в период с понедельника по четверг, с 13:00 до 15:00.</p>
                <p>Не суммируется с другими акциями.Не действует в выходные, праздничные и предпраздничные дни.</p>
              </div>

              <h2>Товары, участвующие в акции</h2>
              <ul className='list-unstyled offer-products-list'>
                <li><OfferProduct/></li>
                <li><OfferProduct/></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default OfferPage;