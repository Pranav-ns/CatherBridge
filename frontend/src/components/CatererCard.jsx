import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { MapPin, DollarSign, Utensils, Star, ChevronRight, Bell, Heart } from 'lucide-react';
import RequestModal from './RequestModal';
import ReviewModal from './ReviewModal';
import SubscribeModal from './SubscribeModal';
import './CatererCard.css';

const CatererCard = ({ caterer, initialFavorite = false }) => {
  const [isRequestModalOpen, setIsRequestModalOpen]   = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen]     = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const handleFavoriteToggle = async () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user || user.role !== 'client') {
      alert('Please login as a customer to add favourites.');
      return;
    }
    try {
      await api.post(`/users/favorites/${caterer._id}`);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <>
      <div className="caterer-card card fade-in">
        {/* Photo Banner */}
        <div className="card-photo">
          {caterer.photos && caterer.photos.length > 0 ? (
            <img src={caterer.photos[0]} alt={caterer.serviceName} />
          ) : (
            <div className="card-photo-placeholder">
              <Utensils size={36} color="var(--primary-light)" />
            </div>
          )}
          <button 
            className={`favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
            onClick={handleFavoriteToggle}
            aria-label="Toggle favorite"
          >
            <Heart size={18} fill={isFavorite ? "var(--primary-color)" : "none"} color={isFavorite ? "var(--primary-color)" : "currentColor"} />
          </button>
          <div className="card-cuisine-badge">
            <Utensils size={12} />
            {caterer.cuisine}
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body">
          <div className="card-title-row">
            <h3 className="card-title">{caterer.serviceName}</h3>
            {caterer.numReviews > 0 && (
              <div className="card-rating">
                <Star size={14} fill="#F97316" color="#F97316" />
                <span className="rating-value">{Number(caterer.rating).toFixed(1)}</span>
                <span className="rating-count">({caterer.numReviews})</span>
              </div>
            )}
          </div>

          <div className="card-info">
            <div className="info-pill"><MapPin size={13} />{caterer.location}</div>
            <div className="info-pill"><DollarSign size={13} />{caterer.pricing}</div>
          </div>

          {caterer.story && (
            <p className="card-story">{caterer.story.substring(0, 90)}{caterer.story.length > 90 ? '...' : ''}</p>
          )}
        </div>

        {/* Card Footer */}
        <div className="card-footer">
          <button className="btn btn-secondary btn-sm" onClick={() => setIsReviewModalOpen(true)}>
            <Star size={14} /> Reviews
          </button>

          {user?.role === 'client' ? (
            <div className="card-action-btns">
              {/* Tiffin Subscribe */}
              <button
                className="btn btn-outline-orange btn-sm"
                onClick={() => setIsSubscribeModalOpen(true)}
                title="Subscribe to Tiffin service"
              >
                <Bell size={14} /> Tiffin
              </button>
              {/* Quote */}
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsRequestModalOpen(true)}
              >
                Quote <ChevronRight size={15} />
              </button>
            </div>
          ) : !user ? (
            <Link to="/login" className="btn btn-outline-orange btn-sm">
              Login as Customer
            </Link>
          ) : null}
        </div>
      </div>

      {isRequestModalOpen && (
        <RequestModal
          caterer={caterer}
          onClose={() => setIsRequestModalOpen(false)}
        />
      )}
      {isReviewModalOpen && (
        <ReviewModal caterer={caterer} onClose={() => setIsReviewModalOpen(false)} />
      )}
      {isSubscribeModalOpen && (
        <SubscribeModal caterer={caterer} onClose={() => setIsSubscribeModalOpen(false)} />
      )}
    </>
  );
};

export default CatererCard;
