import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?text=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-1">
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input
          name="search"
          type="search"
          placeholder="найти что-то вкусное"
          className="search-input"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={searchQuery}
        />
      </div>
    </div>
  );
};

export default SearchInput;