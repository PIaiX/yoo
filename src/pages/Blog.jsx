import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Offer from '../components/Offer';
import ArticlePreview from '../components/ArticlePreview';

const Blog = () => {
  return (
    <main className="inner">
      <Container>
        <section className='sec-6 pt-4 pt-lg-0 mb-5'>
          <h1 className="inner mb-4">Новости и статьи</h1>
          <Row className='flex-lg-row-reverse gx-4 gx-lg-5'>
            <Col lg={4}>
              <h5 className='fs-12'>Новости по категориям</h5>
              <ul className='fs-09 list-unstyled d-flex flex-wrap mb-4 mb-md-5'>
                <li className='me-2 mb-2'>
                  <button type='button' className='btn-secondary'>Тег 1</button>
                </li>
                <li className='me-2 mb-2'>
                  <button type='button' className='btn-secondary'>категория новостей</button>
                </li>
                <li className='me-2 mb-2'>
                  <button type='button' className='btn-secondary'>новости</button>
                </li>
                <li className='me-2 mb-2'>
                  <button type='button' className='btn-secondary'>категория №2</button>
                </li>
                <li className='me-2 mb-2'>
                  <button type='button' className='btn-secondary'>Тег 2</button>
                </li>
              </ul>
              <div className="d-none d-lg-block">
                <Offer blackText={false} img={"imgs/offers/offer1.jpg"} title={'Весна пришла'} subtitle={'А с ней новые вкусы роллов!'}/>
              </div>
            </Col>
            <Col lg={8}>
              <ul className='list-unstyled'>
                <li className='mb-4 mb-md-5'><ArticlePreview/></li>
                <li className='mb-4 mb-md-5'><ArticlePreview/></li>
                <li className='mb-4 mb-md-5'><ArticlePreview/></li>
                <li className='mb-4 mb-md-5'><ArticlePreview/></li>
              </ul>
            </Col>
          </Row>
        </section>
      </Container>
    </main>
  );
};

export default Blog;