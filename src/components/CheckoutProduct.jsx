import React from 'react';

const CheckoutProduct = () => {
  return (
    <div className='checkoutProduct'>
      <img src="/imgs/img.jpg" alt="Lorem ipsum dolor sit amet"/>
      <div className='flex-1'>
        <h6>Lorem ipsum dolor sit amet</h6>
        <div className='d-flex align-items-center justify-content-end'>
          <p className='fw-6 fs-11'>1 540 ₽</p>
          <p className='checkoutProduct-count'>х1</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;