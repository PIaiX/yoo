import React, { useLayoutEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Loader from "../components/utils/Loader";
import { generateSeoText, getImageURL } from "../helpers/all";
import { getSale } from "../services/sales";
import Meta from "../components/Meta";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const OfferPage = () => {
  const { saleId } = useParams();
  const { t } = useTranslation();
  const options = useSelector((state) => state.settings.options);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
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
      <Meta
        title={
          options?.seo?.sale?.title && sale.data?.title
            ? generateSeoText({
                text: options.seo.sale.title,
                name: sale.data.title,
                site: options?.title,
              })
            : selectedAffiliate?.title && sale.data?.title
            ? selectedAffiliate?.title + " - " + sale.data.title
            : options?.title && sale.data?.title
            ? options.title + " - " + sale.data.title
            : sale.data?.title ?? t("Акция")
        }
        description={
          options?.seo?.sale?.description
            ? generateSeoText({
                text: options.seo.sale.description,
                name: sale.data.desc,
                site: options?.title,
              })
            : sale.data?.desc ??
              t(
                "Успейте воспользоваться выгодным предложением и насладитесь вкусной едой по доступной цене."
              )
        }
        image={
          sale.data?.media
            ? getImageURL({
                path: sale.data.medias,
                type: "sale",
                size: "full",
              })
            : false
        }
      />
      <section className="sec-6 pt-4 pt-lg-0 mb-5">
        <Container>
          <Row className="flex-row justify-content-center">
            <Col xs={12} xl={8} lg={10} md={12} sm={12}>
              <figure className="offer full">
                <LazyLoadImage
                  draggable={false}
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
                  <h6 className="fw-4 white-space">{sale.data.desc}</h6>
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
