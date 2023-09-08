import React, { useState, useCallback, useLayoutEffect } from "react";
import Categories from "../components/Categories";
import Notice from "../components/Notice";
import CategoryGroup from "../components/CategoryGroup";
import Loader from "../components/utils/Loader";
import { Link, useParams } from "react-router-dom";
import { getCategory } from "../services/category";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";

const Category = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState({
    loading: true,
    item: {},
  });

  const onLoad = useCallback(() => {
    getCategory(categoryId)
      .then((res) => setCategory({ loading: false, item: res }))
      .catch(() => setCategory((data) => ({ ...data, loading: false })));
  }, [categoryId]);

  useLayoutEffect(() => {
    onLoad();
  }, [categoryId]);

  if (category?.loading) {
    return <Loader full />;
  }

  if (
    !Array.isArray(category.item.products) ||
    category.item.products.length <= 0
  ) {
    return (
      <Empty
        text="Товаров нет"
        desc="Меню уже скоро появится"
        image={() => <EmptyCatalog />}
        button={
          <Link className="btn-primary" to="/">
            Перейти в меню
          </Link>
        }
      />
    );
  }

  return (
    <main>
      <section className="container">
        <Notice />
        {/* <img
          src="imgs/Rectangle.png"
          alt="Rectangle"
          className="img-fluid mb-3 mb-sm-4"
        /> */}
      </section>
      <section className="sec-5 container mb-5">
        {/* <div className="sticky-box mb-3 mb-sm-4 mb-md-5">
          <Categories />
        </div> */}

        <div className="categories-box">
          <CategoryGroup data={category.item} />
        </div>
      </section>
    </main>
  );
};

export default Category;
