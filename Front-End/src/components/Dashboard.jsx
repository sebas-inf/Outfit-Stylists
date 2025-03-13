// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ClothingGrid from './ClothingGrid';
import AddItemSidebar from './AddItemSidebar';
import { fetchClothingItems } from '../api';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  useEffect(() => {
    fetchClothingItems()
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
      })
      .catch((error) => console.error('Error fetching items:', error));
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

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleAddItemSidebar = () => {
    setIsAddItemOpen(prev => !prev);
  };

  const handleToggleCategory = (category) => {
    if (category === '') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    }
  };

  const uniqueCategories = Array.from(new Set(items.map(item => item.category)));

  return (
    <>
      <Header 
        toggleSidebar={toggleSidebar} 
        toggleAddItem={toggleAddItemSidebar} 
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        categories={uniqueCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        toggleSidebar={toggleSidebar}
      />
      <AddItemSidebar 
        isOpen={isAddItemOpen}
        toggleAddItemSidebar={toggleAddItemSidebar}
      />
      <ClothingGrid items={filteredItems} />
    </>
  );
};

export default Dashboard;
