import React from 'react';

const LiRequest = () => {
  return (
    <li>
      <div className='flex-1'>
        <p className='fw-6'>Обращение № 2657</p>
        <p className='text'>Здравствуйте! Все приех…</p>
      </div>
      <div className='d-flex flex-column justify-content-between align-items-end'>
        <div className='fs-09 gray'>11.03.23</div>
        <div className="indicator"></div> 
        {/* <div className="indicator active"></div>  */}
      </div>
    </li>
  );
};

export default LiRequest;