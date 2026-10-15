import React from 'react';

/**
 * 64x64px Editorial Minimalist Inline SVG Drink Thumbnail
 * Dynamically renders cup shape, color layers, ice cubes, and toppings based on drink profile
 */
export default function DrinkThumbnail({ drink, size = 64, className = '' }) {
  if (!drink) return null;

  const name = drink.name || '';
  const category = drink.category || '';
  const isDecaf = category === '디카페인' || name.includes('디카페인');

  // Determine drink visual type
  const getType = () => {
    if (name.includes('말차') || name.includes('그린티')) return 'matcha';
    if (name.includes('딸기') || name.includes('프라페') || name.includes('빽스치노') || name.includes('퐁크러쉬') || name.includes('쉐이크') || category === '프라페' || category === '스무디') return 'frappe';
    if (name.includes('에이드') || name.includes('자몽') || name.includes('주스') || name.includes('유자') || category === '티/에이드' || category === '에이드') return 'ade';
    if (name.includes('아샷추') || name.includes('아이스티') || name.includes('블랙 티')) return 'iced-tea';
    if (name.includes('라떼') || name.includes('마키아또') || name.includes('플랫화이트') || name.includes('카푸치노') || name.includes('딜라이트') || name.includes('아인슈페너') || category === '라떼') return 'latte';
    if (name.includes('초콜릿') || name.includes('초코')) return 'chocolate';
    if (isDecaf) return 'decaf';
    if (name.includes('콜드 브루') || name.includes('콜드브루') || category === '콜드브루') return 'coldbrew';
    return 'americano';
  };

  const type = getType();

  // Color Palettes for Warm Editorial Minimalism
  const palettes = {
    americano: {
      bg: '#F5EFE6',
      liquidTop: '#422A1D',
      liquidBottom: '#22150E',
      layer: null,
      ice: true,
      accent: '#6E4731'
    },
    coldbrew: {
      bg: '#F2EFEB',
      liquidTop: '#2B1B14',
      liquidBottom: '#150C08',
      layer: null,
      ice: true,
      accent: '#472E21'
    },
    latte: {
      bg: '#FBF4EB',
      liquidTop: '#D6BEA2',
      liquidBottom: '#6B4423',
      layer: '#F7EDE1', // milk froth
      ice: true,
      accent: '#E6D3BF'
    },
    matcha: {
      bg: '#F0F5EC',
      liquidTop: '#759B6C',
      liquidBottom: '#3B5E34',
      layer: '#E8F2E2', // matcha foam
      ice: true,
      accent: '#557F4D'
    },
    ade: {
      bg: '#FDF0ED',
      liquidTop: '#F38C74',
      liquidBottom: '#DC5A3E',
      layer: '#FCD7CD',
      ice: true,
      accent: '#EB684D'
    },
    'iced-tea': {
      bg: '#FDF3E8',
      liquidTop: '#D98236',
      liquidBottom: '#964817',
      layer: null,
      ice: true,
      accent: '#C46A25'
    },
    frappe: {
      bg: '#FAF0F3',
      liquidTop: '#DE6B88',
      liquidBottom: '#B23A57',
      layer: '#FFFFFF', // whipped cream
      ice: false,
      isFrappe: true,
      accent: '#E890A6'
    },
    chocolate: {
      bg: '#F4ECE7',
      liquidTop: '#5C3826',
      liquidBottom: '#361D11',
      layer: '#D4B8A6',
      ice: true,
      accent: '#442617'
    },
    decaf: {
      bg: '#EEF3EE',
      liquidTop: '#556E56',
      liquidBottom: '#2E412F',
      layer: null,
      ice: true,
      accent: '#5B7A5E'
    }
  };

  const p = palettes[type] || palettes.americano;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 overflow-hidden rounded-2xl flex items-center justify-center shadow-xs border border-[#EFECE6]/80 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Background fill */}
          <linearGradient id={`bg-${drink.id}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor={p.bg} />
            <stop offset="1" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Liquid Gradient */}
          <linearGradient id={`liquid-${drink.id}`} x1="32" y1="20" x2="32" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor={p.liquidTop} />
            <stop offset="1" stopColor={p.liquidBottom} />
          </linearGradient>

          {/* Cup Glass Highlight */}
          <linearGradient id={`cup-glass-${drink.id}`} x1="16" y1="16" x2="48" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Backdrop Rectangle */}
        <rect width="64" height="64" rx="16" fill={`url(#bg-${drink.id})`} />

        {/* Ambient Ring */}
        <circle cx="32" cy="34" r="24" fill={p.accent} fillOpacity="0.07" />

        {/* Cup Shadow */}
        <ellipse cx="32" cy="54" rx="12" ry="2.5" fill="#231915" fillOpacity="0.08" />

        {/* CUP BODY */}
        {/* Cup Base Shape (Tapered Glass / Cup) */}
        <path
          d="M20 18L24 50C24.2 51.5 25.5 52 27 52H37C38.5 52 39.8 51.5 40 50L44 18H20Z"
          fill="#FFFFFF"
          fillOpacity="0.9"
          stroke="#E5DFD7"
          strokeWidth="1.2"
        />

        {/* LIQUID FILL (Masked to cup) */}
        <path
          d="M21 24L24.3 49.5C24.5 50.5 25.5 51 27 51H37C38.5 51 39.5 50.5 39.7 49.5L43 24C43 24 37.5 26 32 26C26.5 26 21 24 21 24Z"
          fill={`url(#liquid-${drink.id})`}
        />

        {/* SPECIAL MILK/CREAM LAYER FOR LATTE, MATCHA, CHOCOLATE */}
        {p.layer && (
          <path
            d="M20.8 22L22 28.5C26 29.5 38 29.5 42 28.5L43.2 22C43.2 22 38 23.5 32 23.5C26 23.5 20.8 22 20.8 22Z"
            fill={p.layer}
            fillOpacity="0.95"
          />
        )}

        {/* WHIPPED CREAM DOME FOR FRAPPE */}
        {p.isFrappe && (
          <path
            d="M23 18C23 13 28 10 32 10C36 10 41 13 41 18H23Z"
            fill="#FFFFFF"
            stroke="#EFECE6"
            strokeWidth="0.8"
          />
        )}

        {/* ICE CUBES (If cold/iced) */}
        {p.ice && (
          <>
            {/* Top Ice Cube */}
            <rect
              x="25"
              y="22"
              width="6.5"
              height="6.5"
              rx="1.5"
              transform="rotate(12 25 22)"
              fill="#FFFFFF"
              fillOpacity="0.45"
              stroke="#FFFFFF"
              strokeWidth="0.8"
            />
            {/* Second Ice Cube */}
            <rect
              x="32"
              y="25"
              width="5.5"
              height="5.5"
              rx="1.2"
              transform="rotate(-15 32 25)"
              fill="#FFFFFF"
              fillOpacity="0.38"
              stroke="#FFFFFF"
              strokeWidth="0.7"
            />
          </>
        )}

        {/* STRAW (For Ade / Frappe / Iced Tea) */}
        {(type === 'ade' || type === 'frappe' || type === 'iced-tea') && (
          <line
            x1="38"
            y1="7"
            x2="32"
            y2="36"
            stroke={p.accent}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
        )}

        {/* CUP RIM (Top Ellipse) */}
        <ellipse
          cx="32"
          cy="18"
          rx="12"
          ry="2"
          fill="#FFFFFF"
          fillOpacity="0.5"
          stroke="#DFD8CE"
          strokeWidth="1.2"
        />

        {/* GLASS HIGHLIGHT (Sleek light reflection on the left) */}
        <path
          d="M22 20L25 48"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* DECAF LEAF EMBLEM */}
        {isDecaf && (
          <g transform="translate(40, 10)">
            <circle cx="6" cy="6" r="6" fill="#5B7A5E" />
            <path
              d="M4 6C4 4 6 3 8 3C8 5 7 8 4 8C4 8 4 7 4 6Z"
              fill="#FFFFFF"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
