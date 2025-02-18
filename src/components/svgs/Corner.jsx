import React from 'react';

const Corner = (props) => {
  return (
    <svg className={props.className} width="1em" height="1em" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M50 50H0V0C0 27.6142 22.3858 50 50 50Z" fill="currentColor"/>
    </svg>
  );
};

export default Corner;