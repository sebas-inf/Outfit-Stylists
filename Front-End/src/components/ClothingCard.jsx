import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClothingCard.css';

const ClothingCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      className="clothing-card"
      onClick={() => navigate(`/clothing/${encodeURIComponent(item.name)}`)}
    >
      <img src={`data:image/jpeg;base64,${item.photo}`} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  );
};

export default ClothingCard;
