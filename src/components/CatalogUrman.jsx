import React, { memo, useCallback, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { HiOutlineArrowUturnDown } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Choose from "../assets/imgs/choose.svg";
import CategoriesUrman from "./CategoriesUrman";
import CategoryCard from "./CategoryCard";
import CategoryGroup from "./CategoryGroup";
import GridIcon from "./svgs/GridIcon";
import SearchInput from "./utils/SearchInput";



const CatalogUrman = memo(({ data, search, affiliateId }) => {
  const [viewCategories, setViewCategories] = useState(false);
  const navigate = useNavigate();

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
                      navigate("/product/" + e.id)
                    }
                    affiliateId={affiliateId}
                  />
                ))}
              </div>
            )}
          </Container>
        </>
      )}

    </section>
  );
});

export default CatalogUrman;
