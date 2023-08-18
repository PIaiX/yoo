import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import PasswordForm from "../../components/forms/PasswordForm";

const Recovery = () => {
  return (
    <main>
      <Container>
        <section className="sec-password mb-6">
          <h1 className="h2 text-center">Восстановление пароля</h1>
          <Row className="justify-content-center">
            <Col xs={12} xl={5}>
              <div className="wrap">
                {/* <PasswordForm /> */}
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </main>
  );
};

export default Recovery;
