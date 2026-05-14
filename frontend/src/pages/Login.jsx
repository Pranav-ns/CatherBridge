import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import api from '../services/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [role, setRole] = useState('client');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { ...formData, role });
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
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div className="auth-logo-icon"><ChefHat size={22} color="white" /></div>
          <span className="auth-logo-name">CaterBridge</span>
        </div>

        <div className="auth-header">
          <h2 className="auth-title">Welcome back!</h2>
          <p className="auth-subtitle">Login to your CaterBridge account</p>
        </div>

        <div className="role-selector">
          <button className={`role-btn ${role === 'client' ? 'active' : ''}`} onClick={() => setRole('client')}>
            I'm a Customer
          </button>
          <button className={`role-btn ${role === 'caterer' ? 'active' : ''}`} onClick={() => setRole('caterer')}>
            I'm a Caterer
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
