import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X, ClipboardList, Heart, Wallet, Bell,
  HelpCircle, Tag, UserCircle, LogOut,
  Package, Users, ChefHat
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, onOpenChat }) => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onClose();
    navigate('/login');
    window.location.reload();
  };

  const navTo = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay-visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Close */}
        <button className="sidebar-close" onClick={onClose}>
          <X size={22} />
        </button>

        {/* Profile */}
        {user ? (
          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="sidebar-name">{user.name}</p>
              <button className="sidebar-manage" onClick={() => navTo(user.role === 'caterer' ? '/caterer-dashboard' : '/dashboard')}>
                Manage account
              </button>
            </div>
          </div>
        ) : (
          <div className="sidebar-auth-cta">
            <ChefHat size={28} color="var(--primary-color)" />
            <p>Sign in to access all features</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary btn-sm" onClick={() => navTo('/login')}>Login</button>
              <button className="btn btn-outline-orange btn-sm" onClick={() => navTo('/register')}>Sign Up</button>
            </div>
          </div>
        )}

        <hr className="sidebar-divider" />

        {/* Nav Items */}
        <nav className="sidebar-nav">
          <button className="sidebar-item" onClick={() => navTo('/dashboard')}>
            <ClipboardList size={20} />
            <span>My Orders</span>
          </button>

          <button className="sidebar-item" onClick={() => navTo('/tiffin-schedule')}>
            <Bell size={20} />
            <span>Tiffin Schedule</span>
          </button>

          <button className="sidebar-item" onClick={() => navTo('/')}>
            <Heart size={20} />
            <span>Favourites</span>
          </button>

          <button className="sidebar-item sidebar-item-disabled">
            <Wallet size={20} />
            <span>Wallet</span>
            <span className="sidebar-coming">Soon</span>
          </button>

          <button className="sidebar-item" onClick={() => navTo('/')}>
            <Tag size={20} />
            <span>Offers &amp; Promotions</span>
          </button>

          <button className="sidebar-item" onClick={() => navTo('/')}>
            <Package size={20} />
            <span>Bulk Orders</span>
          </button>

          <button className="sidebar-item" onClick={() => navTo('/')}>
            <Users size={20} />
            <span>Invite Friends</span>
            <span className="sidebar-promo">$20 off</span>
          </button>

          <button className="sidebar-item" onClick={onOpenChat}>
            <HelpCircle size={20} />
            <span>Help &amp; Support</span>
          </button>
        </nav>

        <hr className="sidebar-divider" />

        {/* Bottom actions */}
        <div className="sidebar-footer">
          {user ? (
            <button className="sidebar-signout" onClick={handleLogout}>
              <LogOut size={18} />
              Sign out
            </button>
          ) : null}

          <div className="sidebar-links">
            <Link to="/register" onClick={onClose}>Add your catering service</Link>
            <Link to="/register" onClick={onClose}>Become a caterer</Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
