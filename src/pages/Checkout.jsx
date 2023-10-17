import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavTop from '../components/utils/NavTop';
import CheckoutProduct from '../components/CheckoutProduct';
import {Link} from 'react-router-dom';

const Checkout = () => {
  const [isDelivery, setIsDelivery] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <main>
      <Container>
        <NavTop toBack={true} breadcrumbs={true}/>
        {
          (isAccepted)
          ? <Row>
            <Col lg={5}>
              <h1 className='mb-4'>Заказ № 4567 принят</h1>
              <p>Если у вас остались вопросы вы можете связаться с нашим менеджером</p>
              <div className="d-flex mt-4">
                <button type='button' className='btn-secondary'>Связаться</button>
                <Link to="/menu" className='btn-light ms-2 ms-sm-3'>Продолжить покупки</Link>
              </div>
            </Col>
            <Col lg={7}>
              <img src="/imgs/img1.jpg" alt="BD" className='img-fluid rounded-4 mt-4 mt-lg-0'/>
            </Col>
          </Row>
          : <form className='cart'>
            <Row className='g-4 g-xxl-5'>
              <Col xs={12} md={6} xl={8}>
                <h1 className='text-center text-md-start mb-4'>Оформление заказа</h1>
                <Row xs={1} xl={3} className='g-3 mb-4 mb-xl-5'>
                  <Col>
                    <div className="input-labeled">
                      <span className='dark-gray fs-09'>Получатель</span>
                      <input type="text" placeholder='Имя' />
                    </div>
                  </Col>
                  <Col>
                    <div className="input-labeled">
                      <span className='dark-gray fs-09'>Номер телефона</span>
                      <input type="tel" placeholder='+7- ___-___-__-__' />
                    </div>
                  </Col>
                  <Col>
                    <p className='dark-gray fs-09'>Способ получения</p>
                    <ul className='inputGroup fs-09'>
                      <li>
                        <label>
                          <input type="radio" name='param1' onClick={()=>setIsDelivery(true)}/>
                          <div className='text'>Доставка</div>
                        </label>
                      </li>
                      <li>
                        <label>
                          <input type="radio" defaultChecked={true} name='param1' onClick={()=>setIsDelivery(false)}/>
                          <div className='text'>Самовывоз</div>
                        </label>
                      </li>
                    </ul>
                  </Col>
                </Row>

                {
                  (isDelivery)
                  ? <Row xs={1} xl={2} className='g-3 mb-5'>
                      <Col>
                        <div className="input-labeled">
                          <span className='dark-gray fs-09'>Улица</span>
                          <input type="text" placeholder='Улица' />
                        </div>
                      </Col>
                      <Col>
                        <Row xs={3} className='gx-2 gx-sm-3'>
                          <Col>
                            <div className="input-labeled">
                              <span className='dark-gray fs-09'>Дом</span>
                              <input type="text" placeholder='0' />
                            </div>
                          </Col>
                          <Col>
                            <div className="input-labeled">
                              <span className='dark-gray fs-09'>Корпус</span>
                              <input type="text" placeholder='0' />
                            </div>
                          </Col>
                          <Col>
                            <div className="input-labeled">
                              <span className='dark-gray fs-09'>Подъезд</span>
                              <input type="text" placeholder='0' />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Row xs={3} className='gx-2 gx-sm-3'>
                          <Col>
                            <div className="input-labeled">
                              <span className='dark-gray fs-09'>Этаж</span>
                              <input type="text" placeholder='0' />
                            </div>
                          </Col>
                          <Col>
                            <div className="input-labeled">
                              <span className='dark-gray fs-09'>Квартира</span>
                              <input type="text" placeholder='0' />
                            </div>
                          </Col>
                          <Col>
                            <div className="input-labeled">
                              <span className='dark-gray fs-09'>Домофон</span>
                              <input type="text" placeholder='0' />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  : <Row xs={1} xl={2} className='g-4 g-xxl-5 mb-5'>
                    <Col>
                      <label className='mb-4'>
                        <input type="radio" name='address' defaultChecked={true}/>
                        <span>улица А. Губкина, д. 17</span>
                      </label>
                      <p className="fs-09 secondary mb-2">Режим работы</p>
                      <p className="fs-09">
                        С 10:00 до 16:00 понедельник-пятница.
                        <br/>Суббота,воскресенье-выходные
                      </p>
                    </Col>
                    <Col>
                      <label className='mb-4'>
                        <input type="radio" name='address'/>
                        <span>Проспект Победы 156/26</span>
                      </label>
                      <p className="fs-09 secondary mb-2">Режим работы</p>
                      <p className="fs-09">
                        С 10:00 до 16:00 понедельник-пятница.
                        <br/>Суббота,воскресенье-выходные
                      </p>
                    </Col>
                  </Row>
                }

                <div className="box-gray">
                  <h6>Ваш заказ</h6>
                  <ul className='list-unstyled'>
                    <li className='mb-3'><CheckoutProduct/></li>
                    <li className='mb-3'><CheckoutProduct/></li>
                    <li className='mb-3'><CheckoutProduct/></li>
                  </ul>
                </div>
              </Col>
              <Col xs={12} md={6} xl={4}>
                <div className='fs-11 mb-1'>Комментарий</div>
                <textarea rows="3" defaultValue={'Уберите, пожалуйста, лук'} className='fs-09 mb-4'></textarea>

                <div className="d-flex justify-content-between my-2">
                  <span>Стоимость товаров</span>
                  <span>1 880 ₽</span>
                </div>
                <div className="d-flex justify-content-between my-2">
                  <span>Доставка</span>
                  <span className='secondary'>бесплатно</span>
                </div>
                <hr className='my-3'/>
                <div className="fs-11 d-flex justify-content-between mb-4">
                  <span className='fw-6'>Итоговая сумма</span>
                  <span className='fw-6'>1 880 ₽</span>
                </div>

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className='bg-success success py-2 px-3 rounded-3 w-auto fw-6 fs-09'>Доступно 344 бонуса</div>
                  <label>
                    <span className='me-1 me-sm-2'>Списать</span>
                    <input type="checkbox" role="switch" />
                  </label>
                </div>

                <div className="d-flex justify-content-start align-items-center">
                  <input type="text" placeholder='0' defaultValue={300} className='w-100p py-2 px-3'/>
                  <button type='button' className='btn-light fs-09 ms-2'>списать все бонусы</button>
                </div>
                
                <button type='submit' onClick={()=>setIsAccepted(true)} className='btn-primary mt-3 w-100'>
                  <span className='fw-4'>Заказать</span>
                </button>
                <div className='fs-09 bg-secondary secondary p-2 fw-5 text-center w-100 rounded-2 mt-3'>34 бонуса будут начислены за этот заказ</div>
              </Col>
            </Row>
          </form>
        }
        
      </Container>
    </main>
  );
};

export default Checkout;