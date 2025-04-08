import React from 'react';
import OutfitCard from './OutfitCard';
import './OutfitsGrid.css';

const OutfitList = ({ outfits, onSelectOutfit, articles }) => {
  return (
    <div className="outfits-grid">
      {outfits.map((outfit) => (
        <div
          key={outfit.id}
          className="outfit-wrapper"
          onClick={() => onSelectOutfit(outfit)}
        >
          <OutfitCard outfit={outfit} articles={articles} />
        </div>
      ))}
    </div>
  );
};

export default OutfitList;
