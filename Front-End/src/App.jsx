import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClothingDetail from './components/ClothingDetail';
import AddItem from './components/AddItem';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import OutfitsGrid from './components/OutfitsGrid';
import OutfitDetail from './components/OutfitDetail';
import OutfitForm from './components/OutfitForm'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/clothing/:name" element={<ClothingDetail />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/create-outfit" element={<OutfitForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/outfits" element={<OutfitsGrid />} />
        <Route path="/outfit/:id" element={<OutfitDetail />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
