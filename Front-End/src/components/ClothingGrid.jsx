import React from 'react';
import ClothingCard from './ClothingCard';
import './ClothingGrid.css';

const ClothingGrid = ({ items = [], renderItem }) => {
  return (
    <div className="clothing-grid">
      {items.length === 0 ? (
        <div>Loading...</div>
      ) : (
        items.map((item, index) =>
          renderItem ? renderItem(item) : <ClothingCard key={index} item={item} />
        )
      )}
    </div>
  );
};

export default ClothingGrid;