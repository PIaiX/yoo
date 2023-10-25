import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProductCard from "../../components/ProductCard";
import AccountTitleReturn from "../../components/AccountTitleReturn";

const Offers = () => {
  return (
    <section>
      <AccountTitleReturn 
        className="d-lg-none"
        link={"/account"} 
        title={"Акции и промокоды"} 
      />
      <h5 className="fw-6">Персональные акции</h5>
      <div className="box py-4 px-4 px-xxl-5 mb-5">
        <Row xs={1} sm={2} lg={3} className="gx-4 gx-xl-5">
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
      <h5 className="fw-6">Общие акции</h5>
      <div className="box py-4 px-4 px-xxl-5">
        <Row md={3} className="gx-4 gx-xl-5">
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
