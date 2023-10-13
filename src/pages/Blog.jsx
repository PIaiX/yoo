import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Blog = () => {
  return (
    <main className="inner">
      <Container>
        <h1 className="inner">Новости и статьи</h1>
        <Row>
            <Col></Col>
            <Col>
                <h5>Новости по категориям</h5>
                
            </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Blog;