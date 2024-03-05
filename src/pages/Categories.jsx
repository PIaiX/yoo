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

const Categories = () => {
  const [categories, setCategories] = useState({ loading: true, items: [] });

  useEffect(() => {
    getCategoriesList({ size: 50 })
      .then((res) => setCategories({ loading: false, items: res }))
      .catch(() => setBlogs({ loading: false, items: [] }));
  }, []);

  if (categories?.loading) {
    return <Loader full />;
  }

  if (categories?.items?.length === 0) {
    return (
      <Empty
        text="Каталога нет"
        desc="Каталог уже скоро появится"
        image={() => <EmptyCatalog />}
        button={
          <Link className="btn-primary" to="/">
            Перейти на главную
          </Link>
        }
      />
    );
  }

  return (
    <main>
      <section className="page-catalog mb-6">
        <Container>
          <h1 className="text-center mb-4">Каталог</h1>
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
