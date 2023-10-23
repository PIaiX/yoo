import React, { useCallback, useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CategoryGroup from "../components/CategoryGroup";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Loader from "../components/utils/Loader";
import { getCategory } from "../services/category";

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
