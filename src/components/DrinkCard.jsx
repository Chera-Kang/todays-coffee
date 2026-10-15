import React from 'react';
import { ArrowUpRight } from 'lucide-react';

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
  }
};

export default function DrinkCard({ drink, onSelectDrink }) {
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
        {/* Top Header: Brand & Volume */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${brandStyle.badgeBg} ${brandStyle.badgeText}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${brandStyle.dot}`} />
              {drink.brand}
            </span>
            <span className="text-[11px] text-[#78716C]">
              {drink.volume}ml
            </span>
          </div>

          <div className="flex items-center text-[#78716C] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#231915]">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Drink Title & Description */}
        <div className="mt-3">
          <h3 className="font-serif text-base font-bold text-[#231915] group-hover:text-[#D97757] transition-colors">
            {drink.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#78716C]">
            {drink.description}
          </p>
        </div>

        {/* Boundary Tag (if present) */}
        {drink.boundaryTag && (
          <div className="mt-2.5">
            <span className="inline-block rounded-md border border-[#EFECE6] bg-[#FAF8F5] px-2 py-0.5 text-[10px] font-medium text-[#78716C]">
              🏷️ {drink.boundaryTag}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bars & Nutritional Badges */}
      <div className="mt-5 space-y-3 border-t border-[#EFECE6]/70 pt-3.5">
        {/* Caffeine Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-[#78716C]">
              카페인
              {isHighCaffeine && (
                <span className="ml-1 text-[10px] font-semibold text-[#D97757]">
                  (고함량)
                </span>
              )}
              {isDecaf && (
                <span className="ml-1 text-[10px] font-semibold text-[#5B7A5E]">
                  (디카페인)
                </span>
              )}
            </span>
            <span className="font-bold text-[#231915]">
              {drink.caffeine}
              <span className="text-[10px] font-normal text-[#78716C]"> mg</span>
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
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-[#78716C]">
              당류
              {isLowSugar && (
                <span className="ml-1 text-[10px] font-semibold text-[#5B7A5E]">
                  (저당)
                </span>
              )}
            </span>
            <span className="font-bold text-[#231915]">
              {drink.sugar}
              <span className="text-[10px] font-normal text-[#78716C]"> g</span>
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
        <div className="flex items-center justify-between pt-1 text-[11px] text-[#78716C]">
          <span className="rounded-md bg-[#FAF8F5] px-2 py-0.5 font-medium">
            칼로리 <strong className="text-[#231915]">{drink.calories}</strong> kcal
          </span>
          <span className="rounded-md bg-[#FAF8F5] px-2 py-0.5 font-medium">
            단백질 <strong className="text-[#231915]">{drink.protein}</strong> g
          </span>
        </div>
      </div>
    </div>
  );
}
