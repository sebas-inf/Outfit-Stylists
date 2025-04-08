import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClothingCard from './ClothingCard';
import Header from './Header';
import { createOutfit } from '../api';
import './OutfitForm.css';

const OutfitForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { selectedItems = [] } = state || {};

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter an outfit name.");
      return;
    }
    const outfitData = {
      data: {
        name,
        description,
        required_articles: selectedItems.map(item => item.id),
        optional_articles: []
      }
    };
    try {
      await createOutfit(outfitData);
      navigate('/outfits', { state: {} });
    } catch (error) {
      console.error("Error creating outfit:", error);
      alert("There was an error creating the outfit. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className="outfit-form-container">
        <div className="outfit-form-header">
          <h2>Create Outfit</h2>
          <button onClick={handleSubmit} className="confirm-button">
            Confirm Outfit
          </button>
        </div>
        <form onSubmit={handleSubmit} className="outfit-form">
          <input
            type="text"
            placeholder="Outfit Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Outfit Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>
        <h3>Selected Items</h3>
        <div className="selected-items-grid">
          {selectedItems.map(item => (
            <div key={item.id} className="selected-item-card">
              <ClothingCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutfitForm;
