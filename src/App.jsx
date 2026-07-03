import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPasswordless from './pages/LoginPasswordless';
import RateFeedback from './pages/RateFeedback';
import AdminDashboard from './pages/AdminDashboard';
import QRCodeManager from './pages/QRCodeManager';
import QRScanner from './pages/QRScanner';     

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPasswordless />} />
        <Route path="/scan" element={<QRScanner />} />

        <Route path="/" element={<RateFeedback />} />
        <Route path="/rate/:targetCode" element={<RateFeedback />} />
        <Route path="/rate" element={<RateFeedback />} /> 
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/qrcode-manager" element={<QRCodeManager />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;