import React, { useState } from 'react';
import { X, Clock, Calendar, Utensils, CheckCircle } from 'lucide-react';
import api from '../services/api';
import './SubscribeModal.css';

const PLANS = [
  {
    id: 'daily',
    label: 'Daily',
    icon: '🍱',
    desc: 'Fresh meals every day',
    badge: 'Most Popular',
  },
  {
    id: 'weekly',
    label: 'Weekly',
    icon: '📅',
    desc: '5 days a week plan',
    badge: null,
  },
  {
    id: 'monthly',
    label: 'Monthly',
    icon: '🗓️',
    desc: 'Best value, save more',
    badge: 'Best Value',
  },
];

const SubscribeModal = ({ caterer, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('daily');
  const [mealsPerDay, setMealsPerDay] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/subscriptions', {
        catererId: caterer._id,
        plan: selectedPlan,
        mealsPerDay,
        startDate,
      });
      setSuccess(true);
      setTimeout(() => onClose(), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="subscribe-modal">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        {success ? (
          <div className="subscribe-success">
            <CheckCircle size={56} color="var(--accent-color)" />
            <h2>Subscribed! 🎉</h2>
            <p>Your tiffin subscription with <strong>{caterer.serviceName}</strong> is now active.</p>
          </div>
        ) : (
          <>
            <div className="subscribe-header">
              <div className="subscribe-icon">🍱</div>
              <div>
                <h2>Tiffin Subscription</h2>
                <p className="subscribe-caterer">{caterer.serviceName}</p>
              </div>
            </div>

            {error && <div className="modal-status error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Plan selection */}
              <p className="subscribe-section-label">Choose your plan</p>
              <div className="plan-cards">
                {PLANS.map(plan => (
                  <button
                    key={plan.id}
                    type="button"
                    className={`plan-card ${selectedPlan === plan.id ? 'plan-card-active' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                    <span className="plan-icon">{plan.icon}</span>
                    <span className="plan-label">{plan.label}</span>
                    <span className="plan-desc">{plan.desc}</span>
                  </button>
                ))}
              </div>

              {/* Meals per day */}
              <p className="subscribe-section-label">Meals per day</p>
              <div className="meals-selector">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`meal-btn ${mealsPerDay === n ? 'meal-btn-active' : ''}`}
                    onClick={() => setMealsPerDay(n)}
                  >
                    <Utensils size={14} />
                    {n} {n === 1 ? 'meal' : 'meals'}
                  </button>
                ))}
              </div>

              {/* Start date */}
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label><Calendar size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Summary */}
              <div className="subscribe-summary">
                <Clock size={14} />
                <span>
                  <strong>{mealsPerDay} meal{mealsPerDay > 1 ? 's' : ''}/day</strong>, {selectedPlan} plan
                  {startDate && ` · starting ${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </span>
              </div>

              <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1.25rem' }} disabled={loading}>
                {loading ? 'Subscribing...' : '🔔 Subscribe Now'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
