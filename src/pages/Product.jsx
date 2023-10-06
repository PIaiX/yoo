import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from '../components/ProductCard';
import SelectImitation from '../components/utils/SelectImitation';
import Ingredient from '../components/utils/Ingredient';
// swiper
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// icons & images
import Corner from '../components/svgs/Corner';
import { HiOutlineInformationCircle, HiOutlineShoppingBag, HiPlus, HiMinus } from "react-icons/hi2";
import NavTop from '../components/utils/NavTop';


const Product = () => {
  const [isRemove, setIsRemove] = useState(false);

  return (
    <main>
      <Container>
        <NavTop toBack={true} breadcrumbs={true}/>

        <form className='productPage mb-5'>
          <Row className='gx-4 gx-xxl-5'>
            <Col xs={12} lg={3}>
              <img src="/imgs/img3.png" alt="Четыре сыра" className='productPage-img'/>
            </Col>
            <Col xs={12} md={6} lg={5}>
              <div className="d-flex align-items-center justify-content-between justify-content-md-start mb-4">
                <h1 className='mb-0'>Четыре сыра</h1>
                <h6 className='gray mb-0 ms-3'>510гр</h6>
                <HiOutlineInformationCircle className='dark-gray fs-15 ms-2'/>
              </div>
              
              <p className='mb-2'>Состав:</p>
              <p>тесто, сыр блю чиз, смесь сыров чеддер и пармезан, моцарелла, фирменный соус альфредо</p>

              <h6 className='mt-4'>Тесто</h6>
              <div className="d-xxl-flex mb-4">
                <ul className='inputGroup'>
                  <li>
                    <label>
                      <input type="radio" name='param1'/>
                      <div className='text'>тонкое</div>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio" defaultChecked={true} name='param1'/>
                      <div className='text'>обычное</div>
                    </label>
                  </li>
                </ul>
                <ul className='inputGroup mt-2 mt-xxl-0 ms-xxl-5'>
                  <li>
                    <label>
                      <input type="radio" name='param2' defaultChecked={true}/>
                      <div className='text'>25см</div>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio" name='param2'/>
                      <div className='text'>30см</div>
                    </label>
                  </li>
                  <li>
                    <label>
                      <input type="radio" name='param2'/>
                      <div className='text'>36см</div>
                    </label>
                  </li>
                </ul>
              </div>
              
              <SelectImitation 
                boxClass={'main-color w-fit mb-4'}
                btnClass={'rounded-pill'}
                optionsArr={[
                  {
                    value: 1,
                    label: 'Сливочный соус',
                    defaultChecked: true,
                  },
                  {
                    value: 2,
                    label: 'Красный соус',
                    defaultChecked: false,
                  }
                ]}
              />

              <div className='productPage-price'>
                <div>
                  <div className='fs-12'>650 ₽</div>
                  <div className='gray fs-09 text-decoration-line-through'> 650 </div>
                </div>
                <button type='button' className='btn-secondary fs-12 rounded-pill ms-3'>
                  <span className='fw-4'>В корзину</span>
                  <HiOutlineShoppingBag className='fs-15 ms-2'/>
                </button>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4} className='mt-3mt-sm-4 mt-md-0'>
              <h6>Изменить по вкусу</h6>
              <div className="productPage-edit mb-3">
                <div className="top">
                  <button type='button' className={(isRemove) ? '' : 'active'} onClick={()=>setIsRemove(false)}>
                    <HiPlus/>
                    <span>Добавить</span>
                    <Corner className="corner-right" />
                  </button>
                  <button type='button' className={(isRemove) ? 'active' : ''} onClick={()=>setIsRemove(true)}>
                    <HiMinus/>
                    <span>Убрать</span>
                    <Corner className="corner-left" />
                    <Corner className="corner-right" />
                  </button>
                </div>
                {
                  (isRemove)
                  ? <div className="box">
                    <ul>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                    </ul>
                  </div>
                  : <div className="box">
                    <ul>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                      <li><Ingredient/></li>
                    </ul>
                  </div>
                }
              </div>
              {/* <Notice/> */}
            </Col>
          </Row>
        </form>

        <section className='d-none d-md-block mb-5'>
          <h2>Товары из этой категории</h2>
          <Swiper
            className=""
            modules={[Navigation]}
            spaceBetween={15}
            slidesPerView={2}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              576: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              992: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
          >
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
            <SwiperSlide>
              <ProductCard/>
            </SwiperSlide>
          </Swiper>
        </section>
      </Container>
    </main>
  );
};

export default Product;