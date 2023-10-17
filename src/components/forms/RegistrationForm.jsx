import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const RegistrationForm = () => {
  return (
    <form action="" className='registration-form'>
      <h4 className='main-color text-center fw-6'>Привет, друг!</h4>
      <p className='text-center fs-11 mb-5'>Введи данные чтобы зарегистрироваться</p>
      
      <p className='fs-11 mb-1'>Имя</p>
      <Row className='gx-3 mb-4'>
        <Col xs={12} lg={7}>
          <input type="text" placeholder='Имя'/>
        </Col>
      </Row>

      <p className='fs-11 mb-1'>Email</p>
      <Row className='gx-0 gx-lg-3 mb-4'>
        <Col xs={8} lg={7}>
          <input type="email" placeholder='Email'/>
        </Col>
        <Col xs={4}>
          <button type='button' className='btn-secondary w-100 rounded-3'>Подтвердить</button>
        </Col>
      </Row>

      <p className="main-color fs-09">Нажимая на кнопку «Зарегистрироваться», вы принимаете условия Пользовательского соглашения и соглашаетесь с Политикой конфиденциальности</p>
      <button type='submit' disabled className='btn-secondary w-md-100 mt-4'>Зарегистрироваться</button>
    </form>
  );
};

export default RegistrationForm;