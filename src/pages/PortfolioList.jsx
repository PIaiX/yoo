import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PortfolioItem from "../components/PortfolioItem";
import Loader from "../components/utils/Loader";
import { getPortfolio } from "../services/portfolio";

const PortfolioList = () => {
  const [portfolio, setPortfolio] = useState({ loading: true, items: [] });

  useEffect(() => {
    getPortfolio({ size: 50 }).then((res) => setPortfolio(res));
  }, []);

  if (portfolio?.loading) {
    return <Loader full />;
  }

  return (
    <main className="inner">
      <Container>
        <section className="sec-6 mb-5">
          <h1 className="inner mb-4">Портфолио</h1>
          <Row className="gx-4 gx-lg-5">
            {portfolio.items.map((e) => {
              return (
                <Col key={e.id} xs={6} lg={3}>
                  <PortfolioItem data={e} />
                </Col>
              );
            })}
          </Row>
        </section>
      </Container>
    </main>
  );
};

export default PortfolioList;
