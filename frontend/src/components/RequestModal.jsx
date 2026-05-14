import React, { useState } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';
import './RequestModal.css';

const RequestModal = ({ caterer, isBulk, onClose }) => {
  const [formData, setFormData] = useState({
    eventDate: '',
    guestCount: isBulk ? '50' : '',
    message: isBulk ? 'Hi, I am interested in placing a bulk order for an upcoming event. Please provide your bulk pricing and options.' : ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/requests', {
        catererId: caterer._id,
        ...formData
      });
      setStatus({ type: 'success', message: 'Request sent successfully!' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <div className="modal-header">
          <h2>{isBulk ? 'Bulk Order Request' : 'Request a Quote'}</h2>
          <p className="modal-subtitle">from {caterer.serviceName}</p>
        </div>

        {status.message && (
          <div className={`modal-status ${status.type}`} style={{ marginBottom: '1rem' }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-group">
            <label>Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Estimated Guests</label>
            <input
              type="number"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g. 50"
            />
          </div>
          <div className="form-group">
            <label>Message / Special Requirements</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              placeholder="Any dietary requirements or special notes..."
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
