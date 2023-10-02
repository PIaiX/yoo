import React, { memo } from 'react';
import {Link} from 'react-router-dom';

const CategoryCard = memo(({data}) => {
  return (
    <figure className='category-card'>
      <img src={data.imgLink} alt={data.title} />
      <figcaption>
        <h6>
          <Link to='/category' className="stretched-link">{data.title}</Link>
        </h6>
      </figcaption>
    </figure>
  );
});

export default CategoryCard;