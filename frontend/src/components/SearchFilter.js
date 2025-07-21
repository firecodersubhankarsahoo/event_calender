import React, { useState, useEffect } from 'react';
import { EVENT_CATEGORIES } from '../utils/dateUtils';

const SearchFilter = ({ onSearch, searchQuery, selectedCategory }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(localSearchQuery, localSelectedCategory);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, localSelectedCategory, onSearch]);

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setLocalSelectedCategory(e.target.value);
  };

  const handleClearFilters = () => {
    setLocalSearchQuery('');
    setLocalSelectedCategory('');
  };

  return (
    <div className="search-filter-bar">
      <div className="row g-3 align-items-center">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search events..."
              value={localSearchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className="col-md-4">
          <select
            className="form-select"
            value={localSelectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {EVENT_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={handleClearFilters}
            disabled={!localSearchQuery && !localSelectedCategory}
          >
            <i className="bi bi-x-circle me-1"></i>
            Clear
          </button>
        </div>
      </div>
      
      {(localSearchQuery || localSelectedCategory) && (
        <div className="mt-2">
          <small className="text-muted">
            {localSearchQuery && (
              <span className="me-3">
                <i className="bi bi-search me-1"></i>
                Searching: "{localSearchQuery}"
              </span>
            )}
            {localSelectedCategory && (
              <span>
                <i className="bi bi-tag me-1"></i>
                Category: {localSelectedCategory}
              </span>
            )}
          </small>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
