import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import CategoryGroup from "../components/CategoryGroup";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
// import Notice from "../components/Notice";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Meta from "../components/Meta";
import NavTop from "../components/utils/NavTop";
import { generateSeoText, getImageURL } from "../helpers/all";
import Footer from "../components/Footer";

const Category = () => {
  const { categoryId } = useParams();
  const { state } = useLocation();
  const options = useSelector((state) => state.settings.options);
  const item = useSelector((data) =>
    data.catalog.home?.find((e) => e.id === categoryId || e.id === state.id)
  );
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const { t } = useTranslation();

  // const onLoad = useCallback(() => {
  //   getCategory({
  //     id: categoryId,
  //     affiliateId: selectedAffiliate?.id ?? false,
  //     multiBrand: options?.multiBrand,
  //     required: true,
  //     viewCategories: false,
  //     type: "site",
  //   })
  //     .then((res) => setCategory({ loading: false, item: res }))
  //     .catch(() => setCategory((data) => ({ ...data, loading: false })));
  // }, [categoryId, selectedAffiliate]);

  // useLayoutEffect(() => {
  //   onLoad();
  // }, [categoryId, selectedAffiliate]);

  if (
    !item?.id ||
    !Array.isArray(item?.products) ||
    item.products.length <= 0
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
    <>
      <Meta
        title={
          options?.seo?.category?.title && item?.title
            ? generateSeoText({
                text: options.seo.category.title,
                name: item.title,
                site: options?.title,
              })
            : selectedAffiliate?.title && item?.title
            ? selectedAffiliate?.title + " - " + item.title
            : options?.title && item?.title
            ? options.title + " - " + item.title
            : item?.title ?? t("Категория")
        }
        description={
          options?.seo?.category?.description
            ? generateSeoText({
                text: options.seo.category.description,
                name: item.title,
                site: options?.title,
              })
            : item?.description ??
              t(
                "Добавьте блюдо из этой категории в корзину и наслаждайтесь вкусной едой прямо сейчас!"
              )
        }
        image={
          item?.media
            ? getImageURL({
                path: item.media,
                size: "full",
                type: "category",
              })
            : false
        }
      />
      <Row className="gx-0">
        <Col className="left-menu-col">
          <Header />
        </Col>
        <Col>
          <div className="px-4 pb-4 vh-100">
            <NavTop />
            <CategoryGroup data={item} />
          </div>
          <Footer />
        </Col>
      </Row>
    </>
  );
};

export default Category;
