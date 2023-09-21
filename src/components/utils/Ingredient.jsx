import React from 'react';

const Ingredient = () => {
  return (
    <div className='ingredient'>
      <img src="/imgs/ingredients/olives.jpg" alt="Оливки" className='ingredient-img'/>
      <div className='ingredient-title'>Творожный сыр</div>
      <button type='button' className='btn-90'>x1</button>
      <button type='button' className='btn-90'>x2</button>
      <div className='ingredient-price'>+40&nbsp;₽</div>
    </div>
  );
};

export default Ingredient;