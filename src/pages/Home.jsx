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
import Loader from "../components/utils/Loader";
import { isUpdateTime } from "../helpers/all";
import { getCatalog } from "../services/catalog";
import { updateCatalog } from "../store/reducers/catalogSlice";
import EmptyWork from "../components/empty/work";
import QrApp from "../components/QrApp";
import { Col, Container, Row } from "react-bootstrap";
import { isDesktop } from "react-device-detect";
import WidgetAffiliates from "../components/widget/WidgetAffiliates";

const Home = () => {
  const { t } = useTranslation();
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const [loading, setLoading] = useState(false);
  const options = useSelector((state) => state.settings.options);
  const city = useSelector((state) => state.affiliate.city);
  const catalog = useSelector((state) => state.catalog);
  const dispatch = useDispatch();



  return (
    <main className="mt-0 pt-0">
      <Container>
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
        <WidgetAffiliates link="/catalog" />
      </Container>
    </main >
  );
};

export default Home;
