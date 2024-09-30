import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Catalog from "../components/Catalog";
import Empty from "../components/Empty";
import Meta from "../components/Meta";
import Widgets from "../components/Widgets";
import EmptyCatalog from "../components/empty/catalog";
import Loader from "../components/utils/Loader";
import { isUpdateTime } from "../helpers/all";
import { getCatalog } from "../services/catalog";
import { updateCatalog } from "../store/reducers/catalogSlice";
import Header from "../components/Header";
import { Col, Container, Row } from "react-bootstrap";
import Offer from "../components/Offer";

const Home = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const options = useSelector((state) => state.settings.options);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const catalog = useSelector((state) => state.catalog);
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const getData = useCallback(() => {
    getCatalog({
      affiliateId: selectedAffiliate?.id ?? false,
      multiBrand: options?.multiBrand,
      type: "site",
    })
      .then((res) => {
        dispatch(
          updateCatalog({
            home: res.categories,
            categories:
              res.categories?.length > 0
                ? res.categories.map((e) => ({
                    id: e.id,
                    title: e.title,
                    media: e.media,
                    status: e.status,
                    priority: e.priority,
                    options: e.options,
                  }))
                : [],
          })
        );
      })
      .finally(() => {
        if (
          (catalog?.widgets?.length === 0 &&
            catalog?.categories?.length === 0) ||
          loading
        ) {
          setLoading(false);
        }
      });
  }, [selectedAffiliate, catalog, loading, options]);

  useLayoutEffect(() => {
    if (isUpdateTime(catalog.updateTime)) {
      if (catalog?.categories?.length === 0) {
        setLoading(true);
      }
      getData();
    }
  }, [options]);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    getData();
  }, [selectedAffiliate]);

  if (loading) {
    return <Loader full />;
  }

  return (
    <>
      <Meta
        title={
          options?.seo?.home?.title
            ? options.seo.home.title
            : options?.title
            ? options.title + " - доставка еды на дом, офис"
            : selectedAffiliate?.title
            ? selectedAffiliate?.title + " - доставка еды на дом, офис"
            : t("Главная")
        }
        description={
          options?.seo?.home?.description
            ? options.seo.home.description
            : t(
                "Закажите еду онлайн с доставкой! Широкий выбор вкусных блюд, удобный поиск и быстрая доставка."
              )
        }
      />

      {catalog?.home?.length > 0 ? (
        <Row className="gx-3 gx-xl-4">
          <Col className="left-menu-col">
            <Header />
          </Col>
          <Col>
            {catalog?.sales?.items ? (
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
            ) : (
              <Empty
                text={t("Акций нет")}
                desc={t("Информация скоро появится")}
                image={() => <EmptyCatalog />}
              />
            )}
          </Col>
        </Row>
      ) : (
        <Empty
          text={t("Сайт пуст")}
          desc={t("Информация скоро появится")}
          image={() => <EmptyCatalog />}
        />
      )}
    </>
  );
};

export default Home;
