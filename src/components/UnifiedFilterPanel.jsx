import React from 'react';
import { Search, SlidersHorizontal, Filter, Layers, Zap, Leaf, Moon, Activity, LayoutGrid, RotateCcw } from 'lucide-react';
import brandsData from '../data/brands.json';

export const QUICK_CURATION_PRESETS = [
  {
    id: 'all',
    label: '전체',
    icon: LayoutGrid,
    filter: () => true
  },
  {
    id: 'booster',
    label: '야근·집중 부스터 (150mg↑)',
    icon: Zap,
    filter: (item) => item.caffeine >= 150
  },
  {
    id: 'diet',
    label: '식단 관리·제로슈거 (당류 5g↓ & 50kcal↓)',
    icon: Leaf,
    filter: (item) => item.sugar <= 5 && item.calories <= 50
  },
  {
    id: 'afternoon-decaf',
    label: '오후 3시 이후 디카페인 (30mg↓)',
    icon: Moon,
    filter: (item) => item.caffeine <= 30
  },
  {
    id: 'pre-workout',
    label: '운동 전 부스터 (150mg↑ & 30kcal↓)',
    icon: Activity,
    filter: (item) => item.caffeine >= 150 && item.calories <= 30
  }
];

export const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: '에스프레소·커피', label: '에스프레소·커피' },
  { id: '콜드브루', label: '콜드브루' },
  { id: '디카페인', label: '디카페인' },
  { id: '논커피·라떼', label: '논커피·라떼' },
  { id: '티·에이드·스무디', label: '티·에이드·스무디' }
];

export default function UnifiedFilterPanel({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  selectedCuration,
  setSelectedCuration,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  onResetFilters,
  resultCount
}) {
  const isAnyFilterActive =
    selectedCuration !== 'all' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    Boolean(searchQuery.trim()) ||
    sortBy !== 'default';

  return (
    <div className="rounded-3xl border border-[#EFECE6] bg-[#FFFFFF] p-5 shadow-xs sm:p-6 space-y-4">
      {/* 1단: 검색 & 정렬 & 목적별 빠른 필터 칩 */}
      <div className="space-y-3">
        {/* Search Bar + Sort Dropdown */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          {/* Keyword Search Input (font 16px to prevent Safari auto-zoom) */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="음료명, 카테고리, 원두, 태그 검색 (예: 자허블, 말차, 아메리카노)"
              className="w-full rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] py-2.5 pl-10 pr-10 text-base text-[#231915] placeholder:text-[#78716C]/60 focus:border-[#231915] focus:bg-[#FFFFFF] focus:outline-none sm:text-xs transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#78716C] hover:text-[#231915]"
              >
                지우기
              </button>
            )}
          </div>

          {/* Sort Selection & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-medium text-[#231915] focus:border-[#231915] focus:outline-none"
            >
              <option value="default">기본순</option>
              <option value="caffeine-desc">카페인 높은순</option>
              <option value="calories-asc">칼로리 낮은순</option>
              <option value="sugar-asc">당류 낮은순</option>
            </select>

            {isAnyFilterActive && (
              <button
                type="button"
                onClick={onResetFilters}
                title="모든 필터 초기화"
                className="flex cursor-pointer items-center gap-1 rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#78716C] hover:bg-[#FFF5F2] hover:text-[#D97757] hover:border-[#D97757]/30 transition-all"
              >
                <RotateCcw className="h-3 w-3" />
                초기화
              </button>
            )}
          </div>
        </div>

        {/* 1단 하부: 목적별 빠른 큐레이션 칩 (가로 스크롤) */}
        <div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <span className="hidden items-center gap-1 text-[11px] font-semibold text-[#78716C] sm:flex mr-1 shrink-0">
              <Zap className="h-3.5 w-3.5" />
              목적별:
            </span>
            {QUICK_CURATION_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedCuration === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedCuration(preset.id)}
                  className={`inline-flex cursor-pointer shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#231915] text-[#FAF8F5] shadow-xs ring-1 ring-[#231915]'
                      : 'border border-[#EFECE6] bg-[#FAF8F5] text-[#78716C] hover:text-[#231915] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <Icon className="h-3 w-3 stroke-[2]" />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2단: 카테고리 & 브랜드 통합 필터 (구분선 하단) */}
      <div className="border-t border-[#EFECE6] pt-3.5 space-y-2.5">
        {/* 카테고리 선택 칩 행 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          <span className="hidden items-center gap-1 text-[11px] font-semibold text-[#78716C] sm:flex mr-1 shrink-0">
            <Layers className="h-3.5 w-3.5" />
            카테고리:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`cursor-pointer shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#231915] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'border border-[#EFECE6] bg-[#FAF8F5] text-[#78716C] hover:text-[#231915] hover:bg-[#FFFFFF]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 8대 브랜드 선택 칩 행 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          <span className="hidden items-center gap-1 text-[11px] font-semibold text-[#78716C] sm:flex mr-1 shrink-0">
            <Filter className="h-3.5 w-3.5" />
            브랜드:
          </span>
          <button
            type="button"
            onClick={() => setSelectedBrand('all')}
            className={`cursor-pointer shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              selectedBrand === 'all'
                ? 'bg-[#231915] text-[#FAF8F5] font-semibold shadow-xs'
                : 'border border-[#EFECE6] bg-[#FAF8F5] text-[#78716C] hover:text-[#231915] hover:bg-[#FFFFFF]'
            }`}
          >
            8대 브랜드 전체
          </button>
          {brandsData.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBrand(b.id)}
              className={`cursor-pointer shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedBrand === b.id
                  ? 'bg-[#231915] text-[#FAF8F5] font-semibold shadow-xs'
                  : 'border border-[#EFECE6] bg-[#FAF8F5] text-[#78716C] hover:text-[#231915] hover:bg-[#FFFFFF]'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
