import React from 'react';
import Categories from '../components/Categories';
import Notice from '../components/Notice';
import CategoryGroup from '../components/CategoryGroup';


const Catalog = () => {
  return (
    <main>
      <section className='container'>
        <Notice/>
        <img src="/imgs/Rectangle.png" alt="Rectangle" className='img-fluid mb-3 mb-sm-4' />
      </section>
      <section className='sec-5 container mb-5'>
        <div className="sticky-box mb-3 mb-sm-4 mb-md-5">
          <Categories/>
        </div>

        <div className="categories-box">
          <CategoryGroup/>
          <CategoryGroup/>
        </div>
      </section>
    </main>
  );
};

export default Catalog;