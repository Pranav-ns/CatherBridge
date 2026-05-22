import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Copy, Mail, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReferralPage = () => {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await api.get('/users/referral');
        setReferralCode(res.data.referralCode);
      } catch (err) {
        console.error('Error fetching referral code:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferral();
  }, [navigate]);

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEmailShare = () => {
    if (referralCode) {
      const subject = encodeURIComponent("Join CaterBridge with my referral code!");
      const body = encodeURIComponent(`Hey! I've been using CaterBridge for my tiffin services. Sign up using my referral code to get a bonus!\n\nMy Code: ${referralCode}\n\nSign up here: http://localhost:5173/register`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem 1rem' }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', padding: '1rem', borderRadius: '50%' }}>
          <Users size={48} color="var(--primary-color)" />
        </div>
        
        <h2 style={{ margin: 0 }}>Refer a Friend & Earn</h2>
        <p style={{ color: 'var(--text-gray)', margin: 0 }}>
          Share your unique code with friends. When they sign up and place their first order, you both get a $20 bonus in your wallet!
        </p>

        <div style={{ 
          backgroundColor: '#f8f9fa', 
          border: '2px dashed var(--primary-color)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          width: '100%',
          marginTop: '1rem'
        }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', marginTop: 0 }}>YOUR UNIQUE REFERRAL CODE</p>
          <h1 style={{ margin: 0, letterSpacing: '2px', color: 'var(--text-dark)' }}>{referralCode}</h1>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleCopy}
          >
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          
          <button 
            className="btn btn-outline-orange" 
            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleEmailShare}
          >
            <Mail size={18} />
            Share via Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
