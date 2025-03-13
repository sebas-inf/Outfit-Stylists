import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClothingItemByName } from '../api';
import Header from './Header';

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
      <div className="clothing-detail" style={{ padding: '20px' }}>
        <img
          src={`data:image/jpeg;base64,${item.photo}`}
          alt={item.name}
          style={{ width: '300px', height: 'auto' }}
        />
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p>Category: {item.category}</p>
        <p>Main Material: {item.mainmaterial}</p>
        <p>Main Color: {item.maincolor}</p>
        <p>Usage: {item.usage}</p>
      </div>
    </>
  );
};

export default ClothingDetail;
