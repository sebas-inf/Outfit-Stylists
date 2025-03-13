import React from 'react';
import './Sidebar.css';

const Sidebar = ({
  isOpen,
  categories,
  selectedCategories,
  onToggleCategory,
  toggleSidebar
}) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h2>Filter by Category</h2>
      <ul>
        <li
          className={`sidebar-item ${selectedCategories.length === 0 ? 'selected' : ''}`}
          onClick={() => onToggleCategory('')}
        >
          <input
            id="checkbox-all"
            type="checkbox"
            checked={selectedCategories.length === 0}
            onChange={() => onToggleCategory('')}
            style={{ pointerEvents: 'none' }}
          />
          <button type="button" className="category-btn">
            All
          </button>
        </li>
        {categories.map((category) => (
          <li
            key={category}
            className={`sidebar-item ${selectedCategories.includes(category) ? 'selected' : ''}`}
            onClick={() => onToggleCategory(category)}
          >
            <input
              id={`checkbox-${category}`}
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => onToggleCategory(category)}
              style={{ pointerEvents: 'none' }}
            />
            <button type="button" className="category-btn">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
