import React, { useCallback, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CategoryGroup from "../components/CategoryGroup";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Notice from "../components/Notice";
import Loader from "../components/utils/Loader";
import { getCategory } from "../services/category";

const Category = () => {
  const { categoryId } = useParams();
  const multiBrand = useSelector((state) => state.settings.options.multiBrand);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);

  const [category, setCategory] = useState({
    loading: true,
    item: {},
  });

  const onLoad = useCallback(() => {
    getCategory({
      id: categoryId,
      affiliateId: selectedAffiliate?.id ?? false,
      view: multiBrand,
      type: "site",
    })
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
    !Array.isArray(category.item.products.items) ||
    category.item.products.items.length <= 0
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
