import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProductCard from "../../components/ProductCard";
import AccountTitleReturn from "../../components/AccountTitleReturn";

const Offers = () => {
  return (
    <section>
      {
        (isMobileLG) && 
        <AccountTitleReturn link={'/account'} title={'Акции и промокоды'}/>
      }
      <h5 className='fw-6'>Персональные акции</h5>
      <div className="box p-2 p-md-4 mb-5">
        <Row xs={2} sm={3} xxl={4} className='gx-3 gx-md-4 gy-4 gy-md-5'>
          <Col>
            <ProductCard/>
          </Col>
          <Col>
            <ProductCard />
          </Col>
          <Col>
            <ProductCard />
          </Col>
          <Col>
            <ProductCard />
          </Col>
        </Row>
      </div>
      <h5 className='fw-6'>Общие акции</h5>
      <div className="box p-2 p-md-4">
        <Row xs={2} sm={3} xxl={4} className='gx-3 gx-md-4 gy-4 gy-md-5'>
          <Col>
            <ProductCard/>
          </Col>
          <Col>
            <ProductCard/>
          </Col>
          <Col>
            <ProductCard/>
          </Col>
          <Col>
            <ProductCard />
          </Col>
          <Col>
            <ProductCard />
          </Col>
          <Col>
            <ProductCard />
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Offers;
