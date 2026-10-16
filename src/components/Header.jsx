import React from 'react';
import { Coffee, AlertCircle, Sparkles } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  consumedList,
  onOpenTracker
}) {
  const totalCaffeine = consumedList.reduce((acc, cur) => acc + (cur.caffeine || 0), 0);
  const maxCaffeine = 400;

  // Uncap percentage: exact calculation without capping at 100%
  const actualPercentage = Math.round((totalCaffeine / maxCaffeine) * 100);
  const barWidth = Math.min(actualPercentage, 100);
  const isOverLimit = totalCaffeine > 400;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EFECE6] bg-[#FAF8F5]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo (폰트 스케일업: 20px / 12~13px) */}
        <div 
          onClick={() => setActiveTab('recommendation')}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-85"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#231915] text-[#FAF8F5] shadow-xs">
            <Coffee className="h-5 w-5 stroke-[1.75]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#231915]">
                오늘의커피
              </span>
              <span className="hidden text-xs tracking-wider text-[#78716C] uppercase sm:inline-block">
                Today's Coffee
              </span>
            </div>
            <p className="text-xs sm:text-[13px] leading-tight text-[#78716C] mt-0.5">
              데일리 큐레이션 & 성분 탐색
            </p>
          </div>
        </div>

        {/* Tab Navigation (Center - 4 Tabs, 폰트 스케일업: 14px font-semibold) */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#EFECE6] bg-[#FFFFFF] p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('recommendation')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all ${
              activeTab === 'recommendation'
                ? 'bg-[#231915] text-[#FAF8F5] font-semibold shadow-xs'
                : 'text-[#78716C] font-medium hover:text-[#231915]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>커피 추천</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('drinks')}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-all ${
              activeTab === 'drinks'
                ? 'bg-[#231915] text-[#FAF8F5] font-semibold shadow-xs'
                : 'text-[#78716C] font-medium hover:text-[#231915]'
            }`}
          >
            음료 탐색
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beans')}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-all ${
              activeTab === 'beans'
                ? 'bg-[#231915] text-[#FAF8F5] font-semibold shadow-xs'
                : 'text-[#78716C] font-medium hover:text-[#231915]'
            }`}
          >
            원두 가이드
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brands')}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-all ${
              activeTab === 'brands'
                ? 'bg-[#231915] text-[#FAF8F5] font-semibold shadow-xs'
                : 'text-[#78716C] font-medium hover:text-[#231915]'
            }`}
          >
            브랜드 한눈에 보기
          </button>
        </nav>

        {/* Caffeine Tracker Widget (Right, 폰트 가독성 상향) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenTracker}
            className={`group flex cursor-pointer items-center gap-2.5 rounded-2xl border px-3 py-1.5 text-left transition-all ${
              isOverLimit
                ? 'border-[#D97757]/40 bg-[#FFF5F2] hover:border-[#D97757]'
                : 'border-[#EFECE6] bg-[#FFFFFF] hover:border-[#78716C]/40 shadow-xs'
            }`}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-[#78716C]">
                  오늘 섭취량
                </span>
                {isOverLimit ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#D97757] px-1.5 py-0.2 text-xs font-semibold text-white">
                    <AlertCircle className="h-3 w-3" />
                    권장량 초과
                  </span>
                ) : (
                  <span className="text-xs text-[#78716C]">
                    (기준 400mg)
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-base font-bold tracking-tight ${
                    isOverLimit ? 'text-[#D97757]' : 'text-[#231915]'
                  }`}
                >
                  {totalCaffeine}
                </span>
                <span className="text-xs text-[#78716C]">/ 400 mg</span>
              </div>
            </div>

            {/* Mini Progress Bar with Uncapped Percentage */}
            <div className="flex flex-col items-end gap-1">
              <div className="h-1.5 w-12 overflow-hidden rounded-full bg-[#EFECE6]">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverLimit ? 'bg-[#D97757]' : actualPercentage > 70 ? 'bg-[#E69C24]' : 'bg-[#5B7A5E]'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span
                className={`text-xs font-semibold ${
                  isOverLimit ? 'text-[#D97757]' : 'text-[#78716C]'
                }`}
              >
                {actualPercentage}%
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Sticky Tab Bar (4 Tabs) */}
      <div className="grid grid-cols-4 md:hidden border-t border-[#EFECE6] bg-[#FFFFFF] px-2 py-1.5 text-center">
        <button
          type="button"
          onClick={() => setActiveTab('recommendation')}
          className={`py-1.5 text-center text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'recommendation' ? 'font-bold text-[#231915] border-b-2 border-[#231915]' : 'text-[#78716C]'
          }`}
        >
          커피 추천
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('drinks')}
          className={`py-1.5 text-center text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'drinks' ? 'font-bold text-[#231915] border-b-2 border-[#231915]' : 'text-[#78716C]'
          }`}
        >
          음료 탐색
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('beans')}
          className={`py-1.5 text-center text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'beans' ? 'font-bold text-[#231915] border-b-2 border-[#231915]' : 'text-[#78716C]'
          }`}
        >
          원두 가이드
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('brands')}
          className={`py-1.5 text-center text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'brands' ? 'font-bold text-[#231915] border-b-2 border-[#231915]' : 'text-[#78716C]'
          }`}
        >
          브랜드 한눈에 보기
        </button>
      </div>
    </header>
  );
}
