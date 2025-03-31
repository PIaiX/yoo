import React, { memo, useCallback, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getImageURL } from "../../helpers/all";
import { Link, useNavigate } from "react-router-dom";
import { mainAffiliateEdit } from "../../store/reducers/affiliateSlice";

const WidgetAffiliates = memo(({ link }) => {
  const affiliates = useSelector((state) => state.affiliate.items);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  if (!affiliates || affiliates?.length === 0) {
    return null;
  }


  // Функция для разбиения на строки (только для больших экранов)
  const affiliateChunks = useMemo(() => {
    const chunks = [];
    const total = affiliates.length;

    if (total === 0) return chunks;

    // Для больших экранов (≥992px) - оригинальная логика
    if (window.innerWidth >= 992) {
      if (total <= 3) {
        chunks.push(affiliates);
      } else if (total === 4) {
        chunks.push(affiliates.slice(0, 2));
        chunks.push(affiliates.slice(2, 4));
      } else if (total === 5) {
        chunks.push(affiliates.slice(0, 2));
        chunks.push(affiliates.slice(2, 5));
      } else if (total === 6) {
        chunks.push(affiliates.slice(0, 3));
        chunks.push(affiliates.slice(3, 6));
      } else {
        chunks.push(affiliates.slice(0, 3));
        let i = 3;
        while (i < total) {
          chunks.push(affiliates.slice(i, i + 4));
          i += 4;
        }
      }
    } else {
      // Для экранов <992px просто разбиваем по 2 элемента (для md) или 1 (для xs)
      // React Bootstrap сам позаботится о разметке через Col
      chunks.push(affiliates);
    }

    return chunks;
  }, [affiliates]);
  const onChoose = useCallback((data) => {
    dispatch(mainAffiliateEdit(data))
    navigate(link)
  }, [link]);

  return (
    <section className="affiliates-section">
      <Container fluid className="h-100 px-0 px-md-2">
        {window.innerWidth >= 992 ? (
          // Рендеринг с чанками только для больших экранов
          affiliateChunks.map((chunk, chunkIndex) => (
            <Row
              key={`chunk-${chunkIndex}`}
              className="g-2 g-md-3 mb-2 mb-md-3 mx-0"
            >
              {chunk.map((affiliate, index) => (
                <Col
                  key={affiliate.id || index}
                  lg={chunk.length === 1 ? 12 : chunk.length === 2 ? 6 : chunk.length === 3 ? 4 : 3}
                  md={6}
                  xs={12}
                  className="px-1 px-md-2"
                >
                  <div className="affiliate-card" onClick={() => onChoose(affiliate)}>
                    <div className="affiliate-image-container">
                      <img
                        src={getImageURL({
                          path: affiliate?.media,
                          type: "affiliate",
                          size: "full",
                        })}
                        alt={affiliate.title}
                        className="affiliate-image w-100"
                        loading="lazy"
                      />
                    </div>
                    <div className="affiliate-title">
                      {affiliate.title ?? "Название"}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ))
        ) : (
          // Простой рендеринг для экранов <992px (React Bootstrap сам разобьет по 2 или 1 элементу)
          <Row className="g-2 g-md-3 mb-2 mb-md-3 mx-0">
            {affiliates.map((affiliate, index) => (
              <Col
                key={affiliate.id || index}
                md={6}
                xs={12}
                className="px-1 px-md-2"
              >
                <div className="affiliate-card">
                  <div className="affiliate-image-container">
                    <img
                      src={getImageURL({
                        path: affiliate?.media,
                        type: "affiliate",
                        size: "full",
                      })}
                      alt={affiliate.title}
                      className="affiliate-image w-100"
                      loading="lazy"
                    />
                  </div>
                  <div className="affiliate-title">
                    {affiliate.title ?? "Название"}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
});

export default WidgetAffiliates;