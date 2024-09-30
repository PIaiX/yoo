import React, { memo } from "react";
import ProductCard from "./ProductCard";
import { Col, Row } from "react-bootstrap";

const CategoryGroup = memo(({ data }) => {
  return (
    <section className="сategoryGroup" id={"category-" + data.id}>
      <div className="filterGrid mb-3">
        <h4 className="d-block fw-7 mb-0">{data.title}</h4>
      </div>
      {data.products.length > 0 ? (
        <Row xxl={5} xl={4} lg={3} md={2} sm={2} className="gx-3">
          {data.products.map((e) => (
            <Col key={e.id}>
              <ProductCard data={e} />
            </Col>
          ))}
        </Row>
      ) : (
        data.products?.items?.length > 0 && (
          <Row xxl={5} xl={4} lg={3} md={2} sm={2} className="gx-3">
            {data.products.items.map((e) => (
              <Col key={e.id}>
                <ProductCard data={e} />
              </Col>
            ))}
          </Row>
        )
      )}
    </section>
  );
});

export default CategoryGroup;
