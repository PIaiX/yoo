import React, { memo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../../services/home";
import CategoryCard from "../CategoryCard";
import { Pagination } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import ArticleCard from "../ArticleCard";
import ArticlesCover from "../../assets/images/articlesCover.jpg";
import ArticlesMore from "../../assets/images/articlesMore.jpg";
import useIsMobile from "../../hooks/isMobile";
import jsonArticles from "../../data/articles";
const WidgetNews = memo((data) => {
  const isMobileLG = useIsMobile("991px");
  return (
    <section className="sec-5 mt-5 mb-5">
      <Container>
        <Row className="gx-4 gy-5">
          <Col xs={12} lg={8} xl={6}>
            <img src={ArticlesCover} alt="Cover" className="cover" />
          </Col>
          {!isMobileLG && (
            <>
              {jsonArticles.map((obj) => {
                return (
                  <Col key={obj.id} md={4} xl={3}>
                    <ArticleCard data={obj} />
                  </Col>
                );
              })}
              <Col md={4} xl={3}>
                <Link to="/blogs" className="more">
                  <img src={ArticlesMore} alt="more" className="img" />
                </Link>
              </Col>
            </>
          )}
        </Row>
        {isMobileLG && (
          <Swiper
            className="articles-slider"
            spaceBetween={20}
            slidesPerView={"auto"}
          >
            {jsonArticles.map((obj) => {
              return (
                <SwiperSlide key={obj.id}>
                  <ArticleCard data={obj} />
                </SwiperSlide>
              );
            })}
            <SwiperSlide>
              <Link to="/blogs" className="more">
                <img src={ArticlesMore} alt="more" className="img" />
              </Link>
            </SwiperSlide>
          </Swiper>
        )}
      </Container>
    </section>
  );
});

export default WidgetNews;
