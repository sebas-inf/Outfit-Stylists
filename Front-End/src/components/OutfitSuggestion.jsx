import React, { useState, useEffect } from 'react'; // Import useEffect
import { getOutfitSuggestions, fetchClothingItems } from '../api'; // Import fetchClothingItems
import Header from './Header';
import './OutfitSuggestion.css';

const OutfitSuggestion = () => {
  const [location, setLocation] = useState(''); // for user location
  const [weather, setWeather] = useState(''); // what the weather is
  const [withImages, setWithImages] = useState(true); // show images or not?
  const [suggestions, setSuggestions] = useState(null); // the suggestions we get back
  const [loading, setLoading] = useState(false); // show loading spinner for suggestions
  const [error, setError] = useState(null); // if something went wrong with suggestions

  // State for wardrobe items
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [wardrobeLoading, setWardrobeLoading] = useState(false);
  const [wardrobeError, setWardrobeError] = useState(null);

  // Effect to load wardrobe items on mount
  useEffect(() => {
    const loadWardrobe = async () => {
      setWardrobeLoading(true);
      setWardrobeError(null);
      try {
        const items = await fetchClothingItems(); // Fetch items from API
        setWardrobeItems(items || []); // Ensure it's an array
      } catch (err) {
        console.error("Error fetching wardrobe items:", err); // Log error
        setWardrobeError(err.message || "Failed to load wardrobe.");
      } finally {
        setWardrobeLoading(false);
      }
    };
    loadWardrobe();
  }, []); // Empty dependency array means run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if wardrobe is ready before proceeding
    if (wardrobeLoading) {
      setError("Wardrobe is still loading. Please wait.");
      return;
    }
    if (wardrobeError) {
      setError(`Cannot suggest outfit due to wardrobe error: ${wardrobeError}`);
      return;
    }
    if (!Array.isArray(wardrobeItems)) {
      setError("Wardrobe data is not available or invalid.");
      console.error("Wardrobe items is not an array:", wardrobeItems); // Log for debugging
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions(null);

    // Construct owned items string from fetched wardrobe data
    const ownedItemsString = wardrobeItems.map(item => item.name).join(', ') || 'nothing specific'; // Handle empty wardrobe
    const prompt = `I live in ${location}, it's ${weather}; I own ${ownedItemsString}.`;
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

        {/* Wardrobe loading/error messages */}
        {wardrobeLoading && <p>Loading your wardrobe...</p>}
        {wardrobeError && <p className="error-message">Wardrobe Error: {wardrobeError}</p>}

        {/* Suggestion loading/error messages */}
        {loading && <p>Loading suggestions...</p>}
        {error && <p className="error-message">Suggestion Error: {error}</p>}

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
                    {/* loop through items in category - removed filter, added conditional rendering */}
                    {items.map((item, index) => (
                      <div key={index} className="suggestion-item">
                        {withImages ? (
                          // Render with image (item is object)
                          <>
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
                          </>
                        ) : (
                          // Render without image (item is string)
                          <p>{item}</p>
                        )}
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