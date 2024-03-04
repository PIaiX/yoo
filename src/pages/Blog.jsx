import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Offer from "../components/Offer";
import ArticlePreview from "../components/ArticlePreview";
import { getBlogs } from "../services/blog";
import EmptyCatalog from "../components/empty/catalog";
import { Link } from "react-router-dom";
import Empty from "../components/Empty";
import Loader from "../components/utils/Loader";

const Blog = () => {
  const [blogs, setBlogs] = useState({ loading: true, items: [] });

  useEffect(() => {
    getBlogs({ size: 5 })
      .then((res) => setBlogs({ loading: false, ...res }))
      .catch(() => setBlogs({ loading: false, items: [] }));
  }, []);

  if (blogs?.loading) {
    return <Loader full />;
  }

  if (!blogs?.items || blogs?.items?.length === 0) {
    return (
      <Empty
        text="Новостей нет"
        desc="Новости скоро появится"
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
    <main className="inner">
      <Container>
        <section className="sec-6 pt-4 pt-lg-0 mb-5">
          <h1 className="inner mb-4">Новости и статьи</h1>
          <Row className="gx-4 gx-lg-5">
            {/* flex-lg-row-reverse <Col lg={4}>
              <h5 className="fs-12">Новости по категориям</h5>
              <ul className="fs-09 list-unstyled d-flex flex-wrap mb-4 mb-md-5">
                <li className="me-2 mb-2">
                  <button type="button" className="btn-secondary">
                    Тег 1
                  </button>
                </li>
                <li className="me-2 mb-2">
                  <button type="button" className="btn-secondary">
                    категория новостей
                  </button>
                </li>
                <li className="me-2 mb-2">
                  <button type="button" className="btn-secondary">
                    новости
                  </button>
                </li>
                <li className="me-2 mb-2">
                  <button type="button" className="btn-secondary">
                    категория №2
                  </button>
                </li>
                <li className="me-2 mb-2">
                  <button type="button" className="btn-secondary">
                    Тег 2
                  </button>
                </li>
              </ul>
              <div className="d-none d-lg-block">
                <Offer
                  blackText={false}
                  img={"images/offers/offer1.jpg"}
                  title={"Весна пришла"}
                  subtitle={"А с ней новые вкусы роллов!"}
                />
              </div>
            </Col> */}
            <Col lg={8}>
              <ul className="list-unstyled">
                {blogs.items.map((e) => (
                  <li className="mb-4 mb-md-5">
                    <ArticlePreview {...e} />
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </section>
      </Container>
    </main>
  );
};

export default Blog;
