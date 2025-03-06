import React, { useEffect, useState } from 'react';
import ClothingCard from './ClothingCard';
import { fetchClothingItems } from '../api';
import Sidebar from './Sidebar';
import { CSSTransition } from 'react-transition-group';

const ClothingGrid = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchClothingItems()
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch((error) =>
        console.error('Error fetching wardrobe items:', error)
      );
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => selectedCategories.includes(item.category))
      );
    }
  }, [selectedCategories, items]);

  const uniqueCategories = Array.from(new Set(items.map(item => item.category)));

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleToggleCategory = (category) => {
    if (category === '') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev => {
        if (prev.includes(category)) {
          return prev.filter(c => c !== category);
        } else {
          return [...prev, category];
        }
      });
    }
  };

  return (
    <div>
      <button onClick={toggleSidebar} style={{ margin: '10px' }}>
        Categories
      </button>
      <CSSTransition
        in={isSidebarOpen}
        timeout={300}
        classNames="sidebar"
        unmountOnExit
      >
        <Sidebar
          categories={uniqueCategories}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </CSSTransition>
      <div
        className="clothing-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          padding: '20px'
        }}
      >
        {filteredItems.length === 0 && <div>No items to display.</div>}
        {filteredItems.map((item, index) => (
          <ClothingCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ClothingGrid;
