import React, { useEffect, useState } from 'react';
import ClothingCard from './ClothingCard';
import { fetchClothingItems } from '../api';

const ClothingGrid = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchClothingItems()
      .then(data => {
        console.log("Fetched items:", data);
        setItems(data);
      })
      .catch(error => console.error('Error fetching wardrobe items:', error));
  }, []);

  if (items.length === 0) {
    return <div>No items to display.</div>;
  }

  return (
    <div
      className="clothing-grid"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}
    >
      {items.map((item, index) => (
        <ClothingCard key={index} item={item} />
      ))}
    </div>
  );
};

export default ClothingGrid;
