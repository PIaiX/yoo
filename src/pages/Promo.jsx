import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../components/Empty";
import Meta from "../components/Meta";
import Offer from "../components/Offer";
import EmptySale from "../components/empty/sale";
import Loader from "../components/utils/Loader";
import { useTranslation } from "react-i18next";
import { getSales } from "../services/sales";
import { updateSales } from "../store/reducers/catalogSlice";

const Promo = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const options = useSelector((state) => state.settings.options);
  const catalog = useSelector((state) => state.catalog);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!catalog?.sales) {
      setLoading(true);
    }
    getSales({
      affiliateId: selectedAffiliate?.id ?? false,
      multiBrand: options?.multiBrand,
      type: "site",
    })
      .then((res) => {
        dispatch(updateSales(res));
      })
      .finally(() => {
        if (!catalog?.sales || loading) {
          setLoading(false);
        }
      });
  }, [options, selectedAffiliate]);

  if (loading) {
    return <Loader full />;
  }

  if (
    !Array.isArray(catalog?.sales?.items) ||
    catalog?.sales?.items?.length <= 0
  ) {
    return (
      <>
        <Meta
          title={
            options?.seo?.sales?.title
              ? options.seo.sales.title
              : selectedAffiliate?.title
              ? selectedAffiliate?.title + " - Акции"
              : options?.title
              ? options.title + " - Акции"
              : t("Акции")
          }
          description={
            options?.seo?.sales?.description
              ? options.seo.sales.description
              : t(
                  "Закажите любимую еду со скидкой! У нас всегда действуют выгодные акции и специальные предложения."
                )
          }
        />
        <Empty
          text="Нет акций"
          desc="Временно акции отсуствуют"
          image={() => <EmptySale />}
          button={
            <a
              className="btn-primary"
              onClick={() => {
                location.reload();
                return false;
              }}
            >
              Обновить страницу
            </a>
          }
        />
      </>
    );
  }
  return (
    <main>
      <Meta
        title={
          options?.seo?.sale?.title
            ? options.seo.sale.title
            : selectedAffiliate?.title
            ? selectedAffiliate?.title + " - Акции"
            : options?.title
            ? options.title + " - Акции"
            : t("Акции")
        }
        description={
          options?.seo?.sale?.description
            ? options.seo.sale.description
            : t(
                "Закажите любимую еду со скидкой! У нас всегда действуют выгодные акции и специальные предложения.  "
              )
        }
      />
      <section className="sec-6 pt-4 pt-lg-0 mb-5">
        <Container>
          <Row
            xs={12}
            md={6}
            lg={4}
            className="g-2 g-sm-3 g-md-4 g-lg-3 g-xl-4"
          >
            {catalog?.sales?.items.map((e) => (
              <Col lg={4} md={6} key={e.id}>
                <Offer data={e} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Promo;
