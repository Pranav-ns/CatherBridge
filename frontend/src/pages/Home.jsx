import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, ChefHat, Star, Users } from 'lucide-react';
import api from '../services/api';
import CatererCard from '../components/CatererCard';
import CITY_ICONS from '../components/CityIcons';
import OffersSection from '../components/OffersSection';
import CuisineFilter from '../components/CuisineFilter';
import './Home.css';

const CANADIAN_CITIES = [
  { name: 'Toronto' },
  { name: 'Vancouver' },
  { name: 'Montreal' },
  { name: 'Calgary' },
  { name: 'Ottawa' },
  { name: 'Edmonton' },
  { name: 'Winnipeg' },
  { name: 'Quebec City' },
  { name: 'Hamilton' },
  { name: 'Halifax' },
  { name: 'Brampton' },
  { name: 'Mississauga' },
];

const Home = () => {
  const [caterers, setCaterers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    const fetchCaterers = async () => {
      try {
        const res = await api.get('/caterers');
        setCaterers(res.data);
      } catch (err) {
        setError('Failed to fetch caterers. Ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchCaterers();
  }, []);

  // Close picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowCityPicker(false);
        setCitySearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCurrentLocation = () => {
    setDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation('Current Location');
          setShowCityPicker(false);
          setCitySearch('');
          setDetectingLocation(false);
        },
        () => {
          setLocation('Location unavailable');
          setDetectingLocation(false);
        }
      );
    } else {
      setDetectingLocation(false);
    }
  };

  const selectCity = (cityName) => {
    setLocation(cityName);
    setShowCityPicker(false);
    setCitySearch('');
  };

  const filteredCities = CANADIAN_CITIES.filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredCaterers = caterers.filter(c => {
    const matchesSearch =
      c.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !location ||
      location === 'Current Location' ||
      location === 'Location unavailable' ||
      c.location.toLowerCase().includes(location.toLowerCase());
    const matchesCuisine =
      !selectedCuisine ||
      c.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
      
    return matchesSearch && matchesLocation && matchesCuisine;
  });

  return (
    <div className="home-page">
      {/* ── ORANGE HERO ── */}
      <section className="hero-orange">
        <div className="container">
          <div className="hero-tagline">
            <h1>Find the perfect caterer for your next event</h1>
            <p>Top-rated catering professionals across Canada, ready to serve.</p>
          </div>

          {/* Inputs Row */}
          <div className="search-bar-row">
            {/* Location / City Picker */}
            <div className="location-wrapper" ref={locationRef}>
              <div
                className="search-pill location-pill"
                onClick={() => { setShowCityPicker(true); }}
              >
                <MapPin size={18} className="pill-icon" />
                <input
                  type="text"
                  placeholder="Enter your event location"
                  value={showCityPicker ? citySearch : location}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setShowCityPicker(true);
                  }}
                  onFocus={() => setShowCityPicker(true)}
                  className="pill-input"
                  readOnly={!showCityPicker}
                />
              </div>

              {/* City Picker Panel */}
              {showCityPicker && (
                <div className="city-picker-panel">
                  {/* Search within picker */}
                  <div className="city-search-row">
                    <Search size={16} className="city-search-icon" />
                    <input
                      type="text"
                      className="city-search-input"
                      placeholder="Search for your city"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {/* Detect location */}
                  <button className="detect-location-btn" onClick={handleCurrentLocation} disabled={detectingLocation}>
                    <Navigation size={15} />
                    <span>{detectingLocation ? 'Detecting...' : 'Use my current location'}</span>
                  </button>

                  <div className="city-divider" />

                  {/* Popular Cities Grid */}
                  <p className="popular-cities-label">Popular Canadian Cities</p>
                  <div className="cities-grid">
                    {filteredCities.map(city => {
                      const IconComponent = CITY_ICONS[city.name];
                      return (
                        <button
                          key={city.name}
                          className={`city-btn ${location === city.name ? 'city-btn-active' : ''}`}
                          onClick={() => selectCity(city.name)}
                        >
                          <span className="city-icon-wrap">
                            {IconComponent && <IconComponent />}
                          </span>
                          <span className="city-name">{city.name}</span>
                        </button>
                      );
                    })}
                    {filteredCities.length === 0 && (
                      <p className="no-city">No cities found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="search-pill search-pill-main">
              <Search size={18} className="pill-icon" />
              <input
                type="text"
                placeholder="Search for caterer, cuisine or more"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pill-input"
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="hero-stats-row">
            <div className="hero-stat"><ChefHat size={16} /><span>{caterers.length}+ Caterers</span></div>
            <span className="stat-dot">·</span>
            <div className="hero-stat"><Star size={16} /><span>Top Rated</span></div>
            <span className="stat-dot">·</span>
            <div className="hero-stat"><Users size={16} /><span>1000+ Customers Served</span></div>
          </div>
        </div>
      </section>

      <div className="container">
        <OffersSection />
        
        <h2 className="section-title" style={{ marginTop: '2rem', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
          Explore by category
        </h2>
        <CuisineFilter selected={selectedCuisine} onSelect={setSelectedCuisine} />
      </div>

      {/* ── CATERER LIST ── */}
      <section className="caterers-section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {location && location !== 'Current Location' ? `Caterers in ${location}` : 'Available Caterers'}
            </h2>
            <p className="section-subtitle">
              {loading ? '' : `${filteredCaterers.length} caterer${filteredCaterers.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          {location && (
            <button className="clear-location-btn" onClick={() => setLocation('')}>
              × Clear location
            </button>
          )}
        </div>

        {loading ? (
          <div className="page-loading"><div className="spinner" /></div>
        ) : error ? (
          <div className="error-card">
            <ChefHat size={32} />
            <p>{error}</p>
          </div>
        ) : filteredCaterers.length === 0 ? (
          <div className="empty-state">
            <ChefHat size={48} color="var(--primary-light)" />
            <h3>No caterers found</h3>
            <p>Try a different city or search term.</p>
          </div>
        ) : (
          <div className="caterers-grid">
            {filteredCaterers.map(caterer => (
              <CatererCard key={caterer._id} caterer={caterer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
