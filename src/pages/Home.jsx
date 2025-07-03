import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Container } from "react-bootstrap";
import { isDesktop } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Catalog from "../components/Catalog";
import Empty from "../components/Empty";
import EmptyWork from "../components/empty/work";
import Meta from "../components/Meta";
import QrApp from "../components/QrApp";
import Loader from "../components/utils/Loader";
import Widgets from "../components/Widgets";
import { isUpdateTime } from "../helpers/all";
import { getCatalog } from "../services/catalog";
import { updateCatalog } from "../store/reducers/catalogSlice";

const Home = () => {
  const { t } = useTranslation();

  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const [loading, setLoading] = useState(false);
  const options = useSelector((state) => state.settings.options);
  const city = useSelector((state) => state.affiliate.city);
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
  }, [selectedAffiliate, catalog, city, loading, options]);

  useLayoutEffect(() => {
    if (
      isUpdateTime(catalog.updateTime) &&
      options?.title &&
      options?.title != "YooApp"
    ) {
      if (
        catalog?.widgets?.length === 0 &&
        catalog?.categories?.length === 0 &&
        selectedAffiliate
      ) {
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
      {options?.qrApp && isDesktop ? (
        <Container>
          <QrApp />
        </Container>
      ) : (
        ""
      )}
    </main>
  );
};

export default Home;
