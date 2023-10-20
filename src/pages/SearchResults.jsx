import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SelectImitation from '../components/utils/SelectImitation';
// import IconGrid from '../components/svgs/IconGrid';
// import IconRows from '../components/svgs/IconRows';
import ProductCard from '../components/ProductCard';
import NavPagination from '../components/NavPagination';

const SearchResults = () => {
  return (
    <main className="inner">
      <Container>
        <section className='mb-5 pt-4'>
          <h1 className="inner mb-3 mb-md-4">Результаты поиска по запросу: Наименование запроса</h1>
          <div className='d-md-flex justify-content-end align-items-center mb-4 mb-md-5'>
            <select>
                <option value="1">Рекомендуемые</option>
                <option value="2">Сначала дешевые</option>
                <option value="3">Сначала дорогие</option>
            </select>
          </div>

          <Row xs={2} sm={3} md={3} lg={4} xxl={5} className='gx-3 gx-md-5 gy-4 gy-sm-5 mb-4 mb-md-5'>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
            <Col>
              <ProductCard/>
            </Col>
          </Row>

          <NavPagination/>
        </section>
      </Container>
    </main>
  );
};

export default SearchResults;