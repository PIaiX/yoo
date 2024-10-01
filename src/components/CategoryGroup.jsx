import React, { memo, useState } from "react";
import ProductCard from "./ProductCard";
import { Col, Modal, Row } from "react-bootstrap";
import { HiXMark } from "react-icons/hi2";
import Product from "../pages/Product";

const CategoryGroup = memo(({ data }) => {
  const [product, setProduct] = useState({ show: false, data: {} });
  return (
    <section className="сategoryGroup" id={"category-" + data.id}>
      <div className="filterGrid mb-3">
        <h4 className="d-block fw-7 mb-0">{data.title}</h4>
      </div>
      {data.products.length > 0 ? (
        <Row xxl={5} xl={4} lg={3} md={2} sm={2} className="gx-3">
          {data.products.map((e) => (
            <Col key={e.id}>
              <ProductCard
                data={e}
                onShow={() => setProduct({ show: true, data: e })}
              />
            </Col>
          ))}
        </Row>
      ) : (
        data.products?.items?.length > 0 && (
          <Row xxl={5} xl={4} lg={3} md={2} sm={2} className="gx-3">
            {data.products.items.map((e) => (
              <Col key={e.id}>
                <ProductCard
                  data={e}
                  onShow={() => setProduct({ show: true, data: e })}
                />
              </Col>
            ))}
          </Row>
        )
      )}

      <Product
        item={product.data}
        show={product.show}
        onHide={() => setProduct({ show: false, data: {} })}
      />
    </section>
  );
});

export default CategoryGroup;
