import React, { useLayoutEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { Link, useParams } from "react-router-dom";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Meta from "../components/Meta";
import Loader from "../components/utils/Loader";
import NavTop from "../components/utils/NavTop";
import { getImageURL } from "../helpers/all";
import { getProduct } from "../services/product";
import { useSelector } from "react-redux";

const Service = () => {
  const { productId } = useParams();
  const selectedAffiliate = useSelector((state) => state.affiliate.active);

  const [product, setProduct] = useState({
    loading: true,
    item: {},
    recommends: [],
  });

  useLayoutEffect(() => {
    getProduct({
      id: productId,
      affiliateId: selectedAffiliate?.id ?? false,
      required: true,
      type: "site",
    })
      .then((res) => {
        setProduct({ ...res, loading: false });
      })
      .catch(() => setProduct((data) => ({ ...data, loading: false })));
  }, [productId]);

  if (product?.loading) {
    return <Loader full />;
  }

  if (!product?.id) {
    return (
      <Empty
        text="Такой услуги нет"
        desc="Возможно вы перепутали ссылку"
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
      <Meta
        title={product?.title ?? "Услуга"}
        description={product?.description}
        image={
          product?.medias[0]?.media
            ? getImageURL({
                path: product.medias[0].media,
                size: "full",
                type: "product",
              })
            : false
        }
      />
      <Container>
        <NavTop toBack={true} />

        <section className="article-page pt-4 pt-lg-0 mb-6">
          <img
            src={getImageURL({
              path: product.medias[0]?.media,
              size: "full",
            })}
            alt={product.title}
            className="article-page-imgMain mb-4 mb-sm-5"
          />
          <h1>{product.title}</h1>
          <p>{product.description}</p>
        </section>
      </Container>
    </main>
  );
};

export default Service;
