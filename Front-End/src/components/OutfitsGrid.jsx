// src/components/OutfitsGrid.jsx
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

  // Fetch outfits and articles when the component mounts.
  useEffect(() => {
    fetchOutfits()
      .then(data => setOutfits(data))
      .catch(err => console.error('Error fetching outfits:', err));
    fetchClothingItems()
      .then(data => setArticles(data))
      .catch(err => console.error('Error fetching articles:', err));
  }, []);

  // Function to navigate to outfit detail page.
  const openOutfitDetail = (outfit) => {
    navigate(`/outfit/${outfit.id}`, { state: { outfit, articles } });
  };

  // Grab the first outfit if it exists.
  const firstOutfit = outfits.length > 0 ? outfits[0] : null;

  return (
    <>
      <Header />
      <PageTransition>
        <div className="outfits-container" style={{ padding: '20px' }}>
          <h2 style={{ padding: '20px 0', textAlign: 'left' }}>Outfits</h2>
          {firstOutfit ? (
            <div 
              className="outfit-wrapper" 
              onClick={() => openOutfitDetail(firstOutfit)}
              style={{ cursor: 'pointer' }}
            >
              <OutfitCard outfit={firstOutfit} articles={articles} />
            </div>
          ) : (
            <p>No outfit available.</p>
          )}
        </div>
      </PageTransition>
    </>
  );
};

export default OutfitsGrid;
