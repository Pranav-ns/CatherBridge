import React from 'react';

const SVG_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 64 64",
  width: "48",
  height: "48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// Toronto — CN Tower
export const TorontoIcon = () => (
  <svg {...SVG_PROPS}>
    <line x1="32" y1="6" x2="32" y2="58" />
    <ellipse cx="32" cy="28" rx="8" ry="4" />
    <ellipse cx="32" cy="24" rx="4" ry="2.5" />
    <line x1="28" y1="30" x2="20" y2="44" />
    <line x1="36" y1="30" x2="44" y2="44" />
    <line x1="18" y1="44" x2="46" y2="44" />
    <line x1="16" y1="50" x2="48" y2="50" />
    <line x1="14" y1="55" x2="50" y2="55" />
  </svg>
);

// Vancouver — Suspension Bridge + Mountains
export const VancouverIcon = () => (
  <svg {...SVG_PROPS}>
    <polyline points="8,50 20,20 32,14 44,20 56,50" />
    <polyline points="8,38 20,20" />
    <polyline points="56,38 44,20" />
    <line x1="20" y1="20" x2="20" y2="50" />
    <line x1="44" y1="20" x2="44" y2="50" />
    <path d="M8,50 Q32,42 56,50" />
    <line x1="8" y1="50" x2="56" y2="50" />
    <polyline points="12,50 18,35 24,50" />
    <polyline points="38,50 44,32 50,50" />
  </svg>
);

// Montreal — Notre-Dame Basilica twin towers
export const MontrealIcon = () => (
  <svg {...SVG_PROPS}>
    <rect x="10" y="28" width="16" height="28" />
    <rect x="38" y="28" width="16" height="28" />
    <polygon points="10,28 18,12 26,28" />
    <polygon points="38,28 46,12 54,28" />
    <rect x="26" y="38" width="12" height="18" />
    <path d="M26,38 Q32,32 38,38" />
    <rect x="15" y="36" width="6" height="8" />
    <rect x="43" y="36" width="6" height="8" />
    <line x1="30" y1="12" x2="34" y2="12" />
    <line x1="32" y1="10" x2="32" y2="14" />
  </svg>
);

// Calgary — Mountains + Stampede hat
export const CalgaryIcon = () => (
  <svg {...SVG_PROPS}>
    <polyline points="4,54 20,22 32,10 44,22 60,54" />
    <polyline points="4,40 20,22" />
    <polyline points="60,40 44,22" />
    <polyline points="14,54 24,34 34,44 44,26 54,54" />
    <line x1="4" y1="54" x2="60" y2="54" />
  </svg>
);

// Ottawa — Parliament Hill Centre Block
export const OttawaIcon = () => (
  <svg {...SVG_PROPS}>
    <rect x="12" y="34" width="40" height="22" />
    <rect x="16" y="28" width="32" height="8" />
    <polygon points="28,10 32,4 36,10" />
    <rect x="29" y="10" width="6" height="18" />
    <rect x="12" y="34" width="12" height="22" />
    <rect x="40" y="34" width="12" height="22" />
    <rect x="20" y="40" width="6" height="10" />
    <rect x="38" y="40" width="6" height="10" />
    <rect x="28" y="42" width="8" height="14" />
    <line x1="8" y1="56" x2="56" y2="56" />
  </svg>
);

// Edmonton — Muttart Conservatory Pyramids
export const EdmontonIcon = () => (
  <svg {...SVG_PROPS}>
    <polygon points="16,52 4,52 10,28" />
    <polygon points="34,52 14,52 24,16" />
    <polygon points="54,52 34,52 44,28" />
    <polygon points="60,52 46,52 53,34" />
    <line x1="4" y1="52" x2="60" y2="52" />
  </svg>
);

// Winnipeg — Legislative Building dome
export const WinnipegIcon = () => (
  <svg {...SVG_PROPS}>
    <rect x="8" y="40" width="48" height="16" />
    <rect x="14" y="34" width="36" height="8" />
    <path d="M20,34 Q32,16 44,34" />
    <rect x="29" y="20" width="6" height="16" />
    <circle cx="32" cy="18" r="4" />
    <line x1="32" y1="14" x2="32" y2="10" />
    <line x1="30" y1="10" x2="34" y2="10" />
    <rect x="16" y="44" width="8" height="12" />
    <rect x="40" y="44" width="8" height="12" />
    <rect x="28" y="46" width="8" height="10" />
    <line x1="6" y1="56" x2="58" y2="56" />
  </svg>
);

// Quebec City — Château Frontenac castle
export const QuebecIcon = () => (
  <svg {...SVG_PROPS}>
    <rect x="10" y="32" width="44" height="24" />
    <rect x="10" y="24" width="14" height="10" />
    <rect x="40" y="24" width="14" height="10" />
    <polygon points="10,24 17,12 24,24" />
    <polygon points="40,24 47,12 54,24" />
    <rect x="24" y="28" width="16" height="28" />
    <polygon points="24,28 32,16 40,28" />
    <rect x="27" y="16" width="4" height="12" />
    <rect x="14" y="40" width="6" height="16" />
    <rect x="44" y="40" width="6" height="16" />
    <rect x="28" y="42" width="8" height="14" />
    <line x1="8" y1="56" x2="56" y2="56" />
  </svg>
);

// Hamilton — Skyway Bridge
export const HamiltonIcon = () => (
  <svg {...SVG_PROPS}>
    <line x1="4" y1="46" x2="60" y2="46" />
    <path d="M4,46 Q32,12 60,46" />
    <line x1="18" y1="46" x2="22" y2="26" />
    <line x1="46" y1="46" x2="42" y2="26" />
    <line x1="22" y1="26" x2="42" y2="26" />
    <line x1="24" y1="46" x2="26" y2="32" />
    <line x1="40" y1="46" x2="38" y2="32" />
    <line x1="30" y1="46" x2="31" y2="36" />
    <line x1="34" y1="46" x2="33" y2="36" />
    <line x1="4" y1="50" x2="60" y2="50" />
    <path d="M4,52 Q10,56 16,52 Q22,48 28,52 Q34,56 40,52 Q46,48 52,52 Q58,56 60,52" />
  </svg>
);

// Halifax — Lighthouse
export const HalifaxIcon = () => (
  <svg {...SVG_PROPS}>
    <polygon points="22,58 42,58 38,22 26,22" />
    <rect x="26" y="16" width="12" height="8" />
    <rect x="24" y="12" width="16" height="5" />
    <line x1="32" y1="8" x2="32" y2="12" />
    <path d="M24,12 Q32,8 40,12" />
    <line x1="40" y1="14" x2="48" y2="8" />
    <line x1="24" y1="14" x2="16" y2="8" />
    <line x1="32" y1="10" x2="32" y2="4" />
    <rect x="26" y="36" width="12" height="6" />
    <rect x="28" y="46" width="8" height="4" />
    <line x1="16" y1="58" x2="48" y2="58" />
    <line x1="12" y1="54" x2="52" y2="54" />
    <path d="M12,56 Q18,60 24,56 Q30,52 36,56 Q42,60 48,56 Q54,52 60,56" />
  </svg>
);

// Brampton — Rose City Hall (circular arch)
export const BramptonIcon = () => (
  <svg {...SVG_PROPS}>
    <path d="M12,54 L12,30 Q12,10 32,10 Q52,10 52,30 L52,54" />
    <path d="M20,54 L20,32 Q20,18 32,18 Q44,18 44,32 L44,54" />
    <rect x="8" y="50" width="48" height="6" />
    <line x1="32" y1="10" x2="32" y2="54" />
    <rect x="28" y="40" width="8" height="12" />
    <line x1="16" y1="54" x2="16" y2="32" />
    <line x1="48" y1="54" x2="48" y2="32" />
    <line x1="8" y1="56" x2="56" y2="56" />
  </svg>
);

// Mississauga — Absolute World twisted towers
export const MississaugaIcon = () => (
  <svg {...SVG_PROPS}>
    {/* Left tower with gentle twist */}
    <path d="M14,56 L12,44 L15,32 L12,20 L14,8 L22,8 L24,20 L21,32 L24,44 L22,56 Z" />
    {/* Right tower */}
    <path d="M32,56 L30,46 L34,34 L30,22 L32,10 L42,10 L44,22 L40,34 L44,46 L42,56 Z" />
    <line x1="10" y1="56" x2="48" y2="56" />
  </svg>
);

const CITY_ICONS = {
  Toronto:      TorontoIcon,
  Vancouver:    VancouverIcon,
  Montreal:     MontrealIcon,
  Calgary:      CalgaryIcon,
  Ottawa:       OttawaIcon,
  Edmonton:     EdmontonIcon,
  Winnipeg:     WinnipegIcon,
  'Quebec City': QuebecIcon,
  Hamilton:     HamiltonIcon,
  Halifax:      HalifaxIcon,
  Brampton:     BramptonIcon,
  Mississauga:  MississaugaIcon,
};

export default CITY_ICONS;
