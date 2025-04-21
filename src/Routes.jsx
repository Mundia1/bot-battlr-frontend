import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

// This component can be expanded later to add more routes
// When implementing advanced features like bot specs page

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;