import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";
import Empty from "../components/Empty";
import Meta from "../components/Meta";
import Offer from "../components/Offer";
import EmptySale from "../components/empty/sale";
import Loader from "../components/utils/Loader";
import { useGetSalesQuery } from "../services/home";

const Promo = () => {
  const sales = useGetSalesQuery();
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const options = useSelector((state) => state.settings.options);

  if (sales?.isLoading) {
    return <Loader full />;
  }

  if (!Array.isArray(sales.data.items) || sales.data.items.length <= 0) {
    return (
      <Empty
        text="Нет акций"
        desc="Временно акции отсуствуют"
        image={() => <EmptySale />}
        button={
          <a
            className="btn-primary"
            onClick={() => {
              location.reload();
              return false;
            }}
          >
            Обновить страницу
          </a>
        }
      />
    );
  }
  return (
    <main>
      <Meta
        title={`${selectedAffiliate?.title ?? options?.title} — Акции`}
        description={`${selectedAffiliate?.title ?? options?.title} — Акции`}
      />
      <section className="sec-6 pt-4 pt-lg-0 mb-5">
        <Container>
          <Row
            xs={12}
            md={6}
            lg={4}
            className="g-2 g-sm-3 g-md-4 g-lg-3 g-xl-4"
          >
            {sales.data.items.map((e) => (
              <Col lg={4} md={6} key={e.id}>
                <Offer data={e} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* <section className="sec-5 mb-5">
        <Container>
          <h2>Вам может понравиться</h2>
          <Swiper
            className="product-slider"
            spaceBetween={10}
            slidesPerView={"auto"}
            speed={750}
            breakpoints={{
              576: {
                spaceBetween: 20,
              },
            }}
          >
            <SwiperSlide>
              <ProductCardMini />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini />
            </SwiperSlide>
            <SwiperSlide>
              <ProductCardMini />
            </SwiperSlide>
          </Swiper>
        </Container>
      </section> */}
    </main>
  );
};

export default Promo;
