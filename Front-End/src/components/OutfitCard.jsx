import React from 'react';
import './OutfitCard.css';

const OutfitCard = ({ outfit, articles }) => {
  const articleMap = {};
  articles.forEach((article) => {
    articleMap[article.id] = article;
  });
  const images = (outfit.required_articles || [])
    .map((id) => articleMap[id]?.photo)
    .filter(Boolean);
  const collageImages = images.slice(0, 4);

  return (
    <div className="outfit-card">
      <div className="outfit-collage">
        {collageImages.map((img, index) => (
          <img key={index} src={`data:image/jpeg;base64,${img}`} alt={`Outfit part ${index + 1}`} />
        ))}
      </div>
      <div className="outfit-name">
        {outfit.name}
      </div>
    </div>
  );
};

export default OutfitCard;
