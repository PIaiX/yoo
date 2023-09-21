import React from 'react';

const CheckoutProduct = () => {
  return (
    <div className='checkoutProduct'>
      <img src="/imgs/img3.png" alt="Ролл «Филадельфия»"/>
      <div className='flex-1'>
        <h6>Ролл «Филадельфия»</h6>
        <div className='d-flex align-items-center'>
          <p>240 г</p>
          <p className='ms-auto'>1 540 ₽</p>
          <p className='checkoutProduct-count'>х1</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;