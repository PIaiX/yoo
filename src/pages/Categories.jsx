import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CategoryCard from "../components/CategoryCard";
import { getCategoriesList } from "../services/category";
import Loader from "../components/utils/Loader";
import EmptyCatalog from "../components/empty/catalog";
import { Link } from "react-router-dom";
import Empty from "../components/Empty";
import Meta from "../components/Meta";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Categories = () => {
  const [categories, setCategories] = useState({ loading: true, items: [] });
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const options = useSelector((state) => state.settings.options);
  const { t } = useTranslation();

  useEffect(() => {
    getCategoriesList({ size: 50, parent: false })
      .then((res) => setCategories({ loading: false, items: res }))
      .catch(() => setBlogs({ loading: false, items: [] }));
  }, []);

  if (categories?.loading) {
    return <Loader full />;
  }

  if (categories?.items?.length === 0) {
    return (
      <>
        <Meta
          title={
            options?.seo?.categories?.title
              ? options.seo.categories.title
              : selectedAffiliate?.title
              ? selectedAffiliate?.title + " - Каталог"
              : options?.title
              ? options.title + " - Каталог"
              : t("Каталог")
          }
          description={
            options?.seo?.categories?.description
              ? options.seo.categories.description
              : t(
                  "Ищите вкусную и свежую еду? Выберите подходящую категорию и найдите любимые блюда."
                )
          }
        />
        <Empty
          text={t("Каталога нет")}
          desc={t("Каталог уже скоро появится")}
          image={() => <EmptyCatalog />}
          button={
            <Link className="btn-primary" to="/">
              {t("Перейти на главную")}
            </Link>
          }
        />
      </>
    );
  }

  return (
    <main>
      <Meta
        title={
          options?.seo?.categories?.title
            ? options.seo.categories.title
            : selectedAffiliate?.title
            ? selectedAffiliate?.title + " - Каталог"
            : options?.title
            ? options.title + " - Каталог"
            : t("Каталог")
        }
        description={
          options?.seo?.categories?.description
            ? options.seo.categories.description
            : t(
                "Ищите вкусную и свежую еду? Выберите подходящую категорию и найдите любимые блюда."
              )
        }
      />
      <section className="page-catalog mb-6">
        <Container>
          <h1 className="text-center mb-4">{t("Каталог")}</h1>
          <Row
            xs={2}
            md={3}
            lg={4}
            className="justify-content-center gx-2 gy-3 g-sm-4"
          >
            {categories?.items?.length > 0 &&
              categories.items.map((obj) => {
                return (
                  <Col key={obj.id}>
                    <CategoryCard data={obj} />
                  </Col>
                );
              })}
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Categories;
