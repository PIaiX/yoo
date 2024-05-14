import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getImageURL } from "../../helpers/all";

const WidgetAbout = memo((data) => {
  return (
    <section className="mb-6">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2>{data.title}</h2>
            {data?.desc && <p className="fs-11 fw-3">{data.desc}</p>}
          </Col>
          {data?.media && (
            <Col md={6}>
              <img
                className="rounded-3"
                width="100%"
                src={getImageURL({
                  path: data.media,
                  type: "all/web/about",
                  size: "full",
                })}
                alt={data.title}
              />
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
});

export default WidgetAbout;
