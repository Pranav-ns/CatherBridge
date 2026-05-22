import React from 'react';
import { Tag, Clock, ChevronRight } from 'lucide-react';

const OFFERS = [
  {
    id: 1,
    title: "50% Off First Tiffin",
    description: "Get 50% off your first month of subscription with any caterer.",
    code: "FIRST50",
    expires: "2026-12-31"
  },
  {
    id: 2,
    title: "Weekend Bonanza",
    description: "Free delivery on all orders placed during the weekend.",
    code: "WEEKEND",
    expires: "2026-06-30"
  },
  {
    id: 3,
    title: "Referral Bonus",
    description: "Invite a friend and get $20 added to your wallet.",
    code: "Auto-applied",
    expires: "Ongoing"
  }
];

const OffersPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <Tag color="var(--primary-color)" /> Offers &amp; Promotions
      </h2>

      <div className="offers-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {OFFERS.map(offer => (
          <div key={offer.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--text-dark)' }}>{offer.title}</h3>
            <p style={{ color: 'var(--text-gray)', margin: 0 }}>{offer.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px dashed #eee' }}>
              <div style={{ backgroundColor: '#f0f0f0', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px' }}>
                {offer.code}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} /> {offer.expires}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
