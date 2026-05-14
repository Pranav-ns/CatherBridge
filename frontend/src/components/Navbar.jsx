import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, LayoutDashboard, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onOpenSidebar }) => {
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
            <div className="nav-brand-icon">
              <ChefHat size={20} color="white" />
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
                  {user.name} · {user.role === 'client' ? 'Customer' : 'Caterer'}
                </span>
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
