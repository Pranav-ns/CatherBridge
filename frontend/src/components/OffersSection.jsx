import React from 'react';
import { ArrowRight, Zap, Package, Star } from 'lucide-react';
import './OffersSection.css';

const OFFERS = [
  {
    id: 1,
    tag: 'Limited Time',
    title: '20% Off Your First Booking',
    desc: 'New to CaterBridge? Get 20% off your first catering request.',
    cta: 'Claim Offer',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
    icon: <Zap size={32} color="rgba(255,255,255,0.9)" />,
    code: 'FIRST20',
  },
  {
    id: 2,
    tag: 'Tiffin Special',
    title: 'Subscribe & Save 15%',
    desc: 'Start a weekly or monthly tiffin plan and save on every meal.',
    cta: 'Start Tiffin',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
    icon: <span style={{ fontSize: '2.2rem' }}>🍱</span>,
    code: 'TIFFIN15',
  },
  {
    id: 3,
    tag: 'Bulk Order',
    title: 'Order for 50+ Guests, Save Big',
    desc: 'Planning a large event? Contact caterers directly for bulk pricing.',
    cta: 'Explore Caterers',
    gradient: 'linear-gradient(135deg, #059669 0%, #0891B2 100%)',
    icon: <Package size={32} color="rgba(255,255,255,0.9)" />,
    code: 'BULK50',
  },
  {
    id: 4,
    tag: 'Top Rated',
    title: 'Book a 5★ Caterer Today',
    desc: 'Only the best-reviewed caterers with 4.8+ ratings featured here.',
    cta: 'Browse Top Rated',
    gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    icon: <Star size={32} color="rgba(255,255,255,0.9)" />,
    code: null,
  },
];

const OffersSection = () => (
  <section className="offers-section">
    <div className="offers-header">
      <h2 className="offers-title">🎁 Offers &amp; Promotions</h2>
      <button className="offers-view-all">View all <ArrowRight size={14} /></button>
    </div>
    <div className="offers-scroll">
      {OFFERS.map(offer => (
        <div key={offer.id} className="offer-card" style={{ background: offer.gradient }}>
          <div className="offer-icon">{offer.icon}</div>
          <div className="offer-content">
            <span className="offer-tag">{offer.tag}</span>
            <h3 className="offer-title">{offer.title}</h3>
            <p className="offer-desc">{offer.desc}</p>
            {offer.code && (
              <div className="offer-code">
                <span>Use code:</span>
                <strong>{offer.code}</strong>
              </div>
            )}
            <button className="offer-cta">
              {offer.cta} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default OffersSection;
