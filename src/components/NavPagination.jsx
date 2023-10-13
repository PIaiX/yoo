import React from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const NavPagination = () => {
  return (
    <nav className='pagination'>
      <div className="d-flex align-items-center">
        <button type='button' disabled className='fs-14 p-2 d-flex'>
          <FiChevronLeft/>
        </button>
        <span className='mx-3'>6–10 из 11</span>
        <button type='button' className='fs-14 p-2 d-flex'>
          <FiChevronRight/>
        </button>
      </div>
      <div className="d-flex align-items-center ms-5">
        <span className='d-none d-sm-inline me-3'>Страницы:</span>
        <select name="" id="" defaultValue={'1'}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="1">8</option>
          <option value="1">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
        </select>
      </div>
    </nav>
  );
};

export default NavPagination;