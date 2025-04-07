// src/components/OutfitDetail.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClothingCard from './ClothingCard';
import PageTransition from './PageTransition';
import Header from './Header';

const OutfitDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { outfit, articles } = state || {};

  if (!outfit) return <div>No outfit selected.</div>;

  // Filter articles based on the outfit's required and optional article IDs.
  const requiredArticles = articles.filter(article =>
    outfit.required_articles.includes(article.id)
  );
  const optionalArticles =
    (outfit.optional_articles || []).length > 0
      ? articles.filter(article =>
          outfit.optional_articles.includes(article.id)
        )
      : [];

  return (
    <PageTransition>
      <Header />
      <div style={{ padding: '20px' }}>
        <button onClick={() => navigate(-1)}>Back</button>
        <h2>{outfit.name}</h2>
        <p>{outfit.description}</p>
        <h3>Required Articles</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}
        >
          {requiredArticles.map((article, index) => (
            <ClothingCard key={index} item={article} />
          ))}
        </div>
        {optionalArticles.length > 0 && (
          <>
            <h3>Optional Articles</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}
            >
              {optionalArticles.map((article, index) => (
                <ClothingCard key={index} item={article} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default OutfitDetail;
