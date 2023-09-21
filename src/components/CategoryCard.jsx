import React from 'react';
import {Link} from 'react-router-dom';

const CategoryCard = () => {
  return (
    <figure className='category-card'>
      <img src="/imgs/img2.png" alt="Роллы" />
      <figcaption>
        <h6><Link to='/menu' className="stretched-link">Роллы</Link></h6>
      </figcaption>
    </figure>
  );
};

export default CategoryCard;