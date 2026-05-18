import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CuisineFilter.css';

const CUISINES = [
  { name: 'South Indian', emoji: '🍚', color: '#FEF08A' }, // Yellow
  { name: 'North Indian', emoji: '🍛', color: '#FED7AA' }, // Orange
  { name: 'Biryani',      emoji: '🥘', color: '#FECACA' }, // Red
  { name: 'Desserts',     emoji: '🍰', color: '#FBCFE8' }, // Pink
  { name: 'Ice Cream',    emoji: '🍦', color: '#E9D5FF' }, // Purple
  { name: 'Chinese',      emoji: '🥡', color: '#BFDBFE' }, // Blue
  { name: 'Burger',       emoji: '🍔', color: '#FDE68A' }, // Warm Yellow
  { name: 'Rolls',        emoji: '🌯', color: '#A7F3D0' }, // Emerald
  { name: 'Noodles',      emoji: '🍜', color: '#BAE6FD' }, // Light Blue
  { name: 'Idli',         emoji: '⚪', color: '#E5E7EB' }, // Gray
  { name: 'Momo',         emoji: '🥟', color: '#FEE2E2' }, // Light Red
  { name: 'Shawarma',     emoji: '🥙', color: '#D9F99D' }, // Lime
  { name: 'Pastry',       emoji: '🥐', color: '#FDE047' }, // Yellow Dark
  { name: 'Pasta',        emoji: '🍝', color: '#FECDD3' }, // Rose
];

const CuisineFilter = ({ selected, onSelect }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  return (
    <div className="cuisine-filter-wrap">
      <button className="cuisine-scroll-btn left" onClick={() => scroll(-1)}>
        <ChevronLeft size={20} />
      </button>

      <div className="cuisine-scroll" ref={scrollRef}>
        {CUISINES.map(c => (
          <button
            key={c.name}
            className={`cuisine-chip ${selected === c.name ? 'cuisine-chip-active' : ''}`}
            onClick={() => onSelect(selected === c.name ? '' : c.name)}
          >
            <div className="cuisine-emoji-container" style={{ backgroundColor: selected === c.name ? 'var(--primary-color)' : c.color }}>
              <span className="cuisine-emoji">{c.emoji}</span>
            </div>
            <span className="cuisine-label">{c.name}</span>
          </button>
        ))}
      </div>

      <button className="cuisine-scroll-btn right" onClick={() => scroll(1)}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default CuisineFilter;
