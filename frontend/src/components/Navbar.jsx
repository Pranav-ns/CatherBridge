import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, LayoutDashboard, Menu, Leaf } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onOpenSidebar, isVegMode, setIsVegMode }) => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="nav-inner container">
        {/* Left: Hamburger + Brand */}
        <div className="nav-left">
          <button className="hamburger-btn" onClick={onOpenSidebar} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <Link to="/" className="nav-brand">
            <div className="nav-brand-icon" style={{ backgroundColor: 'transparent', width: '36px', height: '36px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="CaterBridge Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span className="nav-brand-name">CaterBridge</span>
          </Link>
        </div>

        {/* Right: Auth */}
        <div className="nav-right">
          {user ? (
            <>
              <div className="user-info">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">
                  {user.name}
                </span>
              </div>
              
              <div className="veg-mode-toggle-wrapper">
                <span className={`veg-mode-label ${isVegMode ? 'veg-mode-active-text' : ''}`}>
                  <Leaf size={14} className="veg-leaf-icon" /> Veg Mode
                </span>
                <label className="veg-toggle">
                  <input 
                    type="checkbox" 
                    checked={isVegMode} 
                    onChange={(e) => setIsVegMode(e.target.checked)} 
                  />
                  <span className="veg-slider"></span>
                </label>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(user.role === 'caterer' ? '/caterer-dashboard' : '/dashboard')}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
