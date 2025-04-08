// src/components/ClothingDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClothingItemByName } from '../api';
import Header from './Header';
import './ClothingDetail.css';

const ClothingDetail = () => {
  const { name } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchClothingItemByName(decodeURIComponent(name))
      .then(data => setItem(data))
      .catch(error => console.error('Error fetching item:', error));
  }, [name]);

  if (!item) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="clothing-detail-container">
        <img
          className="clothing-detail-image"
          src={`data:image/jpeg;base64,${item.photo}`}
          alt={item.name}
        />
        <h2 className="clothing-detail-name">{item.name}</h2>
        <p className="clothing-detail-description">{item.description}</p>
        <div className="clothing-detail-info">
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Main Material:</strong> {item.mainmaterial}</p>
          <p><strong>Main Color:</strong> {item.maincolor}</p>
          <p><strong>Usage:</strong> {item.usage}</p>
        </div>
      </div>
    </>
  );
};

export default ClothingDetail;
