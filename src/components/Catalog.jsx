import React, { memo, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {
  // HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowUturnDown,
} from "react-icons/hi2";
import Choose from "../assets/imgs/choose.svg";
import Categories from "./Categories";
import CategoryCard from "./CategoryCard";
import CategoryGroup from "./CategoryGroup";
import GridIcon from "./svgs/GridIcon";
import { Modal } from "react-bootstrap";
import Loader from "./utils/Loader";
import NavTop from "./utils/NavTop";
import { useTranslation } from "react-i18next";
import ProductModal from "./ProductModal";

const Catalog = memo(({ data }) => {
  const [viewCategories, setViewCategories] = useState(false);
  const [product, setProduct] = useState({
    show: false,
    loading: true,
    data: false,
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
                    onOpen={(e) =>
                      setProduct((prev) => ({ ...prev, show: true, data: e }))
                    }
                  />
                ))}
              </div>
            )}
          </Container>
        </>
      )}
      {/* <Modal
        className="product-modal"
        show={product.show}
        onHide={() => setProduct({ show: false, loading: true, data: false })}
        centered
        size="xl"
        scrollable
      >
        <Modal.Body className="scroll-custom">
          {product.show && product.data ? (
            <ProductModal
              {...product.data}
              onLoad={(e) => {
                console.log(e);
                setProduct((prev) => ({
                  ...prev,
                  show: true,
                  loading: false,
                  data: e,
                }));
              }}
            />
          ) : (
            <Loader full />
          )}
        </Modal.Body>
      </Modal> */}
    </section>
  );
});

export default Catalog;
