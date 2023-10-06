import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import NavTop from '../components/utils/NavTop';
import jsonData from "../data/categories";
import CategoryCard from '../components/CategoryCard';
import {Link} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SwiperButtonNext from '../components/utils/SwiperButtonNext';
import SwiperButtonPrev from '../components/utils/SwiperButtonPrev';
import ProductCard from '../components/ProductCard';
import MultyRangeCustom from "../components/utils/MultyRangeCustom";

const Catalog = () => {
  return (
    <main>
      <section className='category mb-5'>
        <Container>
          <NavTop toBack={true} breadcrumbs={true}/>
          <Swiper
            className='category-topSlider mb-5'
            spaceBetween={15}
            slidesPerView={6}
            speed={750}
            breakpoints={{
              576: {
                spaceBetween: 20,
                slidesPerView: 'auto',
              },
              992: {
                slidesPerView: 6,
                spaceBetween: 16,
              },
            }}
          >
            {
              (jsonData).map(obj => {
                return <SwiperSlide key={obj.id}>
                  <CategoryCard data={obj}/>
                </SwiperSlide>
              })
            }
            <SwiperButtonPrev/>
            <SwiperButtonNext/>
          </Swiper>

          <h1 className='mb-5'>Подарки на день рождения</h1>
          <Row className='gx-5 mb-5'>
            <Col lg={3} className='position-relative'>
              <form action="" className='filter'>
                <fieldset>
                  <legend>Цена, ₽</legend>
                  <MultyRangeCustom 
                    minRange="0" 
                    maxRange="1000"
                    valueMin="150"
                    valueMax="650" 
                  />
                </fieldset>
                <fieldset>
                  <legend>Характеристика 1</legend>
                  <select className='w-100 mb-2'>
                    <option value="1">Значение 1</option>
                    <option value="2">Значение 2</option>
                    <option value="3">Значение 3</option>
                  </select>
                </fieldset>

                <Accordion defaultActiveKey="0">
                  <Accordion.Item as="fieldset" eventKey="0">
                    <Accordion.Header as="legend">Характеристика</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 1</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 2</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 3</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 4</span>
                          </label>
                        </li>
                      </ul>
                      <button type="button" className="more">показать все</button>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item as="fieldset" eventKey="1">
                    <Accordion.Header as="legend">Параметр 3</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 1</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 2</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 3</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 4</span>
                          </label>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item as="fieldset" eventKey="2">
                    <Accordion.Header as="legend">Параметр 4</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 1</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 2</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 3</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 4</span>
                          </label>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item as="fieldset" eventKey="3">
                    <Accordion.Header as="legend">Параметр 5</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 1</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 2</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 3</span>
                          </label>
                        </li>
                        <li>
                          <label>
                            <input type="checkbox"/>
                            <span>Значение 4</span>
                          </label>
                        </li>
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </form>
            </Col>
            <Col lg={9}>
              <div className='d-flex justify-content-between align-items-center mb-5'>
                <Swiper
                  className='subcategories-slider'
                  spaceBetween={10}
                  slidesPerView={'auto'}
                  speed={750}
                  breakpoints={{
                    576: {
                      spaceBetween: 15,
                    },
                    992: {
                      spaceBetween: 20,
                    },
                  }}
                >
                  <SwiperSlide>
                    <Link to="">Подкатегория</Link>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Link to="">Подкатегория</Link>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Link to="">Подкатегория</Link>
                  </SwiperSlide>
                </Swiper>
                <select className=''>
                  <option value="">Рекомендуем</option>
                  <option value="">Рекомендуем</option>
                  <option value="">Рекомендуем</option>
                </select>
              </div>
              <Row lg={4} className='gx-4 gy-5'>
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
            </Col>
          </Row>

          <h5>Загловок для сео</h5>
          <hr />
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
          <button type='button' className='secondary mt-3'>показать полностью</button>
        </Container>

        {/* <div className="sticky-box mb-3 mb-sm-4 mb-md-5">
          <Categories/>
        </div> */}
        {/* <div className="categories-box">
          <CategoryGroup/>
          <CategoryGroup/>
        </div> */}
      </section>
    </main>
  );
};

export default Catalog;