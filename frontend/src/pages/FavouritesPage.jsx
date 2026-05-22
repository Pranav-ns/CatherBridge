import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CatererCard from '../components/CatererCard';

const VEG_KEYWORDS = ['veg', 'south indian', 'north indian', 'dessert', 'ice cream', 'bakery', 'pastry', 'idli', 'salad'];

const FavouritesPage = ({ isVegMode }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await api.get('/users/favorites');
        setFavorites(res.data);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [navigate]);

  if (loading) return <div className="container" style={{ padding: '2rem 1rem' }}>Loading...</div>;

  const displayedFavorites = favorites.filter(c => {
    if (!isVegMode) return true;
    return VEG_KEYWORDS.some(kw => c.cuisine.toLowerCase().includes(kw));
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <Heart color="var(--primary-color)" fill="var(--primary-color)" /> My Favourites
      </h2>

      {displayedFavorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-light)' }}>
          <Heart size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3>No favourites found</h3>
          <p>Tap the heart icon on a caterer to add them to your favourites.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Browse Caterers</button>
        </div>
      ) : (
        <div className="caterers-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {displayedFavorites.map(caterer => (
            <CatererCard key={caterer._id} caterer={caterer} initialFavorite={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
