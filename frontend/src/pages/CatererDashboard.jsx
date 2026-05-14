import React, { useState, useEffect, useRef } from 'react';
import {
  Star, Users, BookOpen, Camera, Plus, Trash2,
  Save, ChefHat, MapPin, DollarSign, Utensils,
  Edit3, CheckCircle, Clock, XCircle
} from 'lucide-react';
import api from '../services/api';
import './CatererDashboard.css';

const CatererDashboard = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');

  // Edit states
  const [story, setStory] = useState('');
  const [photos, setPhotos] = useState([]);
  const [menu, setMenu] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [profileRes, requestsRes, reviewsRes] = await Promise.all([
        api.get(`/caterers/${user._id}`),
        api.get('/requests'),
        api.get(`/reviews/${user._id}`)
      ]);
      const p = profileRes.data;
      setProfile(p);
      setStory(p.story || '');
      setPhotos(p.photos || []);
      setMenu(p.menu || []);
      setTotalCustomers(p.totalCustomers || 0);
      setRequests(requestsRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/caterers/profile', { story, photos, menu, totalCustomers });
      setSaveMsg('Profile saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
      fetchAll();
    } catch (err) {
      setSaveMsg('Failed to save. Please try again.');
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  // Photo upload — convert to base64
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Menu management
  const addMenuItem = () => {
    setMenu(prev => [...prev, { name: '', description: '', price: '' }]);
  };

  const updateMenuItem = (index, field, value) => {
    setMenu(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeMenuItem = (index) => {
    setMenu(prev => prev.filter((_, i) => i !== index));
  };

  // Request status update
  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/requests/${id}/status`, { status });
      fetchAll();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (!user || user.role !== 'caterer') {
    return (
      <div className="page-loading">
        <p className="text-secondary">Access denied. Please log in as a Caterer.</p>
      </div>
    );
  }

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '—';

  return (
    <div className="caterer-dashboard">
      {/* ── TOP BANNER ── */}
      <div className="dashboard-banner">
        <div className="container banner-inner">
          <div className="banner-info">
            <div className="banner-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h1 className="banner-title">{profile?.serviceName || user.name}</h1>
              <div className="banner-meta">
                <span><MapPin size={14} /> {profile?.location}</span>
                <span><Utensils size={14} /> {profile?.cuisine}</span>
                <span><DollarSign size={14} /> {profile?.pricing}</span>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save All Changes
          </button>
        </div>
      </div>

      {saveMsg && (
        <div className={`save-toast ${saveMsg.includes('Failed') ? 'error' : 'success'}`}>
          {saveMsg.includes('Failed') ? <XCircle size={16} /> : <CheckCircle size={16} />}
          {saveMsg}
        </div>
      )}

      <div className="container dashboard-body">
        {/* ── STATS ROW ── */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon orange"><Star size={22} /></div>
            <div>
              <p className="stat-value">{avgRating}</p>
              <p className="stat-label">Average Rating</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><BookOpen size={22} /></div>
            <div>
              <p className="stat-value">{reviews.length}</p>
              <p className="stat-label">Total Reviews</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><Users size={22} /></div>
            <div>
              <p className="stat-value">{totalCustomers}</p>
              <p className="stat-label">Total Customers</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow"><Clock size={22} /></div>
            <div>
              <p className="stat-value">{pendingRequests.length}</p>
              <p className="stat-label">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* ── LEFT COLUMN ── */}
          <div className="left-col">

            {/* Story Section */}
            <div className="dash-section">
              <div className="section-head">
                <Edit3 size={18} className="section-icon" />
                <h2>Our Story</h2>
              </div>
              <p className="section-desc">Tell clients about your catering journey, values, and specialties.</p>
              <textarea
                className="story-input"
                rows="5"
                placeholder="We started CaterBridge to bring amazing food to people's most important moments..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
              />
            </div>

            {/* Total Customers */}
            <div className="dash-section">
              <div className="section-head">
                <Users size={18} className="section-icon" />
                <h2>Customer Count</h2>
              </div>
              <p className="section-desc">Keep track of how many clients you've served.</p>
              <input
                type="number"
                min="0"
                value={totalCustomers}
                onChange={(e) => setTotalCustomers(Number(e.target.value))}
                placeholder="e.g. 250"
              />
            </div>

            {/* Photo Gallery */}
            <div className="dash-section">
              <div className="section-head">
                <Camera size={18} className="section-icon" />
                <h2>Service Photos</h2>
              </div>
              <p className="section-desc">Showcase your food, events, and setup. First photo will appear on your card.</p>
              <div className="photo-grid">
                {photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img src={photo} alt={`Service ${index + 1}`} />
                    <button className="photo-remove" onClick={() => removePhoto(index)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button className="photo-add" onClick={() => fileInputRef.current.click()}>
                  <Camera size={24} />
                  <span>Add Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="right-col">

            {/* Menu Section */}
            <div className="dash-section">
              <div className="section-head">
                <ChefHat size={18} className="section-icon" />
                <h2>Menu</h2>
              </div>
              <p className="section-desc">List your signature dishes, packages, and pricing.</p>
              <div className="menu-list">
                {menu.map((item, index) => (
                  <div key={index} className="menu-item-edit">
                    <div className="menu-item-fields">
                      <input
                        type="text"
                        placeholder="Dish name"
                        value={item.name}
                        onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Short description"
                        value={item.description}
                        onChange={(e) => updateMenuItem(index, 'description', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Price (e.g. $12)"
                        value={item.price}
                        onChange={(e) => updateMenuItem(index, 'price', e.target.value)}
                        className="price-input"
                      />
                    </div>
                    <button className="btn btn-ghost btn-sm remove-btn" onClick={() => removeMenuItem(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button className="btn btn-outline-orange btn-sm" onClick={addMenuItem} style={{ width: '100%' }}>
                  <Plus size={16} />
                  Add Menu Item
                </button>
              </div>
            </div>

            {/* Incoming Requests */}
            <div className="dash-section">
              <div className="section-head">
                <Clock size={18} className="section-icon" />
                <h2>Incoming Requests</h2>
                {pendingRequests.length > 0 && (
                  <span className="badge badge-yellow">{pendingRequests.length} pending</span>
                )}
              </div>
              {requests.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem 0' }}>
                  <p>No requests yet. They will appear here when clients reach out!</p>
                </div>
              ) : (
                <div className="requests-list">
                  {requests.map(req => (
                    <div key={req._id} className="req-card">
                      <div className="req-top">
                        <div>
                          <p className="req-client">{req.client?.name}</p>
                          <p className="req-date text-sm text-secondary">
                            Customer Event: {new Date(req.eventDate).toLocaleDateString()} · {req.guestCount} guests
                          </p>
                        </div>
                        <span className={`badge ${req.status === 'accepted' ? 'badge-green' : req.status === 'declined' ? 'badge-red' : 'badge-yellow'}`}>
                          {req.status}
                        </span>
                      </div>
                      {req.message && <p className="req-message">{req.message}</p>}
                      {req.status === 'pending' && (
                        <div className="req-actions">
                          <button className="btn btn-sm" style={{ background: '#DCFCE7', color: '#16A34A', border: '1px solid #BBF7D0' }}
                            onClick={() => handleStatusUpdate(req._id, 'accepted')}>
                            <CheckCircle size={14} /> Accept
                          </button>
                          <button className="btn btn-sm" style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}
                            onClick={() => handleStatusUpdate(req._id, 'declined')}>
                            <XCircle size={14} /> Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="dash-section">
              <div className="section-head">
                <Star size={18} className="section-icon" />
                <h2>Client Reviews</h2>
                {reviews.length > 0 && <span className="badge badge-orange">{avgRating} ★</span>}
              </div>
              {reviews.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem 0' }}>
                  <p>No reviews yet. Reviews will appear here once clients start rating you.</p>
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-top">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">{review.client?.name?.charAt(0).toUpperCase()}</div>
                          <span className="reviewer-name">{review.client?.name}</span>
                        </div>
                        <div className="review-stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14}
                              fill={i < review.rating ? '#F97316' : 'transparent'}
                              color={i < review.rating ? '#F97316' : '#D1D5DB'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <p className="review-date text-xs text-secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CatererDashboard;
