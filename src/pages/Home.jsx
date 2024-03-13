import React from "react";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import "swiper/css";
import AppStore from "../assets/imgs/appstore-black.svg";
import GooglePlay from "../assets/imgs/googleplay-black.svg";
import Phone from "../assets/imgs/phone.png";
import Catalog from "../components/Catalog";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Meta from "../components/Meta";
import Loader from "../components/utils/Loader";
import Widgets from "../components/Widgets";
import { useGetHomeQuery } from "../services/home";

const Home = () => {
  const home = useGetHomeQuery();
  const options = useSelector((state) => state.settings.options);

  if (home?.isLoading) {
    return <Loader full />;
  }

  return (
    <main className="mt-0 pt-0">
      <Meta
        title={options?.title ?? "Главная"}
        description={options?.description}
      />

      {home?.data?.widgets?.length > 0 ? (
        <Widgets data={home.data.widgets} />
      ) : home?.data?.categories?.length > 0 ? (
        <Catalog data={home.data.categories} />
      ) : (
        <Empty
          text="Сайт пуст"
          desc="Информация скоро появится"
          image={() => <EmptyCatalog />}
        />
      )}

      {options?.appYes && (
        <Container className="overflow-hidden">
          <section className="sec-4 mb-5">
            <h3>
              Заказывать стало <br className="d-lg-none" />
              ещё&nbsp;удобнее!
            </h3>
            <div className="d-flex align-items-center mb-3 mb-lg-4">
              <button
                type="button"
                className="btn-2 fs-20 py-2 px-3 px-lg-4 me-2 me-md-3"
              >
                <span className="d-lg-none">—</span>
                <span className="d-none d-lg-inline">скидка</span>
                <span> 15%</span>
              </button>
              <p className="fs-16">
                на&nbsp;первый заказ <br />
                через&nbsp;приложение
              </p>
            </div>
            <ul className="logotips mb-3 mb-lg-5">
              <li>
                <a href="/">
                  <img src={AppStore} alt="App Store" />
                </a>
              </li>
              <li>
                <a href="/">
                  <img src={GooglePlay} alt="Google Play" />
                </a>
              </li>
            </ul>
            <p>Акция действует при заказе на сумму от 1 000 ₽</p>
            <img src={Phone} alt="Phone" className="phone" />
          </section>
        </Container>
      )}
    </main>
  );
};

export default Home;
