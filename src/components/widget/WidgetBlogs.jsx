import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import useIsMobile from "../../hooks/isMobile";
import ArticleCard from "../ArticleCard";
import { Link } from "react-router-dom";

const WidgetBlogs = memo((data) => {
  const isMobileLG = useIsMobile("991px");
  if (!data?.items || data?.items?.length === 0) {
    return null;
  }
  return (
    <section className="sec-5 mb-6">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{data.title}</h2>
          <div>
            <Link to="/blogs" className="btn btn-sm btn-40">
              Все новости
            </Link>
          </div>
        </div>
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
