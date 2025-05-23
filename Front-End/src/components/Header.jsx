
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth';
import './Header.css';

const Header = ({
  toggleSidebar,
  toggleAddItem,
  isAddingItem,
  isCreatingOutfit,
  toggleOutfitCreation,
  confirmOutfit
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLoggedIn } = useAuth();

  const handleOutfitButtonClick = () => {
    if (location.pathname !== '/home') {
      navigate('/home', { state: { startOutfitCreation: true } });
    } else {
      toggleOutfitCreation();
    }
  };

  const handleAddItemClick = () => {
    if (location.pathname !== '/home') {
      navigate('/home', { state: { startAddItem: true } });
    } else {
      toggleAddItem();
    }
  };

  return (
    <nav className="header-nav">
      <div className="header-left">
        <button onClick={() => navigate('/home', { state: {} })} className="header-button">
          Home
        </button>
        <button onClick={() => navigate('/outfits')} className="header-button">
          Outfits
        </button>
        <button onClick={toggleSidebar} className="header-button">
          Categories
        </button>
        
        <button onClick={() => navigate('/weather')} className="header-button">
          Weather
        </button>
        <button onClick={() => navigate('/suggest-outfit')} className="header-button"> {}
          Suggest Outfit
        </button>
      </div>
      <div className="header-right">
        {isCreatingOutfit && (
          <button onClick={confirmOutfit} className="header-button confirm-button">
            Confirm Outfit
          </button>
        )}
        <button onClick={handleOutfitButtonClick} className="header-button">
          {isCreatingOutfit ? 'Cancel Outfit' : 'Create Outfit'}
        </button>
        <button onClick={handleAddItemClick} className="header-button">
          {isAddingItem ? 'Cancel Add Item' : 'Add Item'}
        </button>
        {!userLoggedIn ? (
          <>
            <button onClick={() => navigate('/login')} className="header-button">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="header-button">
              Register
            </button>
          </>
        ) : (
          <button onClick={() => doSignOut().then(() => navigate('/login'))} className="header-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
