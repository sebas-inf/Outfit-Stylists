import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OutfitCard from './OutfitCard';
import { fetchOutfits, fetchClothingItems } from '../api';
import Header from './Header';
import PageTransition from './PageTransition';
import './OutfitsGrid.css';

const OutfitsGrid = () => {
  const [outfits, setOutfits] = useState([]);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutfits()
      .then(data => setOutfits(data))
      .catch(err => console.error('Error fetching outfits:', err));
    fetchClothingItems()
      .then(data => setArticles(data))
      .catch(err => console.error('Error fetching articles:', err));
  }, []);

  const openOutfitDetail = (outfit) => {
    navigate(`/outfit/${outfit.id}`, { state: { outfit, articles } });
  };

  const renderOutfitList = () => {
    const outfitComponents = [];
    for (let i = 0; i < outfits.length; i++) {
      const outfit = outfits[i];
      outfitComponents.push(
        <div
          key={outfit.id}
          className="outfit-wrapper"
          onClick={() => openOutfitDetail(outfit)}
        >
          <OutfitCard outfit={outfit} articles={articles} />
        </div>
      );
    }
    return outfitComponents;
  };

  return (
    <>
      <Header />
      <PageTransition>
        <div className="outfits-container">
          <h2 className="outfits-heading">Outfits</h2>
          <div className="outfits-grid">
            {renderOutfitList()}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default OutfitsGrid;
