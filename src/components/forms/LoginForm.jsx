import React from 'react';
import {Link} from 'react-router-dom';

const LoginForm = () => {
  return (
    <form action="" className='login-form'>
      <h4 className='main-color text-center fw-6'>С возвращением!</h4>
      <p className='text-center fs-11 mb-5'>Вкусные роллы и пицца скучали по тебе</p>

      <p className='fs-11 mb-1'>Email</p>
      <input type="email" placeholder='Email'/>
      {/* <button type='submit' className='btn-primary rounded-3 mt-4 mx-auto'>Войти</button> */}
      <Link to='/account' className='btn-primary w-md-100 rounded-3 mt-4 mx-auto'>Войти</Link>
    </form>
  );
};

export default LoginForm;