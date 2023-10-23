
import React, { useLayoutEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useParams } from "react-router-dom";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Loader from "../components/utils/Loader";
import { getImageURL } from "../helpers/all";
import { getSale } from "../services/sales";


const OfferPage = () => {
  const { saleId } = useParams();

  const [sale, setSale] = useState({
    loading: true,
    data: {},
  });

  useLayoutEffect(() => {
    getSale(saleId)
      .then((res) => setSale({ loading: false, data: res }))
      .catch(() => setSale((data) => ({ ...data, loading: false })));
  }, [saleId]);

  if (sale?.loading) {
    return <Loader full />;
  }

  if (!sale?.data?.id) {
    return (
      <Empty
        text="Такой акции не существует"
        desc="Возможно акция была удалена или вы ввели неверную ссылку"
        image={() => <EmptyCatalog />}
        button={
          <a
            className="btn-primary"
            onclick={() => {
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
      <section className='sec-6 offerPage pt-4 pt-lg-0 mb-5'>
        <Container>
          <Row className='flex-row flex-lg-row-reverse gx-4 gx-xxl-5'>
            <Col xs={12} md={6} lg={4} className='mb-4'>
              <Offer blackText={false} img={"/imgs/img.jpg"} title={'Весна пришла'}/>
            </Col>
            <Col xs={12} lg={8}>
              <h1>Название акции</h1>
              <div className="box mb-5">
                <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias</p>
                <p>Excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
                <p>Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.</p>
              </div>

              <h6 className='secondary'>Товары, участвующие в акции</h6>
              <ul className='list-unstyled offer-products-list'>
                <li><OfferProduct/></li>
                <li><OfferProduct/></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default OfferPage;
