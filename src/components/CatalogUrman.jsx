import React, { memo, Suspense, useCallback, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { HiOutlineArrowUturnDown } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Choose from "../assets/imgs/choose.svg";
import CategoriesUrman from "./CategoriesUrman";
import CategoryCard from "./CategoryCard";
import CategoryGroup from "./CategoryGroup";
import GridIcon from "./svgs/GridIcon";
import ButtonClose from "./utils/ButtonClose";
import Loader from "./utils/Loader";
import Input from "./utils/Input";
import SearchInput from "./utils/SearchInput";

// Ленивая загрузка ProductModal
const ProductModal = React.lazy(() => import("./ProductModal"));

const ProductModalComponent = memo(({ product, setProduct }) => {
  const handleClose = useCallback(() => {
    const urlWithoutHash = window.location.href.split("#")[0];
    window.history.replaceState(null, null, urlWithoutHash);
    setProduct((prev) => ({
      ...prev,
      show: false,
      loading: true,
      data: false,
    }));
  }, [setProduct]);

  return (
    product?.show && (
      <Modal
        fullscreen="sm-down"
        className="product-modal"
        show={product.show}
        onHide={handleClose}
        centered
        size="xl"
        scrollable
      >
        <ButtonClose onClick={() => handleClose()} />
        <Modal.Body className="scroll-hide">
          {product.show && product.data ? (
            <Suspense fallback={<Loader full />}>
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
                onExit={handleClose}
              />
            </Suspense>
          ) : (
            <Loader full />
          )}
        </Modal.Body>
      </Modal>
    )
  );
});

const CatalogUrman = memo(({ data, search }) => {
  const [viewCategories, setViewCategories] = useState(false);
  const { hash } = useLocation();
  const city = useSelector((state) => state.affiliate.city);
  const [product, setProduct] = useState({
    show: !!hash && !!city,
    loading: true,
    data: !!hash && !!city ? { id: hash.slice(1) } : false,
  });
  const { t } = useTranslation();


  const toggleViewCategories = useCallback(() => {
    setViewCategories((prev) => !prev);
  }, []);

  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <section className="sec-3 mb-5">
      {viewCategories ? (
        <Container className="box">
          <button
            draggable={false}
            type="button"
            onClick={toggleViewCategories}
            className="d-none d-md-flex btn-view mb-3 ms-auto me-4"
          >
            <img src={Choose} alt="Choose" />
            <GridIcon />
          </button>
          {data?.length > 0 && (
            <>
              <Row xs={2} md={3} xl={4} className="g-3 g-sm-4">
                {data.map((e) => (
                  <Col key={e.id}>
                    <CategoryCard data={e} />
                  </Col>
                ))}
              </Row>
              <button
                draggable={false}
                type="button"
                className="main-color mx-auto mt-4"
              >
                <span>показать все</span>
                <HiOutlineArrowUturnDown className="fs-15 ms-3 main-color rotateY-180" />
              </button>
            </>
          )}
        </Container>
      ) : (
        <>
          <CategoriesUrman data={data} />
          {search && <SearchInput />}
          <Container>
            {data?.length > 0 && (
              <div className="categories-box">
                {data.map((e) => (
                  <CategoryGroup
                    key={e.id}
                    data={e}
                    onLoad={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        show: true,
                        loading: false,
                        data: e,
                      }))
                    }
                  />
                ))}
              </div>
            )}
          </Container>
        </>
      )}
      <Suspense fallback={<Loader full />}>
        <ProductModalComponent product={product} setProduct={setProduct} />
      </Suspense>
    </section>
  );
});

export default CatalogUrman;
