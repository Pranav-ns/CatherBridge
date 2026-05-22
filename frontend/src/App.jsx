import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CatererDashboard from './pages/CatererDashboard';
import TiffinSchedule from './pages/TiffinSchedule';
import FavouritesPage from './pages/FavouritesPage';
import OffersPage from './pages/OffersPage';
import ReferralPage from './pages/ReferralPage';
import ChatbotWidget from './components/ChatbotWidget';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVegMode, setIsVegMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <Router>
      <div className={`app ${isVegMode ? 'veg-mode-active' : ''}`}>
        <Navbar 
          onOpenSidebar={() => setSidebarOpen(true)} 
          isVegMode={isVegMode}
          setIsVegMode={setIsVegMode}
        />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onOpenChat={() => { setSidebarOpen(false); setChatOpen(true); }} />
        <main>
          <Routes>
            <Route path="/" element={<Home isVegMode={isVegMode} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/caterer-dashboard" element={<CatererDashboard />} />
            <Route path="/tiffin-schedule" element={<TiffinSchedule />} />
            <Route path="/favourites" element={<FavouritesPage isVegMode={isVegMode} />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/referrals" element={<ReferralPage />} />
          </Routes>
        </main>
        <ChatbotWidget isOpen={chatOpen} setIsOpen={setChatOpen} />
      </div>
    </Router>
  );
}

export default App;
