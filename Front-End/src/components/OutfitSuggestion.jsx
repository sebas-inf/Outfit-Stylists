import React, { useState } from 'react';
import { getOutfitSuggestions } from '../api';
import Header from './Header'; 
import './OutfitSuggestion.css';

const OutfitSuggestion = () => {
  const [location, setLocation] = useState(''); // for user location
  const [weather, setWeather] = useState(''); // what the weather is
  const [ownedItems, setOwnedItems] = useState(''); // what clothes they have
  const [withImages, setWithImages] = useState(true); // show images or not?
  const [suggestions, setSuggestions] = useState(null); // the suggestions we get back
  const [loading, setLoading] = useState(false); // show loading spinner
  const [error, setError] = useState(null); // if something went wrong

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestions(null);

    const prompt = `I live in ${location}, it's ${weather}; I own ${ownedItems}.`;
    const promptData = { prompt, with_images: withImages };

    try {
      const result = await getOutfitSuggestions(promptData);
      // check result ok?
      if (result && result.error) {
        setError(result.error);
      } else if (result) {
        setSuggestions(result);
      } else {
        setSuggestions(null);
      }
    } catch (err) {
      // console.error("Error fetching outfit suggestions:", err); // maybe log this later?
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
        {/* the main form for input */}
        <form onSubmit={handleSubmit} className="suggestion-form">
          {/* get location */}
          <input
            type="text"
            placeholder="Your Location (e.g., Austin, TX)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          {/* get weather */}
          {/* TODO make weather input better? */}
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
          {/* checkbox for images */}
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
          {/* submit button */}
          <button type="submit" disabled={loading}>
            {loading ? 'Getting Suggestion...' : 'Suggest Outfit'}
          </button>
        </form>

        {loading && <p>Loading suggestions...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        {/* show the suggestions here if we have them */}
        {suggestions && (
          <div className="suggestions-display">
            <h3>Suggested Outfit:</h3>
            {/* loop through each category */}
            {Object.entries(suggestions).map(([category, items]) => (
              <div key={category} className="suggestion-category">
                {/* show category name */}
                <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                {/* check if items is array */}
                {Array.isArray(items) && items.length > 0 ? (
                  <div className="suggestion-items">
                    {/* loop through items in category */}
                    {items.filter(item => item && item.name).map((item, index) => (
                      <div key={index} className="suggestion-item">
                        {/* show item image */}
                        {item.image_b64 ? (
                          <img
                            src={`data:image/png;base64,${item.image_b64}`}
                            alt={item.name}
                            className="suggestion-item-image"
                          />
                        ) : (
                          <div className="suggestion-item-no-image">No Image</div>
                        )}
                        {/* show item name */}
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
