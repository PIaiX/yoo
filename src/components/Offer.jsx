import React from 'react';
import {Link} from 'react-router-dom';

const Offer = ({img = "/imgs/img.jpg" , title = "акция"}) => {
  return (
    <figure className='offer'>
      <img src={img} alt={title} />
      <figcaption>
        {/* <div>
          <h4 className={(props.blackText) ? 'black' : ''}>{props.title}</h4>
          <h6 className={(props.blackText) ? 'black fw-4' : 'fw-4'}>{props.subtitle}</h6>
        </div> */}
        <Link to='/promo/1' className='btn-light'>Заказать</Link>
      </figcaption>
    </figure>
  );
};

export default Offer;