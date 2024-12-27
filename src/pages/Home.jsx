import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Catalog from "../components/Catalog";
import Empty from "../components/Empty";
import Meta from "../components/Meta";
import Widgets from "../components/Widgets";
import EmptyCatalog from "../components/empty/catalog";
import Loader from "../components/utils/Loader";
import { isUpdateTime } from "../helpers/all";
import { getCatalog } from "../services/catalog";
import { updateCatalog } from "../store/reducers/catalogSlice";
import EmptyWork from "../components/empty/work";

const Home = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const options = useSelector((state) => state.settings.options);
  const city = useSelector((state) => state.affiliate.city);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const catalog = useSelector((state) => state.catalog);
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const getData = useCallback(() => {
    if (selectedAffiliate?.id) {
      getCatalog({
        affiliateId: selectedAffiliate?.id ?? false,
        multiBrand: options?.multiBrand,
        type: "site",
      })
        .then((res) => {
          dispatch(updateCatalog(res));
        })
        .finally(() => {
          if (
            (catalog?.widgets?.length === 0 &&
              catalog?.categories?.length === 0) ||
            loading
          ) {
            setLoading(false);
          }
        });
    }
  }, [selectedAffiliate, catalog, loading, options]);

  useLayoutEffect(() => {
    if (
      isUpdateTime(catalog.updateTime) &&
      options?.title &&
      options?.title != "YooApp"
    ) {
      if (catalog?.widgets?.length === 0 && catalog?.categories?.length === 0) {
        setLoading(true);
      }
      getData();
    }
  }, [options]);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    getData();
  }, [selectedAffiliate, city]);

  if (loading) {
    return <Loader full />;
  }

  return (
    <main className="mt-0 pt-0">
      <Meta
        title={
          options?.seo?.home?.title
            ? options.seo.home.title
            : options?.title
            ? options.title + " - доставка еды на дом, офис"
            : selectedAffiliate?.title
            ? selectedAffiliate?.title + " - доставка еды на дом, офис"
            : t("Главная")
        }
        description={
          options?.seo?.home?.description
            ? options.seo.home.description
            : t(
                "Закажите еду онлайн с доставкой! Широкий выбор вкусных блюд, удобный поиск и быстрая доставка."
              )
        }
      />

      {catalog?.widgets?.length > 0 ? (
        <Widgets data={catalog.widgets} />
      ) : catalog?.categories?.length > 0 ? (
        <Catalog data={catalog.categories} />
      ) : (
        <Empty
          text={t("На сайте ведутся работы")}
          desc={
            <>
              <p>{t("Зайдите к нам немного позже.")}</p>
              <p>{t("Либо попробуйте почистить кеш браузера.")}</p>
            </>
          }
          image={() => <EmptyWork />}
        />
      )}
    </main>
  );
};

export default Home;
