import React, { useLayoutEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Loader from "../components/utils/Loader";
import { getImageURL } from "../helpers/all";
import { getSale } from "../services/sales";
import Meta from "../components/Meta";
import { useTranslation } from "react-i18next";

const OfferPage = () => {
  const { saleId } = useParams();
  const { t } = useTranslation();

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

  if (!sale?.data?.id) {
    return (
      <Empty
        text={t("Такой акции не существует")}
        desc={t("Возможно акция была удалена или вы ввели неверную ссылку")}
        image={() => <EmptyCatalog />}
        button={
          <a
            className="btn-primary"
            onClick={() => {
              location.reload();
              return false;
            }}
          >
            {t("Обновить страницу")}
          </a>
        }
      />
    );
  }

  return (
    <main>
      <Meta title={sale.data.title} description={sale.data.desc} />
      <section className="sec-6 pt-4 pt-lg-0 mb-5">
        <Container>
          <Row className="flex-row justify-content-center">
            <Col xs={12} xl={8} lg={10} md={12} sm={12}>
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
                <div className="p-4">
                  <h4>{sale.data.title}</h4>
                  <h6 className="fw-4">{sale.data.desc}</h6>
                </div>
              </figure>
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
