import React, {
  useState
} from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Meta from "../components/Meta";
import WidgetAffiliates from "../components/widget/WidgetAffiliates";

const Home = () => {
  const { t } = useTranslation();
  const options = useSelector((state) => state.settings.options);



  return (
    <main className="mt-0 pt-0">
      <Container>
        <Meta
          title={
            options?.seo?.home?.title
              ? options.seo.home.title
              : options?.title
                ? options.title + " - доставка еды на дом, офис"
                // : selectedAffiliate?.title
                //   ? selectedAffiliate?.title + " - доставка еды на дом, офис"
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
        <WidgetAffiliates link="/filial" />
      </Container>
    </main >
  );
};

export default Home;
