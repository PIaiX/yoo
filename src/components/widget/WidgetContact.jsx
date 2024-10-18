import React, { memo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getImageURL } from "../../helpers/all";
import Callback from "../modals/Callback";

const WidgetContact = memo((data) => {
  const [show, setShow] = useState(false);
  const options = useSelector((state) => state.settings.options);

  return (
    <Container>
      <section
        className="sec-feedback"
        style={{
          backgroundImage: `url(${getImageURL({
            path: options.feedback,
            type: "all/web/feedback",
            size: "full",
          })})`,
        }}
      >
        <Row className="justify-content-end">
          <Col xs={12} md={8} lg={6}>
            <h2 className="text-center">{data?.title ?? "Оформите заявку"}</h2>
            {data?.desc && <p className="text-center">{data.desc}</p>}
            <button
              type="button"
              className="btn-info mx-auto mt-4"
              onClick={() => setShow(true)}
            >
              Заказать
            </button>
            <Callback show={show} setShow={setShow} />
          </Col>
        </Row>
      </section>
    </Container>
  );
});

export default WidgetContact;
