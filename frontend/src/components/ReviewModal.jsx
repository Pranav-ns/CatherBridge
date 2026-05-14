import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import api from '../services/api';
import './ReviewModal.css';

const ReviewModal = ({ caterer, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${caterer._id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    setSubmitting(true);
    try {
      const res = await api.post('/reviews', { catererId: caterer._id, rating, comment });
      setReviews([res.data, ...reviews]);
      setSubmitSuccess(true);
      setComment('');
      setRating(5);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="review-modal-content">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div className="review-modal-header">
          <h2>Reviews</h2>
          <p className="review-modal-subtitle">{caterer.serviceName}</p>
        </div>

        {/* Submit Review Form */}
        {user?.role === 'client' && (
          <div className="review-form-box">
            <h4>Leave a Review</h4>
            {submitError && <div className="modal-status error" style={{ marginBottom: '0.75rem' }}>{submitError}</div>}
            {submitSuccess && <div className="modal-status success" style={{ marginBottom: '0.75rem' }}>Review submitted! ✓</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  <option value="5">⭐⭐⭐⭐⭐ — Excellent</option>
                  <option value="4">⭐⭐⭐⭐ — Very Good</option>
                  <option value="3">⭐⭐⭐ — Average</option>
                  <option value="2">⭐⭐ — Poor</option>
                  <option value="1">⭐ — Terrible</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label>Comment</label>
                <textarea rows="2" value={comment} onChange={(e) => setComment(e.target.value)} required placeholder="Share your experience..." />
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="reviews-scroll">
          {loading ? (
            <div className="spinner" />
          ) : reviews.length === 0 ? (
            <p className="no-reviews-msg">No reviews yet. Be the first to review!</p>
          ) : reviews.map(review => (
            <div key={review._id} className="review-item">
              <div className="review-item-header">
                <span className="reviewer-name">{review.client?.name || 'Client'}</span>
                <div className="review-stars-row">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13}
                      fill={i < review.rating ? '#F97316' : 'transparent'}
                      color={i < review.rating ? '#F97316' : '#D1D5DB'}
                    />
                  ))}
                </div>
              </div>
              <p className="review-text">{review.comment}</p>
              <p className="review-date-text">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
