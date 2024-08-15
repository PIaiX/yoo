import React from 'react';

const Notice = (props) => {
  return (
    <div className={'notice '+props.className}>
      <p>Все фото носят рекламный характер. Готовое блюдо может отличаться от фотографии.</p>
    </div>
  );
};

export default Notice;