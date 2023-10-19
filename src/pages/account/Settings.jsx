import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AccountTitleReturn from '../../components/AccountTitleReturn';
import useIsMobile from '../../hooks/isMobile';

const Settings = () => {
  const isMobileLG = useIsMobile('991px');

  return (
    <form action="" className="box p-3 p-sm-4">
      {
        (isMobileLG) 
        ? <AccountTitleReturn link={'/account'} title={'Внесите изменения'}/>
        : <h5>Внесите изменения</h5>
      }
      <Row className='fs-11 g-4 mb-4'>
        <Col md={4}>
          <p className='mb-1'>Имя</p>
          <input type="text" placeholder='Имя' defaultValue={'Элли'}/>
        </Col>
        <Col md={4}>
          <p className='mb-1'>Фамилия</p>
          <input type="text" placeholder='Фамилия' defaultValue={'Кошечкина'}/>
        </Col>
        <Col md={4}>
          <p className='mb-1'>Дата рождения</p>
          <input type="date"/>
        </Col>
        <Col md={6}>
          <p className='mb-1'>Номер</p>
          <input type="tel" placeholder='+7' defaultValue={'+7 919 856-36-58'}/>
        </Col>
        <Col md={6}>
          <p className='mb-1'>Электронный адрес</p>
          <input type="email" placeholder='mail@mail.ru' defaultValue={'kot_lesha@mail.com'}/>
        </Col>
      </Row>
      <label className='mb-3'>
        <span className='me-1 me-sm-3'>Включить пуш-уведомления</span>
        <input type="checkbox" role="switch" />
      </label>
      <label>
        <span className='me-1 me-sm-3'>Подписаться на рассылку</span>
        <input type="checkbox" role="switch" />
      </label>
      <button type='submit' className='btn-primary mt-4'>Сохранить изменения</button>
    </form>
  );
};

export default Settings;