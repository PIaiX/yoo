import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavTop from '../components/utils/NavTop';
import CountInput from '../components/utils/CountInput';
import CheckoutProduct from '../components/CheckoutProduct';

const Checkout = () => {
  return (
    <main>
      <Container>
        <NavTop toBack={true} breadcrumbs={false}/>
        <form className='cart'>
          <Row className='g-4 g-xxl-5'>
            <Col xs={12} md={6} xl={8}>
              <h1 className='text-center text-md-start'>Оформление заказа</h1>
              <Row xs={1} xl={2} className='g-4 g-xxl-5'>
                <Col>
                  <div className='mb-2'>Получатель</div>
                  <input type="text" placeholder='Введите имя' className='mb-4'/>

                  <div className='mb-2'>Номер телефона</div>
                  <input type="tel" placeholder='+7–___–___–__–__' className='mb-4'/>

                  <div className="d-flex align-items-center justify-content-between my-4 my-xl-5">
                    <p>Количество персон</p>
                    <CountInput dis={false} />
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between">
                    <div className='btn-green w-auto fw-6 rounded-3'>Доступно 344 бонуса</div>
                    <label>
                      <span className='me-1 me-sm-3'>Списать</span>
                      <input type="checkbox" role="switch" />
                    </label>
                  </div>
                </Col>
                <Col>
                  <div className='mb-2'>Улица</div>
                  <input type="text" placeholder='Улица' className='mb-4'/>
                  <Row xs={3} className='gx-2 gx-sm-4'>
                    <Col>
                      <div className='mb-2'>Дом</div>
                      <input type="text" className='mb-4'/>
                    </Col>
                    <Col>
                      <div className='mb-2'>Корпус</div>
                      <input type="text" className='mb-4'/>
                    </Col>
                    <Col>
                      <div className='mb-2'>Подъезд</div>
                      <input type="text" className='mb-4'/>
                    </Col>
                    <Col>
                      <div className='mb-2'>Этаж</div>
                      <input type="text" className='mb-4'/>
                    </Col>
                    <Col>
                      <div className='mb-2'>Квартира</div>
                      <input type="text" className='mb-4'/>
                    </Col>
                    <Col>
                      <div className='mb-2'>Домофон</div>
                      <input type="text" className='mb-4'/>
                    </Col>
                  </Row>
                  <div className="d-flex">
                    <input type="text" placeholder='Количество бонусов для списания'/>
                    <button type='button' className='btn-10 ms-2 ms-sm-4'>Все</button>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6} xl={4}>
              <div className="cart-box mb-4">
                <h6>Ваш заказ</h6>
                <ul className='list-unstyled'>
                  <li className='mb-3'><CheckoutProduct/></li>
                  <li className='mb-3'><CheckoutProduct/></li>
                  <li className='mb-3'><CheckoutProduct/></li>
                </ul>
              </div>

              <div className="d-flex justify-content-between my-2">
                <span>Стоимость товаров</span>
                <span>1 880 ₽</span>
              </div>
              <div className="d-flex justify-content-between my-2">
                <span>Доставка</span>
                <span className='main-color'>бесплатно</span>
              </div>
              <hr className='my-3'/>
              <div className="d-flex justify-content-between mb-4">
                <span className='fw-6 fs-11'>Итоговая сумма</span>
                <span className='fw-6'>1 880 ₽</span>
              </div>

              <div className='bg-main-01 main-color p-2 fw-6 text-center w-100 rounded-3 mt-3'>34 бонуса будут начислены за этот заказ</div>
              <button type='submit' className='btn-secondary mt-3 w-100'>
                <span className='fw-4'>Заказать</span>
              </button>
            </Col>
          </Row>
        </form>
      </Container>
    </main>
  );
};

export default Checkout;