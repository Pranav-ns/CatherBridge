import React, { useState, useEffect } from 'react';
import { Plus, X, ChefHat, MapPin, DollarSign, Star, CalendarDays, ChevronLeft, ChevronRight, Clock, Utensils } from 'lucide-react';
import api from '../services/api';
import './TiffinSchedule.css';

const MEAL_SLOTS = [
  { id: 'morning',   label: 'Morning',   emoji: '🌅', time: '7–9 AM'   },
  { id: 'noon',      label: 'Noon',      emoji: '☀️', time: '12–2 PM'  },
  { id: 'evening',   label: 'Evening',   emoji: '🌇', time: '5–7 PM'   },
  { id: 'night',     label: 'Night',     emoji: '🌙', time: '8–10 PM'  },
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Get the Monday of the Nth upcoming week (weekOffset = 0 → this week)
function getWeekDates(weekOffset) {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon + weekOffset * 7);

  return DAY_NAMES.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      name,
      date: d,
      label: d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }),
      key: d.toISOString().slice(0, 10),
    };
  });
}

const TiffinSchedule = () => {
  const [selectedWeek, setSelectedWeek] = useState(null); // null = picker view
  const [weekOffset, setWeekOffset] = useState(0);        // 0 = current week
  const [schedule, setSchedule] = useState({});           // { "2025-05-19_morning": catererObj }

  // Caterer picker modal state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSlot, setPickerSlot] = useState(null);      // { dayKey, mealId }
  const [caterers, setCaterers] = useState([]);
  const [loadingCaterers, setLoadingCaterers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userCity = user?.city || '';

  // Fetch caterers when picker opens
  useEffect(() => {
    if (pickerOpen) {
      setLoadingCaterers(true);
      api.get('/caterers').then(res => {
        setCaterers(res.data);
      }).catch(() => {
        setCaterers([]);
      }).finally(() => setLoadingCaterers(false));
    }
  }, [pickerOpen]);

  const weekDays = getWeekDates(weekOffset);
  const weekLabel = `${weekDays[0].label} – ${weekDays[6].label}`;

  const openPicker = (dayKey, mealId) => {
    setPickerSlot({ dayKey, mealId });
    setSearchTerm('');
    setPickerOpen(true);
  };

  const selectCaterer = (caterer) => {
    const key = `${pickerSlot.dayKey}_${pickerSlot.mealId}`;
    setSchedule(prev => ({ ...prev, [key]: caterer }));
    setPickerOpen(false);
  };

  const removeSlot = (dayKey, mealId) => {
    const key = `${dayKey}_${mealId}`;
    setSchedule(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const filteredCaterers = caterers.filter(c =>
    c.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Week picker view
  if (selectedWeek === null) {
    const weeks = [0, 1, 2, 3].map(offset => {
      const days = getWeekDates(offset);
      return {
        offset,
        label: offset === 0 ? 'This Week' : offset === 1 ? 'Next Week' : `Week ${offset + 1}`,
        range: `${days[0].label} – ${days[6].label}`,
        days,
      };
    });

    return (
      <div className="tiffin-page">
        <div className="tiffin-header">
          <div className="tiffin-header-inner container">
            <div className="tiffin-title-row">
              <CalendarDays size={28} color="var(--primary-color)" />
              <div>
                <h1 className="tiffin-title">Tiffin Schedule</h1>
                <p className="tiffin-subtitle">Plan your daily meals for the week. Pick a caterer for each slot.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="week-picker-grid">
            {weeks.map(week => {
              const slotCount = Object.keys(schedule).filter(k =>
                week.days.some(d => k.startsWith(d.key))
              ).length;

              return (
                <button
                  key={week.offset}
                  className="week-card"
                  onClick={() => { setSelectedWeek(week.offset); setWeekOffset(week.offset); }}
                >
                  <div className="week-card-top">
                    <span className="week-card-label">{week.label}</span>
                    {slotCount > 0 && (
                      <span className="week-card-badge">{slotCount} planned</span>
                    )}
                  </div>
                  <p className="week-card-range">{week.range}</p>
                  <div className="week-card-days">
                    {week.days.map(d => {
                      const hasSlot = Object.keys(schedule).some(k => k.startsWith(d.key));
                      return (
                        <div key={d.key} className={`week-mini-day ${hasSlot ? 'week-mini-day-filled' : ''}`}>
                          <span className="week-mini-name">{d.name}</span>
                          <span className="week-mini-date">{d.date.getDate()}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="week-card-arrow">
                    Schedule <ChevronRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Schedule grid view
  return (
    <div className="tiffin-page">
      {/* Header */}
      <div className="tiffin-header">
        <div className="tiffin-header-inner container">
          <button className="tiffin-back-btn" onClick={() => setSelectedWeek(null)}>
            <ChevronLeft size={18} /> All Weeks
          </button>
          <div className="tiffin-title-row">
            <CalendarDays size={24} color="var(--primary-color)" />
            <div>
              <h1 className="tiffin-title">
                {weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Next Week' : `Week ${weekOffset + 1}`}
              </h1>
              <p className="tiffin-subtitle">{weekLabel}</p>
            </div>
          </div>
          <div className="tiffin-week-nav">
            <button disabled={weekOffset === 0} onClick={() => { setWeekOffset(w => w - 1); }}>
              <ChevronLeft size={18} />
            </button>
            <span>{weekLabel}</span>
            <button onClick={() => setWeekOffset(w => w + 1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="tiffin-grid-container container">
        <div className="tiffin-grid">
          {/* Sticky Meal Labels Column */}
          <div className="tiffin-meal-col">
            <div className="tiffin-meal-header-cell" />
            {MEAL_SLOTS.map(slot => (
              <div key={slot.id} className="tiffin-meal-label-cell">
                <span className="meal-emoji">{slot.emoji}</span>
                <div>
                  <div className="meal-slot-name">{slot.label}</div>
                  <div className="meal-slot-time">{slot.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDays.map(day => {
            const isPast = day.date < new Date(new Date().setHours(0, 0, 0, 0));
            return (
              <div key={day.key} className={`tiffin-day-col ${isPast ? 'tiffin-col-past' : ''}`}>
                {/* Day header */}
                <div className="tiffin-day-header">
                  <span className="tiffin-day-name">{day.name}</span>
                  <span className="tiffin-day-date">{day.label}</span>
                </div>

                {/* Meal Slots */}
                {MEAL_SLOTS.map(slot => {
                  const key = `${day.key}_${slot.id}`;
                  const assigned = schedule[key];
                  return (
                    <div key={slot.id} className={`tiffin-slot-cell ${assigned ? 'tiffin-slot-filled' : ''}`}>
                      {assigned ? (
                        <div className="tiffin-assigned-card">
                          <div className="assigned-photo">
                            {assigned.photos?.[0]
                              ? <img src={assigned.photos[0]} alt={assigned.serviceName} />
                              : <Utensils size={18} color="var(--primary-light)" />
                            }
                          </div>
                          <div className="assigned-info">
                            <p className="assigned-name">{assigned.serviceName}</p>
                            <p className="assigned-cuisine">{assigned.cuisine}</p>
                          </div>
                          <button className="assigned-remove" onClick={() => removeSlot(day.key, slot.id)}>
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="tiffin-add-btn"
                          onClick={() => openPicker(day.key, slot.id)}
                          disabled={isPast}
                        >
                          <Plus size={20} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Caterer Picker Modal */}
      {pickerOpen && (
        <div className="tiffin-modal-overlay" onClick={() => setPickerOpen(false)}>
          <div className="tiffin-modal" onClick={e => e.stopPropagation()}>
            <div className="tiffin-modal-header">
              <div>
                <h2 className="tiffin-modal-title">Choose a Caterer</h2>
                {pickerSlot && (
                  <p className="tiffin-modal-subtitle">
                    {MEAL_SLOTS.find(s => s.id === pickerSlot.mealId)?.emoji}{' '}
                    {MEAL_SLOTS.find(s => s.id === pickerSlot.mealId)?.label} ·{' '}
                    {weekDays.find(d => d.key === pickerSlot.dayKey)?.name},{' '}
                    {weekDays.find(d => d.key === pickerSlot.dayKey)?.label}
                  </p>
                )}
              </div>
              <button className="tiffin-modal-close" onClick={() => setPickerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="tiffin-modal-search">
              <ChefHat size={16} className="modal-search-icon" />
              <input
                type="text"
                placeholder="Search caterer or cuisine..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="tiffin-modal-list">
              {loadingCaterers ? (
                <div className="tiffin-loading"><div className="spinner" /></div>
              ) : filteredCaterers.length === 0 ? (
                <div className="tiffin-empty">
                  <ChefHat size={36} color="var(--primary-light)" />
                  <p>No caterers found</p>
                </div>
              ) : (
                filteredCaterers.map(c => (
                  <button key={c._id} className="tiffin-caterer-row" onClick={() => selectCaterer(c)}>
                    <div className="tiffin-caterer-photo">
                      {c.photos?.[0]
                        ? <img src={c.photos[0]} alt={c.serviceName} />
                        : <Utensils size={20} color="var(--primary-light)" />
                      }
                    </div>
                    <div className="tiffin-caterer-info">
                      <p className="tc-name">{c.serviceName}</p>
                      <div className="tc-meta">
                        <span><Utensils size={11} /> {c.cuisine}</span>
                        <span><MapPin size={11} /> {c.location}</span>
                        <span><DollarSign size={11} /> {c.pricing}</span>
                      </div>
                    </div>
                    {c.numReviews > 0 && (
                      <div className="tc-rating">
                        <Star size={12} fill="#F97316" color="#F97316" />
                        {Number(c.rating).toFixed(1)}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiffinSchedule;
