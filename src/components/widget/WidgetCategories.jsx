import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Empty from "../Empty";
import WidgetCategoryItem from "./WidgetCategoryItem";

const WidgetCategories = memo((data) => {
  if (!data?.items || data?.items?.length === 0) {
    return null;
  }
  return (
    <section className="sec-catalog mb-6">
      <Container>
        <h2 className="text-center">{data.title}</h2>
        {data?.items?.length > 0 ? (
          <>
            <Row
              xs={2}
              md={3}
              lg={4}
              className="justify-content-center gx-2 gy-3 g-sm-4"
            >
              {data.items.map((obj) => {
                return (
                  <Col key={obj.id}>
                    <WidgetCategoryItem data={obj} />
                  </Col>
                );
              })}
            </Row>
            {data.items?.length > 1 && (
              <Link
                to="/categories"
                className="btn btn-40 mt-4 mt-sm-5 mx-auto"
              >
                Показать все
              </Link>
            )}
          </>
        ) : (
          <Empty
            mini
            text="Категорий нет"
            image={() => <img draggable="false" src="/images/empty-catalog.png" width="30%" />}
          />
        )}
      </Container>
    </section>
  );
});

export default WidgetCategories;
