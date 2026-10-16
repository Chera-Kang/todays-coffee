import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import DrinkThumbnail from './DrinkThumbnail';

const BRAND_STYLES = {
  starbucks: {
    badgeBg: 'bg-[#EBF5F0]',
    badgeText: 'text-[#00704A]',
    dot: 'bg-[#00704A]'
  },
  megacoffee: {
    badgeBg: 'bg-[#FEF9E6]',
    badgeText: 'text-[#8A6D00]',
    dot: 'bg-[#D4A017]'
  },
  compose: {
    badgeBg: 'bg-[#FFF7EB]',
    badgeText: 'text-[#A05E00]',
    dot: 'bg-[#E69C24]'
  },
  paulbassett: {
    badgeBg: 'bg-[#FAEAEC]',
    badgeText: 'text-[#A6192E]',
    dot: 'bg-[#A6192E]'
  },
  twosome: {
    badgeBg: 'bg-[#FDF0F0]',
    badgeText: 'text-[#D62734]',
    dot: 'bg-[#D62734]'
  },
  ediya: {
    badgeBg: 'bg-[#EDF2FA]',
    badgeText: 'text-[#1B3B8A]',
    dot: 'bg-[#1B3B8A]'
  },
  paik: {
    badgeBg: 'bg-[#FEFCE8]',
    badgeText: 'text-[#926004]',
    dot: 'bg-[#F5B800]'
  },
  hollys: {
    badgeBg: 'bg-[#FDF2F3]',
    badgeText: 'text-[#BA1828]',
    dot: 'bg-[#BA1828]'
  }
};

export default function DrinkCard({ drink, onSelectDrink, topSlot }) {
  const brandStyle = BRAND_STYLES[drink.brandId] || {
    badgeBg: 'bg-[#EFECE6]',
    badgeText: 'text-[#231915]',
    dot: 'bg-[#78716C]'
  };

  // Daily Reference Values
  const MAX_CAFFEINE = 400; // mg
  const MAX_SUGAR = 50;     // g

  const caffeinePercent = Math.min(Math.round((drink.caffeine / MAX_CAFFEINE) * 100), 100);
  const sugarPercent = Math.min(Math.round((drink.sugar / MAX_SUGAR) * 100), 100);

  // Status highlights
  const isHighCaffeine = drink.caffeine >= 150;
  const isLowSugar = drink.sugar <= 5;
  const isDecaf = drink.caffeine <= 30;

  return (
    <div
      onClick={() => onSelectDrink(drink)}
      className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#78716C]/40 hover:shadow-md"
    >
      <div>
        {/* Optional Top Slot (e.g. Curation Comment) */}
        {topSlot}

        {/* Top Header: Brand & Volume & Arrow */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${brandStyle.badgeBg} ${brandStyle.badgeText}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${brandStyle.dot}`} />
              {drink.brand}
            </span>
            <span className="text-xs text-[#78716C]">
              {drink.volume}ml
            </span>
            <span className="text-xs text-[#78716C]/70">
              · {drink.category}
            </span>
          </div>

          <div className="flex items-center text-[#78716C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#231915]">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Thumbnail + Title & Description Layout (폰트 상향) */}
        <div className="mt-3.5 flex items-start gap-3.5">
          <DrinkThumbnail drink={drink} size={64} className="shrink-0" />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold tracking-tight text-[#231915] group-hover:text-[#D97757] transition-colors leading-snug">
              {drink.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#78716C]">
              {drink.description}
            </p>

            {/* Refined Natural Curation Tag */}
            {drink.boundaryTag && (
              <div className="mt-2">
                <span className="inline-flex items-center rounded-md border border-[#EFECE6] bg-[#FAF8F5] px-2 py-0.5 text-xs font-semibold text-[#574E4A]">
                  #{drink.boundaryTag}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bars & Nutritional Badges (수치 폰트 상향) */}
      <div className="mt-4 space-y-2.5 border-t border-[#EFECE6]/70 pt-3">
        {/* Caffeine Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#78716C]">
              카페인
              {isHighCaffeine && (
                <span className="ml-1 text-[11px] font-semibold text-[#D97757]">
                  (고함량)
                </span>
              )}
              {isDecaf && (
                <span className="ml-1 text-[11px] font-semibold text-[#5B7A5E]">
                  (디카페인)
                </span>
              )}
            </span>
            <span className="text-sm font-semibold text-[#231915]">
              {drink.caffeine}
              <span className="text-xs font-normal text-[#78716C]"> mg</span>
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#EFECE6]">
            <div
              className={`h-full transition-all duration-300 ${
                isHighCaffeine
                  ? 'bg-[#D97757]'
                  : isDecaf
                  ? 'bg-[#5B7A5E]'
                  : 'bg-[#231915]'
              }`}
              style={{ width: `${Math.max(caffeinePercent, 3)}%` }}
            />
          </div>
        </div>

        {/* Sugar Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#78716C]">
              당류
              {isLowSugar && (
                <span className="ml-1 text-[11px] font-semibold text-[#5B7A5E]">
                  (저당)
                </span>
              )}
            </span>
            <span className="text-sm font-semibold text-[#231915]">
              {drink.sugar}
              <span className="text-xs font-normal text-[#78716C]"> g</span>
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#EFECE6]">
            <div
              className={`h-full transition-all duration-300 ${
                isLowSugar ? 'bg-[#5B7A5E]' : 'bg-[#D97757]/80'
              }`}
              style={{ width: `${Math.max(sugarPercent, 3)}%` }}
            />
          </div>
        </div>

        {/* Calorie & Protein Badges */}
        <div className="flex items-center justify-between pt-0.5 text-xs text-[#78716C]">
          <span className="rounded-md bg-[#FAF8F5] px-2 py-0.5 font-medium">
            칼로리 <strong className="text-sm font-semibold text-[#231915]">{drink.calories}</strong> kcal
          </span>
          <span className="rounded-md bg-[#FAF8F5] px-2 py-0.5 font-medium">
            단백질 <strong className="text-sm font-semibold text-[#231915]">{drink.protein}</strong> g
          </span>
        </div>
      </div>
    </div>
  );
}
