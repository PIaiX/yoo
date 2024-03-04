import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import useIsMobile from "../../hooks/isMobile";
import ArticleCard from "../ArticleCard";

const WidgetBlogs = memo((data) => {
  const isMobileLG = useIsMobile("991px");
  return (
    <section className="sec-5 mt-5 mb-5">
      <Container>
        {!isMobileLG && data.length > 0 && (
          <Row className="gx-4 gy-5">
            {data.map((obj) => {
              return (
                <Col key={obj.id} md={4} xl={3}>
                  <ArticleCard data={obj} />
                </Col>
              );
            })}
          </Row>
        )}
        {isMobileLG && data.length > 0 && (
          <Swiper
            className="articles-slider"
            spaceBetween={20}
            slidesPerView={"auto"}
          >
            {data.map((obj) => {
              return (
                <SwiperSlide key={obj.id}>
                  <ArticleCard data={obj} />
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
