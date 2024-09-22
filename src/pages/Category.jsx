import React, { useCallback, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CategoryGroup from "../components/CategoryGroup";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
// import Notice from "../components/Notice";
import { useTranslation } from "react-i18next";
import Meta from "../components/Meta";
import Loader from "../components/utils/Loader";
import NavTop from "../components/utils/NavTop";
import { getCategory } from "../services/category";
import { generateSeoText, getImageURL } from "../helpers/all";

const Category = () => {
  const { categoryId } = useParams();
  const options = useSelector((state) => state.settings.options);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const { t } = useTranslation();

  const [category, setCategory] = useState({
    loading: true,
    item: {},
  });

  const onLoad = useCallback(() => {
    getCategory({
      id: categoryId,
      affiliateId: selectedAffiliate?.id ?? false,
      multiBrand: options?.multiBrand,
      required: true,
      viewCategories: false,
      type: "site",
    })
      .then((res) => setCategory({ loading: false, item: res }))
      .catch(() => setCategory((data) => ({ ...data, loading: false })));
  }, [categoryId, selectedAffiliate]);

  useLayoutEffect(() => {
    onLoad();
  }, [categoryId, selectedAffiliate]);

  if (category?.loading) {
    return <Loader full />;
  }

  if (
    !category?.item?.id ||
    !Array.isArray(category?.item?.products?.items) ||
    category.item.products.items.length <= 0
  ) {
    return (
      <Empty
        text={t("Категория пуста")}
        desc={t("Информация скоро появится")}
        image={() => <EmptyCatalog />}
        button={
          <Link className="btn-primary" to="/">
            {t("Перейти на главную")}
          </Link>
        }
      />
    );
  }

  return (
    <main>
      <Meta
        title={
          options?.seo?.category?.title && category?.item?.title
            ? generateSeoText({
                text: options.seo.category.title,
                name: category.item.title,
                site: options?.title,
              })
            : selectedAffiliate?.title && category?.item?.title
            ? selectedAffiliate?.title + " - " + category.item.title
            : options?.title && category?.item?.title
            ? options.title + " - " + category.item.title
            : category?.item?.title ?? t("Категория")
        }
        description={
          options?.seo?.category?.description
            ? generateSeoText({
                text: options.seo.category.description,
                name: category.item.title,
                site: options?.title,
              })
            : category.item?.description ??
              t(
                "Добавьте блюдо из этой категории в корзину и наслаждайтесь вкусной едой прямо сейчас!"
              )
        }
        image={
          category?.item?.media
            ? getImageURL({
                path: category.item.media,
                size: "full",
                type: "category",
              })
            : false
        }
      />
      <section className="container">
        <NavTop breadcrumbs={false} />
        {/* <Notice /> */}
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
