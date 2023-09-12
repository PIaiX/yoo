import React, { useLayoutEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import OfferProduct from "../components/OfferProduct";
import Loader from "../components/utils/Loader";
import { getImageURL } from "../helpers/all";
import { getSale } from "../services/sales";

const OfferPage = () => {
  const { saleId } = useParams();

  const [sale, setSale] = useState({
    loading: true,
    data: {},
  });

  useLayoutEffect(() => {
    getSale(saleId)
      .then((res) => setSale({ loading: false, data: res }))
      .catch(() => setSale((data) => ({ ...data, loading: false })));
  }, [saleId]);

  if (sale?.loading) {
    return <Loader full />;
  }

  if (!sale.data) {
    return (
      <Empty
        text="Такой акции не существует"
        desc="Возможно акция была удалена или вы ввели неверную ссылку"
        image={() => <EmptyCatalog />}
        button={
          <a
            className="btn-primary"
            onclick={() => {
              location.reload();
              return false;
            }}
          >
            Обновить страницу
          </a>
        }
      />
    );
  }

  return (
    <main>
      <section className="sec-6 pt-4 pt-lg-0 mb-5">
        <Container>
          <Row className="flex-row flex-lg-row-reverse gx-4 gx-xxl-5">
            <Col xs={12} md={6} lg={4} className="mb-4">
              <figure className="offer full">
                <LazyLoadImage
                  src={getImageURL({
                    path: sale.data.medias,
                    type: "sale",
                    size: "full",
                  })}
                  alt={sale?.data?.title}
                  loading="lazy"
                />
                <figcaption>
                  <div>
                    <h4>{sale.data.title}</h4>
                    <h6 className="fw-4">{sale.data.desc}</h6>
                  </div>
                </figcaption>
              </figure>
            </Col>
            <Col xs={12} lg={8}>
              <h1>{sale.data.title}</h1>
              <div className="box mb-5">{sale.data.desc}</div>

              {/* <h2>Товары, участвующие в акции</h2>
              <ul className="list-unstyled offer-products-list">
                <li>
                  <OfferProduct />
                </li>
                <li>
                  <OfferProduct />
                </li>
              </ul> */}
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default OfferPage;
