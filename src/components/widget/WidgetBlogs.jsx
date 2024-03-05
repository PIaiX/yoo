import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import useIsMobile from "../../hooks/isMobile";
import ArticleCard from "../ArticleCard";

const WidgetBlogs = memo((data) => {
  const isMobileLG = useIsMobile("991px");
  if (!data?.items || data?.items?.length === 0) {
    return null;
  }
  return (
    <section className="sec-5 mb-6">
      <Container>
        <h2>{data.title}</h2>
        {!isMobileLG && (
          <Row className="gx-4 gy-5">
            {data.items.map((e) => {
              return (
                <Col key={e.id} md={4} xl={3}>
                  <ArticleCard data={e} />
                </Col>
              );
            })}
          </Row>
        )}
        {isMobileLG && (
          <Swiper
            className="articles-slider"
            spaceBetween={20}
            slidesPerView={"auto"}
          >
            {data.items.map((e) => {
              return (
                <SwiperSlide key={e.id}>
                  <ArticleCard data={e} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </Container>
    </section>
  );
});

export default WidgetBlogs;
