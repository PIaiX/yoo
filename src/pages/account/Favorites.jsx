import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../../components/ProductCard';
import AccountTitleReturn from '../../components/AccountTitleReturn';
import useIsMobile from '../../hooks/isMobile';

const Offers = () => {
  const isMobileLG = useIsMobile('991px');

  return (
    <section>
      {
        (isMobileLG) && 
        <AccountTitleReturn link={'/account'} title={'Избранное'}/>
      }
      <h5 className='fw-6'>Избранное</h5>
      <div className="box p-2 p-md-4 mb-5">
        <Row xs={2} sm={3} xxl={4} className='gx-3 gx-md-4 gy-4 gy-md-5'>
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
      </div>
    </section>
  );
};

export default Offers;