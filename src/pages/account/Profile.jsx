import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { TbHeartHandshake } from "react-icons/tb";
import { FiMessageCircle, FiEdit } from "react-icons/fi";
import {Link} from 'react-router-dom';


const Profile = () => {
  return (
    <section className='mb-3 mb-sm-5'>
      <div className="d-lg-none d-flex align-items-center mb-4 mb-lg-0">
        <Link to='/account' className='d-flex return-icon me-2 me-sm-4'></Link>
        <h1 className='h2 mb-0'>Профиль</h1>
      </div>
      <Row className='mb-5'>
        <Col xl={9} xxl={8}>
          <div className='user'>
            <div className="user-photo">
              <img src="imgs/user2.jpg" alt="userphoto" />
              <button type='button'><FiEdit/></button>
            </div>
            <div className="user-main">
              <div className='title'>Weatherwax</div>
              <div className="d-flex align-items-center">
               
                <span className='fs-13 fw-7 ms-2'>5</span>
              </div>
              <p className='mt-2'>3 года на платформе</p>
            </div>
            <ul className="user-info">
              <li>
                <div>
                  <TbHeartHandshake className='svg'/>
                  <span>Сделок:</span>
                </div>
                <span>1033</span>
              </li>
              <li>
                <div>
            
                  <span>Лотов:</span>
                </div>
                <span>336</span>
              </li>
              <li>
                <div>
                  <FiMessageCircle className='svg'/>
                  <span>Отзывов:</span>
                </div>
                <span>193</span>
              </li>
            </ul>
          </div>
        </Col>
        <Col xl={3} xxl={4}>
          <Row xs={2} xl={1} xxl={2} className='align-items-center mt-3 mt-xl-0'>
            <Col xs={3} xl={12} xxl={6}>
              <img src="imgs/qr-code.svg" alt="qr-code" className='qr-code'/>
            </Col>
            <Col xs={9} xl={12} xxl={6}>
              <Link to="/account/offers/add" className='post ms-auto'>
                <img src="imgs/icons/plusx2.png" alt="plusx2" />
                <div>Разместить объявление</div>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className='gy-5 mb-md-5'>
        <Col xs={12} xxl={9}>
          <h3 className='mb-4 mb-sm-5'>Основное</h3>
          <form action="">
            <Row xs={1} md={2} className='gx-xl-5 gy-5 gy-lg-0'>
              <Col>
               
                <label className='mb-3'>
                  <input type="checkbox" className='switch'/>
                  <span className='ms-3'>Получать уведомления на почту</span>
                </label>
                <label>
                  <input type="checkbox" className='switch'/>
                  <span className='ms-3'>Получать уведомления в Telegram</span>
                </label>
              </Col>
              <Col>
               
                <p className='rose'>Только верифицированные пользовтаели могут публиковать объявления на бирже Game.</p>
                <Link to="phone" className='btn-secondary mt-4'>Пройти верификацию</Link>
              </Col>
            </Row>
            <Link to="email" className='btn-primary mt-4'>Сохранить изменения</Link>
          </form>
        </Col>
        <Col xs={12} xxl={10}>
          <h3 className='mb-4 mb-sm-5'>Изменить пароль</h3>
          <form action="">

            <button type='submit' className='btn-primary mt-4'>Изменить</button>
          </form>
        </Col>
      </Row>
    </section>
  );
};

export default Profile;