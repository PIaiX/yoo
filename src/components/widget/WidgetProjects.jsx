import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Empty from "../Empty";
import WidgetProjectItem from "./WidgetProjectItem";

const WidgetProjects = memo((data) => {
  return (
    <section className="sec-catalog mb-6">
      <Container>
        {data.title && <h2 className="text-center">{data.title}</h2>}
        {data?.items?.length > 0 ? (
          <>
            <Row
              xs={2}
              md={2}
              lg={2}
              className="justify-content-center gx-2 gy-3 g-sm-4"
            >
              {data.items.map((obj) => {
                return (
                  <Col key={obj.id}>
                    <WidgetProjectItem data={obj} />
                  </Col>
                );
              })}
            </Row>
            <Link to="/projects" className="btn-primary mx-auto mt-4">
              Показать все
            </Link>
          </>
        ) : (
          <Empty
            mini
            text="Проектов нет"
            image={() => <img src="/images/empty-catalog.png" width="30%" />}
          />
        )}
      </Container>
    </section>
  );
});

export default WidgetProjects;
