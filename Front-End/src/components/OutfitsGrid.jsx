import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OutfitCard from './OutfitCard';
import { fetchOutfits, fetchClothingItems } from '../api';
import PageTransition from './PageTransition';
import Header from './Header';

const OutfitsGrid = () => {
  const [outfits, setOutfits] = useState([]);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutfits()
      .then(data => setOutfits(data))
      .catch(err => console.error(err));
    fetchClothingItems()
      .then(data => setArticles(data))
      .catch(err => console.error(err));
  }, []);

  const openOutfitDetail = (outfit) => {
    navigate(`/outfit/${outfit.id}`, { state: { outfit, articles } });
  };

  return (
    <>
    <Header />
    <PageTransition>
      <div style={{ padding: '20px' }}>
      <h2 style={{ paddingTop: '20px' }}>Outfits</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}
        >
          {outfits.map((outfit) => (
            <div key={outfit.id} onClick={() => openOutfitDetail(outfit)}>
              <OutfitCard outfit={outfit} articles={articles} />
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
    </>
  );
};

export default OutfitsGrid;
