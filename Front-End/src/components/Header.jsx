import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth';
import './Header.css';

const Header = ({ toggleSidebar, toggleAddItem }) => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  return (
    <nav className="header-nav">
      <div className="header-left">
        <button onClick={() => navigate('/home')} className="header-button">
          Home
        </button>
        <button onClick={toggleSidebar} className="header-button">
          Categories
        </button>
      </div>
      <div className="header-right">
        <button onClick={toggleAddItem} className="header-button">
          Add Item
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
          <button
            onClick={() => doSignOut().then(() => navigate('/login'))}
            className="header-button"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
