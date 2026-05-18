import React, { useState, useEffect } from 'react';
import {
  Plus, X, ChefHat, MapPin, DollarSign, Star,
  CalendarDays, ChevronLeft, ChevronRight,
  Utensils, Footprints, Clock
} from 'lucide-react';
import api from '../services/api';
import './TiffinSchedule.css';

const MealIcons = {
  morning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
    </svg>
  ),
  noon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  evening: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="9" x2="12" y2="2" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="8" y1="6" x2="8" y2="6" />
      <line x1="12" y1="4" x2="12" y2="4" />
      <line x1="16" y1="6" x2="16" y2="6" />
    </svg>
  ),
  night: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

const MEAL_SLOTS = [
  { id: 'morning', label: 'Morning'   },
  { id: 'noon',    label: 'Afternoon' },
  { id: 'evening', label: 'Evening'   },
  { id: 'night',   label: 'Night'     },
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Return the Monday of the week that is `offsetWeeks` from current week */
function getWeekStart(offsetWeeks = 0) {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon + offsetWeeks * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/** Build array of 7 day objects for a week starting on `monday` */
function buildWeekDays(monday) {
  return DAY_NAMES.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      name,
      date: d,
      label: d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }),
      key: d.toISOString().slice(0, 10),
      isPast: d < new Date(new Date().setHours(0, 0, 0, 0)),
    };
  });
}

/** Generate upcoming weeks (current + next N) — auto-skips past weeks */
function getUpcomingWeeks(count = 10) {
  const weeks = [];
  for (let i = 0; i < count; i++) {
    const monday = getWeekStart(i);
    const days = buildWeekDays(monday);
    // Only include weeks that aren't fully past
    if (!days.every(d => d.isPast)) {
      weeks.push({ offset: i, monday, days });
    }
  }
  return weeks;
}

/* ─────────────────────────────── */
const TiffinSchedule = () => {
  const [view, setView] = useState('picker'); // 'picker' | 'grid'
  const [activeWeek, setActiveWeek] = useState(null);
  const [schedule, setSchedule] = useState({});

  /* Picker state */
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSlot, setPickerSlot] = useState(null);
  const [caterers, setCaterers] = useState([]);
  const [loadingCaterers, setLoadingCaterers] = useState(false);
  const [search, setSearch] = useState('');

  const weeks = getUpcomingWeeks(10);

  /* Load caterers when picker opens */
  useEffect(() => {
    if (!pickerOpen) return;
    setLoadingCaterers(true);
    api.get('/caterers')
      .then(r => setCaterers(r.data))
      .catch(() => setCaterers([]))
      .finally(() => setLoadingCaterers(false));
  }, [pickerOpen]);

  const openPicker = (dayKey, mealId) => {
    setPickerSlot({ dayKey, mealId });
    setSearch('');
    setPickerOpen(true);
  };

  const selectCaterer = (caterer) => {
    const key = `${pickerSlot.dayKey}_${pickerSlot.mealId}`;
    setSchedule(prev => ({ ...prev, [key]: { type: 'caterer', caterer } }));
    setPickerOpen(false);
  };

  const selectNone = () => {
    const key = `${pickerSlot.dayKey}_${pickerSlot.mealId}`;
    setSchedule(prev => ({ ...prev, [key]: { type: 'none' } }));
    setPickerOpen(false);
  };

  const clearSlot = (dayKey, mealId) => {
    const key = `${dayKey}_${mealId}`;
    setSchedule(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const countPlanned = (week) =>
    Object.keys(schedule).filter(k => week.days.some(d => k.startsWith(d.key))).length;

  const filteredCaterers = caterers.filter(c =>
    c.serviceName.toLowerCase().includes(search.toLowerCase()) ||
    c.cuisine.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  /* ── WEEK PICKER VIEW ── */
  if (view === 'picker') {
    return (
      <div className="ts-page">
        <div className="ts-header">
          <div className="container ts-header-inner">
            <CalendarDays size={26} color="var(--primary-color)" />
            <div>
              <h1 className="ts-title">Tiffin Schedule</h1>
              <p className="ts-subtitle">Plan your meals week by week. Past weeks auto-removed.</p>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="ts-week-grid">
            {weeks.map((week, idx) => {
              const planned = countPlanned(week);
              const label = idx === 0 ? 'This Week' : idx === 1 ? 'Next Week' : `Week ${idx + 1}`;
              const rangeStr = `${week.days[0].label} – ${week.days[6].label}`;

              return (
                <button
                  key={week.offset}
                  className="ts-week-card"
                  onClick={() => { setActiveWeek(week); setView('grid'); }}
                >
                  {idx === 0 && <span className="ts-wc-current-badge">Current</span>}
                  <div className="ts-wc-top">
                    <span className="ts-wc-label">{label}</span>
                    {planned > 0 && <span className="ts-wc-count">{planned} meals</span>}
                  </div>
                  <p className="ts-wc-range">{rangeStr}</p>

                  {/* Mini day strip */}
                  <div className="ts-wc-strip">
                    {week.days.map(d => {
                      const hasSlot = Object.keys(schedule).some(k => k.startsWith(d.key));
                      const isToday = d.key === new Date().toISOString().slice(0, 10);
                      return (
                        <div
                          key={d.key}
                          className={`ts-wc-day ${d.isPast ? 'ts-wc-day-past' : ''} ${hasSlot ? 'ts-wc-day-filled' : ''} ${isToday ? 'ts-wc-day-today' : ''}`}
                        >
                          <span className="ts-wc-dname">{d.name}</span>
                          <span className="ts-wc-dnum">{d.date.getDate()}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="ts-wc-cta">
                    {planned > 0 ? 'Edit schedule' : 'Plan meals'} <ChevronRight size={15} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ── GRID VIEW ── */
  const days = activeWeek?.days || [];

  return (
    <div className="ts-page">
      {/* Header */}
      <div className="ts-header">
        <div className="container ts-header-inner">
          <button className="ts-back" onClick={() => setView('picker')}>
            <ChevronLeft size={16} /> Weeks
          </button>
          <div className="ts-header-title-group">
            <CalendarDays size={22} color="var(--primary-color)" />
            <div>
              <h1 className="ts-title" style={{ fontSize: '1.25rem' }}>
                {weeks.findIndex(w => w.offset === activeWeek?.offset) === 0 ? 'This Week' :
                 weeks.findIndex(w => w.offset === activeWeek?.offset) === 1 ? 'Next Week' :
                 `Week ${weeks.findIndex(w => w.offset === activeWeek?.offset) + 1}`}
              </h1>
              <p className="ts-subtitle">{days[0]?.label} – {days[6]?.label}</p>
            </div>
          </div>
          {/* Prev / Next week */}
          <div className="ts-week-nav">
            <button
              disabled={weeks.findIndex(w => w.offset === activeWeek?.offset) === 0}
              onClick={() => {
                const idx = weeks.findIndex(w => w.offset === activeWeek?.offset);
                if (idx > 0) setActiveWeek(weeks[idx - 1]);
              }}
            ><ChevronLeft size={16} /></button>
            <button onClick={() => {
              const idx = weeks.findIndex(w => w.offset === activeWeek?.offset);
              if (idx < weeks.length - 1) setActiveWeek(weeks[idx + 1]);
            }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Day columns */}
      <div className="ts-grid-outer">
        <div className="container">
          <div className="ts-day-cols">
            {days.map(day => (
              <div key={day.key} className={`ts-day-card ${day.isPast ? 'ts-day-past' : ''}`}>
                {/* Day header */}
                <div className={`ts-day-head ${day.key === new Date().toISOString().slice(0,10) ? 'ts-day-today' : ''}`}>
                  <span className="ts-dname">{day.name}</span>
                  <span className="ts-ddate">{day.label}</span>
                  {day.key === new Date().toISOString().slice(0,10) && (
                    <span className="ts-today-dot" />
                  )}
                </div>

                {/* Meal slot cells */}
                <div className="ts-meals">
                  {MEAL_SLOTS.map(slot => {
                    const key = `${day.key}_${slot.id}`;
                    const entry = schedule[key];

                    return (
                      <div
                        key={slot.id}
                        className={`ts-meal-cell ${entry ? (entry.type === 'none' ? 'ts-cell-none' : 'ts-cell-filled') : ''}`}
                        onClick={() => !day.isPast && !entry && openPicker(day.key, slot.id)}
                      >
                        {/* Slot label pill */}
                        <div className="ts-meal-pill">
                          <div className="ts-meal-icon-circle">
                            {MealIcons[slot.id]}
                          </div>
                          <span className="ts-meal-name">{slot.label}</span>
                        </div>

                        {/* Content area */}
                        <div className="ts-meal-content">
                          {entry ? (
                            entry.type === 'none' ? (
                              <div className="ts-none-entry">
                                <Footprints size={20} color="#9CA3AF" />
                                <span>Going out</span>
                              </div>
                            ) : (
                              <div className="ts-caterer-entry">
                                <div className="ts-ce-photo">
                                  {entry.caterer.photos?.[0]
                                    ? <img src={entry.caterer.photos[0]} alt={entry.caterer.serviceName} />
                                    : <Utensils size={16} color="var(--primary-light)" />
                                  }
                                </div>
                                <div className="ts-ce-info">
                                  <p className="ts-ce-name">{entry.caterer.serviceName}</p>
                                  <p className="ts-ce-cuisine">{entry.caterer.cuisine}</p>
                                </div>
                              </div>
                            )
                          ) : day.isPast ? (
                            <span className="ts-past-label">–</span>
                          ) : (
                            <button className="ts-add-btn" onClick={e => { e.stopPropagation(); openPicker(day.key, slot.id); }}>
                              <Plus size={18} />
                              <span>Add</span>
                            </button>
                          )}
                        </div>

                        {/* Remove button */}
                        {entry && !day.isPast && (
                          <button
                            className="ts-clear-btn"
                            onClick={e => { e.stopPropagation(); clearSlot(day.key, slot.id); }}
                          >
                            <X size={11} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caterer Picker Modal */}
      {pickerOpen && (
        <div className="ts-modal-overlay" onClick={() => setPickerOpen(false)}>
          <div className="ts-modal" onClick={e => e.stopPropagation()}>
            <div className="ts-modal-head">
              <div>
                <p className="ts-modal-title">Pick for {MEAL_SLOTS.find(s => s.id === pickerSlot?.mealId)?.label}</p>
                <p className="ts-modal-sub">
                  {MEAL_SLOTS.find(s => s.id === pickerSlot?.mealId)?.label} ·{' '}
                  {activeWeek?.days.find(d => d.key === pickerSlot?.dayKey)?.name},{' '}
                  {activeWeek?.days.find(d => d.key === pickerSlot?.dayKey)?.label}
                </p>
              </div>
              <button className="ts-modal-close" onClick={() => setPickerOpen(false)}><X size={18} /></button>
            </div>

            {/* None option */}
            <button className="ts-none-option" onClick={selectNone}>
              <div className="ts-none-icon"><Footprints size={20} /></div>
              <div>
                <p className="ts-none-title">None / Going Out</p>
                <p className="ts-none-desc">Mark this slot as skipped</p>
              </div>
            </button>

            <div className="ts-modal-divider"><span>or choose a caterer</span></div>

            <div className="ts-modal-search-row">
              <ChefHat size={15} className="ts-search-icon" />
              <input
                type="text"
                placeholder="Search by name, cuisine, city…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="ts-modal-list">
              {loadingCaterers ? (
                <div className="ts-modal-empty"><div className="spinner" /></div>
              ) : filteredCaterers.length === 0 ? (
                <div className="ts-modal-empty">
                  <ChefHat size={32} color="var(--primary-light)" />
                  <p>No caterers found</p>
                </div>
              ) : filteredCaterers.map(c => (
                <button key={c._id} className="ts-caterer-row" onClick={() => selectCaterer(c)}>
                  <div className="ts-cr-photo">
                    {c.photos?.[0]
                      ? <img src={c.photos[0]} alt={c.serviceName} />
                      : <Utensils size={18} color="var(--primary-light)" />
                    }
                  </div>
                  <div className="ts-cr-info">
                    <p className="ts-cr-name">{c.serviceName}</p>
                    <div className="ts-cr-meta">
                      <span><Utensils size={10} /> {c.cuisine}</span>
                      <span><MapPin size={10} /> {c.location}</span>
                      <span><DollarSign size={10} /> {c.pricing}</span>
                    </div>
                  </div>
                  {c.numReviews > 0 && (
                    <div className="ts-cr-rating">
                      <Star size={11} fill="#F97316" color="#F97316" />
                      {Number(c.rating).toFixed(1)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiffinSchedule;
