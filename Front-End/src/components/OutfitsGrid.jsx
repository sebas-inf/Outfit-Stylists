import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OutfitCard from './OutfitCard';
import { fetchOutfits, fetchClothingItems } from '../api';
import Header from './Header';
import PageTransition from './PageTransition';
import './OutfitsGrid.css';

const OutfitsGrid = () => {
  const [outfits, setOutfits] = useState([]);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  // Fetch the outfits and articles when the component mounts.
  useEffect(() => {
    fetchOutfits()
      .then((data) => setOutfits(data))
      .catch((err) => console.error('Error fetching outfits:', err));
    fetchClothingItems()
      .then((data) => setArticles(data))
      .catch((err) => console.error('Error fetching articles:', err));
  }, []);

  // Function to navigate to the outfit detail page.
  const openOutfitDetail = (outfit) => {
    navigate(`/outfit/${outfit.id}`, { state: { outfit, articles } });
  };

  return (
    <>
      <Header />
      <PageTransition>
        <div className="outfits-container" style={{ padding: '20px' }}>
          <h2 className="outfits-heading" style={{ padding: '20px 0', textAlign: 'left' }}>
            Outfits
          </h2>
          <div className="outfits-grid">
            {outfits.length === 0 ? (
              <div>...</div>
            ) : (
              outfits.map((outfit, index) => (
                <motion.div
                  key={outfit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="outfit-wrapper"
                  onClick={() => openOutfitDetail(outfit)}
                  style={{ cursor: 'pointer' }}
                >
                  <OutfitCard outfit={outfit} articles={articles} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default OutfitsGrid;
