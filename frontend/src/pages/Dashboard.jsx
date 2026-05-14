import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Clock, CheckCircle, XCircle, ChefHat,
  Calendar, Users, Star, ChevronRight
} from 'lucide-react';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role === 'caterer') { navigate('/caterer-dashboard'); return; }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (err) {
      setError('Failed to load your requests.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const pending  = requests.filter(r => r.status === 'pending');
  const accepted = requests.filter(r => r.status === 'accepted');
  const declined = requests.filter(r => r.status === 'declined');

  return (
    <div className="customer-dashboard">
      {/* ── ORANGE BANNER ── */}
      <div className="customer-banner">
        <div className="container banner-row">
          <div className="banner-left">
            <div className="banner-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 className="banner-name">Hi, {user.name}! 👋</h1>
              <p className="banner-sub">Here are all your catering requests.</p>
            </div>
          </div>
          <button className="btn btn-white" onClick={() => navigate('/')}>
            <ChefHat size={16} />
            Find Caterers
          </button>
        </div>
      </div>

      <div className="container customer-body">
        {/* ── STATS ── */}
        <div className="customer-stats">
          <div className="cstat-card total">
            <div className="cstat-icon"><ClipboardList size={20} /></div>
            <div>
              <p className="cstat-num">{requests.length}</p>
              <p className="cstat-label">Total Requests</p>
            </div>
          </div>
          <div className="cstat-card pending">
            <div className="cstat-icon"><Clock size={20} /></div>
            <div>
              <p className="cstat-num">{pending.length}</p>
              <p className="cstat-label">Pending</p>
            </div>
          </div>
          <div className="cstat-card accepted">
            <div className="cstat-icon"><CheckCircle size={20} /></div>
            <div>
              <p className="cstat-num">{accepted.length}</p>
              <p className="cstat-label">Accepted</p>
            </div>
          </div>
          <div className="cstat-card declined">
            <div className="cstat-icon"><XCircle size={20} /></div>
            <div>
              <p className="cstat-num">{declined.length}</p>
              <p className="cstat-label">Declined</p>
            </div>
          </div>
        </div>

        {/* ── REQUESTS ── */}
        <div className="requests-section">
          <h2 className="requests-title">My Catering Requests</h2>

          {loading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : error ? (
            <div className="error-card" style={{ padding: '2rem', background: '#FEF2F2', borderRadius: '12px', color: 'var(--error-color)', textAlign: 'center' }}>
              {error}
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-requests">
              <ChefHat size={56} color="var(--primary-light)" />
              <h3>No requests yet</h3>
              <p>Browse caterers and send your first quote request!</p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                Browse Caterers
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="requests-grid">
              {requests.map(req => (
                <div key={req._id} className="request-card-customer">
                  {/* Header */}
                  <div className="rc-header">
                    <div className="rc-caterer-info">
                      <div className="rc-avatar">
                        {req.caterer?.serviceName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div>
                        <p className="rc-name">{req.caterer?.serviceName || 'Caterer'}</p>
                        <p className="rc-email text-sm text-secondary">{req.caterer?.email}</p>
                      </div>
                    </div>
                    <span className={`badge ${
                      req.status === 'accepted' ? 'badge-green' :
                      req.status === 'declined' ? 'badge-red' :
                      'badge-yellow'
                    }`}>
                      {req.status === 'accepted' && <CheckCircle size={11} />}
                      {req.status === 'declined' && <XCircle size={11} />}
                      {req.status === 'pending' && <Clock size={11} />}
                      {req.status}
                    </span>
                  </div>

                  <hr className="rc-divider" />

                  {/* Details */}
                  <div className="rc-details">
                    <div className="rc-detail">
                      <Calendar size={15} color="var(--primary-color)" />
                      <span>{new Date(req.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="rc-detail">
                      <Users size={15} color="var(--primary-color)" />
                      <span>{req.guestCount} guests</span>
                    </div>
                  </div>

                  {req.message && (
                    <p className="rc-message">"{req.message}"</p>
                  )}

                  {req.status === 'accepted' && (
                    <div className="rc-accepted-badge">
                      <Star size={14} fill="#F97316" color="#F97316" />
                      <span>Your booking is confirmed! Contact the caterer to finalize details.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
