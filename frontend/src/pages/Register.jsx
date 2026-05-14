import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import api from '../services/api';
import './Auth.css';

const Register = () => {
  const [role, setRole] = useState('client');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    serviceName: '', cuisine: '', pricing: '', location: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', { ...formData, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate(role === 'caterer' ? '/caterer-dashboard' : '/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ padding: '3rem 1rem' }}>
      <div className="auth-card fade-in" style={{ maxWidth: '580px' }}>
        <div className="auth-logo">
          <div className="auth-logo-icon"><ChefHat size={22} color="white" /></div>
          <span className="auth-logo-name">CaterBridge</span>
        </div>

        <div className="auth-header">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Join thousands of caterers and clients</p>
        </div>

        <div className="role-selector">
          <button type="button" className={`role-btn ${role === 'client' ? 'active' : ''}`} onClick={() => setRole('client')}>
            I'm a Customer
          </button>
          <button type="button" className={`role-btn ${role === 'caterer' ? 'active' : ''}`} onClick={() => setRole('caterer')}>
            I'm a Caterer
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder="Min. 6 characters" />
          </div>

          {role === 'caterer' && (
            <div className="caterer-fields">
              <p className="caterer-fields-title">🍽️ Caterer Details</p>
              <div className="form-group">
                <label>Catering Service Name</label>
                <input type="text" name="serviceName" value={formData.serviceName} onChange={handleChange} required placeholder="e.g. Spice Garden Catering" />
              </div>
              <div className="form-group">
                <label>Cuisine(s) Offered</label>
                <input type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} required placeholder="e.g. Indian, Mexican, Fusion" />
              </div>
              <div className="form-group">
                <label>Pricing</label>
                <input type="text" name="pricing" value={formData.pricing} onChange={handleChange} required placeholder="e.g. $50/person or $$$" />
              </div>
              <div className="form-group">
                <label>Location / Service Area</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Toronto, ON" />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
