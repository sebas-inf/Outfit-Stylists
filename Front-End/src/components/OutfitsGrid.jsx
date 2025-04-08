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
      .then((data) => setOutfits(data))
      .catch((err) => console.error('Error fetching outfits:', err));
    fetchClothingItems()
      .then((data) => setArticles(data))
      .catch((err) => console.error('Error fetching articles:', err));
  }, []);

  // When an outfit is clicked, navigate to the outfit detail page.
  const openOutfitDetail = (outfit) => {
    navigate(`/outfit/${outfit.id}`, { state: { outfit, articles } });
  };

  return (
    <>
      <Header />
      <PageTransition>
        <div className="outfits-container">
          <h2 className="outfits-heading">Outfits</h2>
          {outfits.length > 0 ? (
            <div className="outfits-grid">
              {outfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="outfit-wrapper"
                  onClick={() => openOutfitDetail(outfit)}
                >
                  <OutfitCard outfit={outfit} articles={articles} />
                </div>
              ))}
            </div>
          ) : (
            <p>No outfits available.</p>
          )}
        </div>
      </PageTransition>
    </>
  );
};

export default OutfitsGrid;
