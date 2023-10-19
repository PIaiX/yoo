import React from 'react';
import {Link} from 'react-router-dom';
import PrevIcon from './svgs/PrevIcon';

const AccountTitleReturn = (props) => {
  return (
    <div className={"d-flex align-items-center flex-wrap mb-4 "+props.className}>
      <Link to={props.link} className='link-return'>
        <PrevIcon/>
      </Link>
      <h5 className='fw-6 mb-0'>{props.title}</h5>
    </div>
  );
};

export default AccountTitleReturn;