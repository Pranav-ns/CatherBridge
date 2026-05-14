import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CuisineFilter.css';

const CUISINES = [
  { name: 'South Indian', emoji: '🍚' },
  { name: 'North Indian', emoji: '🍛' },
  { name: 'Biryani',      emoji: '🥘' },
  { name: 'Desserts',     emoji: '🍰' },
  { name: 'Ice Cream',    emoji: '🍦' },
  { name: 'Chinese',      emoji: '🥡' },
  { name: 'Burger',       emoji: '🍔' },
  { name: 'Rolls',        emoji: '🌯' },
  { name: 'Noodles',      emoji: '🍜' },
  { name: 'Idli',         emoji: '⚪' },
  { name: 'Momo',         emoji: '🥟' },
  { name: 'Shawarma',     emoji: '🥙' },
  { name: 'Pastry',       emoji: '🥐' },
  { name: 'Pasta',        emoji: '🍝' },
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
            <div className="cuisine-emoji-container">
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
