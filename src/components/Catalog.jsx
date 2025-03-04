import React, { memo, useState } from "react";
import { Row, Container, Col, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { HiOutlineArrowUturnDown } from "react-icons/hi2";
import Choose from "../assets/imgs/choose.svg";
import Categories from "./Categories";
import CategoryCard from "./CategoryCard";
import CategoryGroup from "./CategoryGroup";
import ProductModal from "./ProductModal";
import GridIcon from "./svgs/GridIcon";
import Loader from "./utils/Loader";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Catalog = memo(({ data }) => {
  const [viewCategories, setViewCategories] = useState(false);
  const { hash } = useLocation();
  const city = useSelector((state) => state.affiliate.city);
  const [product, setProduct] = useState({
    show: !!hash && !!city,
    loading: true,
    data: !!hash && !!city ? { id: hash.slice(1) } : false,
  });
  const { t } = useTranslation();

  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <section className="sec-3 mb-5">
      {viewCategories ? (
        <Container className="box">
          <button
            type="button"
            onClick={() => setViewCategories(!viewCategories)}
            className="d-none d-md-flex btn-view mb-3 ms-auto me-4"
          >
            <img src={Choose} alt="Choose" />
            <GridIcon />
          </button>
          {data?.length > 0 && (
            <>
              <Row xs={2} md={3} xl={4} className="g-3 g-sm-4">
                {data.map((e) => (
                  <Col>
                    <CategoryCard data={e} />
                  </Col>
                ))}
              </Row>
              <button type="button" className="main-color mx-auto mt-4">
                <span>показать все</span>
                <HiOutlineArrowUturnDown className="fs-15 ms-3 main-color rotateY-180" />
              </button>
            </>
          )}
        </Container>
      ) : (
        <>
          <Categories data={data} />
          <Container>
            {data?.length > 0 && (
              <div className="categories-box">
                {data.map((e, index) => (
                  <CategoryGroup
                    key={index}
                    data={e}
                    onLoad={(e) =>
                      setProduct((prev) => ({ ...prev, show: true, data: e }))
                    }
                  />
                ))}
              </div>
            )}
          </Container>
        </>
      )}
      <Modal
        className="product-modal"
        show={product.show}
        onHide={() => {
          const urlWithoutHash = window.location.href.split("#")[0];
          window.history.replaceState(null, null, urlWithoutHash);
          setProduct({ show: false, loading: true, data: false });
        }}
        centered
        size="xl"
        scrollable
      >
        <button
          type="button"
          onClick={() => {
            const urlWithoutHash = window.location.href.split("#")[0];
            window.history.replaceState(null, null, urlWithoutHash);
            setProduct({ show: false, loading: true, data: false });
          }}
          className="btn-close btn-close-fixed"
          aria-label="Close"
        ></button>
        <Modal.Body className="scroll-custom">
          {product.show && product.data ? (
            <ProductModal
              {...product.data}
              onLoad={(e) => {
                setProduct((prev) => ({
                  ...prev,
                  show: true,
                  loading: false,
                  data: e,
                }));
              }}
              onExit={() => {
                const urlWithoutHash = window.location.href.split("#")[0];
                window.history.replaceState(null, null, urlWithoutHash);
                setProduct((prev) => ({
                  ...prev,
                  show: false,
                  loading: false,
                  data: false,
                }));
              }}
            />
          ) : (
            <Loader full />
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
});

export default Catalog;
