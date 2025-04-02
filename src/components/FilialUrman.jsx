import React, { memo, useCallback, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { HiOutlineArrowUturnDown } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Choose from "../assets/imgs/choose.svg";
import CategoriesUrman from "./CategoriesUrman";
import CategoryCard from "./CategoryCard";
import GridIcon from "./svgs/GridIcon";
import SearchInput from "./utils/SearchInput";
import CategoryGroupUrman from "./CategoryGroupUrman";

const FilialUrman = memo(({
  data,
  search = false,
  mainMenuCategoryIds = [], // ID всех категорий для основного меню
  otherCategoriesIds = [],  // ID остальных категорий
  productsLimit = 4,
  mainMenuPosition = 1 // Позиция основного меню среди категорий (начиная с 0)
}) => {
  const [viewCategories, setViewCategories] = useState(false);
  const navigate = useNavigate();

  const toggleViewCategories = useCallback(() => {
    setViewCategories((prev) => !prev);
  }, []);

  if (!data || data?.length === 0) {
    return null;
  }

  // Все категории для основного меню
  const allMainMenuCategories = data.filter(item =>
    mainMenuCategoryIds.includes(item.id)
  );

  // Первые две категории для отображения продуктов
  const displayedMainMenuCategories = allMainMenuCategories.slice(0, 2);

  // Остальные категории
  const otherCategoriesData = data.filter(item =>
    otherCategoriesIds.includes(item.id)
  );

  // Создаем искусственную категорию "Основное меню"
  const mainMenuCategory = {
    id: "main-menu",
    title: "Основное меню",
    isMainMenu: true,
    subCategories: displayedMainMenuCategories,
    allCategories: allMainMenuCategories
  };

  // Создаем массив категорий с основным меню в нужной позиции
  const getOrderedCategories = () => {
    const result = [...otherCategoriesData];
    result.splice(mainMenuPosition, 0, mainMenuCategory);
    return result;
  };

  const orderedCategories = getOrderedCategories();

  return (
    <section className="sec-3 mb-5">
      {viewCategories ? (
        <Container className="box">
          <Button
            variant="link"
            onClick={toggleViewCategories}
            className="d-none d-md-flex btn-view mb-3 ms-auto me-4"
          >
            <img src={Choose} alt="Choose" />
            <GridIcon />
          </Button>
          <Row xs={2} md={3} xl={4} className="g-3 g-sm-4">
            {orderedCategories.map((e) => (
              <Col key={e.id}>
                <CategoryCard data={e} />
              </Col>
            ))}
          </Row>
          <Button
            variant="link"
            className="main-color mx-auto mt-4"
          >
            <span>показать все</span>
            <HiOutlineArrowUturnDown className="fs-15 ms-3 main-color rotateY-180" />
          </Button>
        </Container>
      ) : (
        <>
          <CategoriesUrman data={orderedCategories} filial={true} />
          {search && <SearchInput />}
          <Container>
            {orderedCategories.map((category) => (
              <div key={category.id} className="categories-box mb-5" id={"category-" + category.id}>
                {category.isMainMenu ? (
                  <>
                    <div className="filterGrid">
                      <h4 className="d-block fw-6 mb-4 urman-dark-green">{category.title}</h4>
                    </div>
                    <div className="d-flex flex-wrap gap-3 mb-4">
                      {category.allCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => navigate(`/category/${cat.id}`)}
                          className="btn-10"
                        >
                          {cat.title}
                        </button>
                      ))}
                    </div>
                    {category.subCategories.map((subCat) => (
                      <div key={subCat.id} className="mb-4">
                        <h5 className="d-block fs-13 mb-3">{subCat.title}</h5>
                        <CategoryGroupUrman
                          data={subCat}
                          onLoad={(product) => navigate("/product/" + product.id)}
                          limit={productsLimit}
                          hideTitle={true}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <CategoryGroupUrman
                    data={category}
                    onLoad={(product) => navigate("/product/" + product.id)}
                    limit={productsLimit}
                  />
                )}
              </div>
            ))}
          </Container>
        </>
      )}
    </section>
  );
});

export default FilialUrman;