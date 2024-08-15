import React from 'react';

const ManagerMessage = (props) => {
  return (
    <div className="chat-message manager">
      <img src="imgs/avatar.jpg" alt="avatar" className='avatar'/>
      <div className='flex-1'>
        <div className="d-flex justify-content-between align-items-center">
          <p className='fw-6'>Менеджер Алия</p>
          <time>{props.time}</time>
        </div>
        <div className="bubble">
          {props.text}
        </div>
      </div>
    </div>
  );
};

export default ManagerMessage;