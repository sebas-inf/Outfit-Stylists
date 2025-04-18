import React, { useState } from 'react';
import { getOutfitSuggestions } from '../api';
import Header from './Header'; 
import './OutfitSuggestion.css'; 

const OutfitSuggestion = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');
  const [ownedItems, setOwnedItems] = useState('');
  const [withImages, setWithImages] = useState(true); 
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestions(null);

    const prompt = `I live in ${location}, it's ${weather}; I own ${ownedItems}.`;
    const promptData = { prompt, with_images: withImages };

    try {
      const result = await getOutfitSuggestions(promptData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuggestions(result);
      }
    } catch (err) {
      console.error("Error fetching outfit suggestions:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="suggestion-container">
        <h2>Get Outfit Suggestion</h2>
        <form onSubmit={handleSubmit} className="suggestion-form">
          <input
            type="text"
            placeholder="Your Location (e.g., Austin, TX)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Current Weather (e.g., 85°F and sunny)"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            required
          />
          <textarea
            placeholder="Owned Clothing Items (e.g., blue jeans, white sneakers)"
            value={ownedItems}
            onChange={(e) => setOwnedItems(e.target.value)}
            required
          />
          <div className="image-toggle">
            <label>
              <input
                type="checkbox"
                checked={withImages}
                onChange={(e) => setWithImages(e.target.checked)}
              />
              Include Images (may take longer)
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Getting Suggestion...' : 'Suggest Outfit'}
          </button>
        </form>

        {loading && <p>Loading suggestions...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        {suggestions && (
          <div className="suggestions-display">
            <h3>Suggested Outfit:</h3>
            {Object.entries(suggestions).map(([category, items]) => (
              <div key={category} className="suggestion-category">
                <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                {items.length > 0 ? (
                  <div className="suggestion-items">
                    {items.map((item, index) => (
                      <div key={index} className="suggestion-item">
                        {item.image_b64 ? (
                          <img
                            src={`data:image/png;base64,${item.image_b64}`}
                            alt={item.name}
                            className="suggestion-item-image"
                          />
                        ) : (
                          <div className="suggestion-item-no-image">No Image</div>
                        )}
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No suggestions for {category}.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitSuggestion;
