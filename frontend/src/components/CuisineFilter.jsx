import React, { useRef, useState } from 'react';
import './CuisineFilter.css';

const CUISINES = [
  { name: 'South Indian', emoji: '🍚', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FDE68A 100%)',    tag: 'Bestseller' },
  { name: 'North Indian', emoji: '🍛', gradient: 'linear-gradient(135deg, #F97316 0%, #FED7AA 100%)',    tag: 'Popular'    },
  { name: 'Biryani',      emoji: '🥘', gradient: 'linear-gradient(135deg, #DC2626 0%, #FCA5A5 100%)',    tag: 'Must Try'   },
  { name: 'Desserts',     emoji: '🍰', gradient: 'linear-gradient(135deg, #EC4899 0%, #FBCFE8 100%)',    tag: null         },
  { name: 'Ice Cream',    emoji: '🍦', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #DDD6FE 100%)',    tag: null         },
  { name: 'Chinese',      emoji: '🥡', gradient: 'linear-gradient(135deg, #3B82F6 0%, #BFDBFE 100%)',    tag: 'Trending'   },
  { name: 'Burger',       emoji: '🍔', gradient: 'linear-gradient(135deg, #D97706 0%, #FDE68A 100%)',    tag: null         },
  { name: 'Rolls',        emoji: '🌯', gradient: 'linear-gradient(135deg, #059669 0%, #A7F3D0 100%)',    tag: null         },
  { name: 'Noodles',      emoji: '🍜', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #BAE6FD 100%)',    tag: null         },
  { name: 'Momo',         emoji: '🥟', gradient: 'linear-gradient(135deg, #E11D48 0%, #FEE2E2 100%)',    tag: 'New'        },
  { name: 'Shawarma',     emoji: '🥙', gradient: 'linear-gradient(135deg, #65A30D 0%, #D9F99D 100%)',    tag: null         },
  { name: 'Pastry',       emoji: '🥐', gradient: 'linear-gradient(135deg, #CA8A04 0%, #FDE047 100%)',    tag: null         },
  { name: 'Pasta',        emoji: '🍝', gradient: 'linear-gradient(135deg, #DB2777 0%, #FECDD3 100%)',    tag: null         },
  { name: 'Thali',        emoji: '🍱', gradient: 'linear-gradient(135deg, #7C3AED 0%, #EDE9FE 100%)',    tag: null         },
];

const CuisineFilter = ({ selected, onSelect }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <div className="cf-root">
      <div
        className={`cf-scroll ${isDragging ? 'cf-dragging' : ''}`}
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {CUISINES.map((c) => {
          const isActive = selected === c.name;
          return (
            <button
              key={c.name}
              className={`cf-card ${isActive ? 'cf-card-active' : ''}`}
              onClick={() => onSelect(isActive ? '' : c.name)}
              style={{ backgroundImage: c.gradient }}
            >
              {c.tag && <span className="cf-tag">{c.tag}</span>}
              <div className="cf-emoji-wrap">
                <span className="cf-emoji">{c.emoji}</span>
              </div>
              <p className="cf-name">{c.name}</p>
              {isActive && <div className="cf-active-ring" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CuisineFilter;
