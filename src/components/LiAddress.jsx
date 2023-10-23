import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Map from './svgs/Map';
import Trash from './svgs/Trash';

const LiAddress = memo(({ data }) => {
  return (
    <li>
      <div className="d-flex align-items-center">
        <Map className="fs-15 sky me-3" />
        <p>{data?.full}</p>
      </div>
      <div className='d-flex align-items-center justify-content-end mt-2 mt-sm-0 ms-sm-4'>
        <Link to='edit' className='green fs-09'>Изменить</Link>
        <button type='button' className='dark-gray fs-12 ms-4'><Trash/></button>
      </div>
    </li>
  );
});

export default LiAddress;
