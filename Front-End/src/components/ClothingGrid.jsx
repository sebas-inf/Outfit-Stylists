import React from 'react';
import ClothingCard from './ClothingCard';
import './ClothingGrid.css';

const ClothingGrid = ({ items = [] }) => {
  return (
    <div className="clothing-grid">
      {items.length === 0 ? (
        <div>No items to display.</div>
      ) : (
        items.map((item, index) => <ClothingCard key={index} item={item} />)
      )}
    </div>
  );
};

export default ClothingGrid;
