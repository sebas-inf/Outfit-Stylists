import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClothingGrid from './components/ClothingGrid';
import ClothingDetail from './components/ClothingDetail';
import AddItem from './components/AddItem';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<ClothingGrid />} />
        <Route path="/clothing/:name" element={<ClothingDetail />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
