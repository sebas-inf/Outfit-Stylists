// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClothingGrid from './components/ClothingGrid';
import ClothingDetail from './components/ClothingDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/clothing" element={<ClothingGrid />} />
        <Route path="/clothing/:name" element={<ClothingDetail />} />
        <Route path="/" element={<Navigate to="/clothing" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
