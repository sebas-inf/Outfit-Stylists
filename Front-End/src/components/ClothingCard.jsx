import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClothingCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      className="clothing-card"
      onClick={() => navigate(`/clothing/${encodeURIComponent(item.name)}`)}
      style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px' }}
    >
      <img
        src={`data:image/jpeg;base64,${item.photo}`}
        alt={item.name}
        style={{ width: '100%', height: 'auto' }}
      />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  );
};

export default ClothingCard;
