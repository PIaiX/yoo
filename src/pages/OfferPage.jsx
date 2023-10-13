import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OfferProduct from '../components/OfferProduct';
import Offer from '../components/Offer';

const OfferPage = () => {
  return (
    <main>
      <section className='sec-6 offerPage pt-4 pt-lg-0 mb-5'>
        <Container>
          <Row className='flex-row flex-lg-row-reverse gx-4 gx-xxl-5'>
            <Col xs={12} md={6} lg={4} className='mb-4'>
              <Offer blackText={false} img={"/imgs/img.jpg"} title={'Весна пришла'}/>
            </Col>
            <Col xs={12} lg={8}>
              <h1>Название акции</h1>
              <div className="box mb-5">
                <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias</p>
                <p>Excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
                <p>Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.</p>
              </div>

              <h6 className='secondary'>Товары, участвующие в акции</h6>
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