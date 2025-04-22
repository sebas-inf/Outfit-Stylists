import React from 'react';
import ClothingCard from './ClothingCard';
import './ClothingGrid.css';
import { motion } from 'framer-motion';

const ClothingGrid = ({ items = [], renderItem }) => {
  return (
    <div className="clothing-grid">
      {items.length === 0 ? (
        <div>...</div>
      ) : (
        items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            {renderItem ? renderItem(item, index) : <ClothingCard item={item} />}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ClothingGrid;
