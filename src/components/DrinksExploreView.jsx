import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import UnifiedFilterPanel, { QUICK_CURATION_PRESETS } from './UnifiedFilterPanel';
import DrinkCard from './DrinkCard';
import menusData from '../data/menus.json';

const SORT_OPTIONS = [
  { id: 'default', label: '기본 추천순', shortLabel: '기본순' },
  { id: 'caffeine-desc', label: '카페인 높은순', shortLabel: '카페인 높은순' },
  { id: 'caffeine-asc', label: '카페인 낮은순', shortLabel: '카페인 낮은순' },
  { id: 'calories-asc', label: '칼로리 낮은순', shortLabel: '칼로리 낮은순' },
  { id: 'calories-desc', label: '칼로리 높은순', shortLabel: '칼로리 높은순' },
  { id: 'sugar-asc', label: '당류 낮은순', shortLabel: '당류 낮은순' },
  { id: 'sugar-desc', label: '당류 높은순', shortLabel: '당류 높은순' },
];

export default function DrinksExploreView({ onSelectDrink, initialFilter }) {
  // Filter States
  const [selectedCuration, setSelectedCuration] = useState(initialFilter?.curationId || 'all');
  const [selectedCategory, setSelectedCategory] = useState(initialFilter?.categoryId || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortRef = useRef(null);

  // 외부(추천 탭 등)에서 전달된 initialFilter 동기화
  useEffect(() => {
    if (initialFilter) {
      if (initialFilter.curationId) setSelectedCuration(initialFilter.curationId);
      if (initialFilter.categoryId) setSelectedCategory(initialFilter.categoryId);
      setSelectedBrand('all');
      setSearchQuery('');
    }
  }, [initialFilter]);

  // Click-Outside Listener for Sort Popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSortOpen]);

  // Filtered & Sorted Drinks (Intersection Filter)
  const filteredDrinks = useMemo(() => {
    const curationObj = QUICK_CURATION_PRESETS.find((c) => c.id === selectedCuration);
    const curationFilter = curationObj ? curationObj.filter : () => true;

    return menusData
      .filter((drink) => {
        // 1. Quick Curation condition filter
        if (!curationFilter(drink)) return false;

        // 2. Category filter
        if (selectedCategory !== 'all' && drink.category !== selectedCategory) return false;

        // 3. Brand filter
        if (selectedBrand !== 'all' && drink.brandId !== selectedBrand) return false;

        // 4. Search keyword filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = drink.name.toLowerCase().includes(q);
          const matchBrand = drink.brand.toLowerCase().includes(q);
          const matchDesc = drink.description.toLowerCase().includes(q);
          const matchCategory = drink.category.toLowerCase().includes(q);
          const matchTag = drink.boundaryTag ? drink.boundaryTag.toLowerCase().includes(q) : false;
          if (!matchName && !matchBrand && !matchDesc && !matchCategory && !matchTag) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'caffeine-desc') return b.caffeine - a.caffeine;
        if (sortBy === 'caffeine-asc') return a.caffeine - b.caffeine;
        if (sortBy === 'calories-asc') return a.calories - b.calories;
        if (sortBy === 'calories-desc') return b.calories - a.calories;
        if (sortBy === 'sugar-asc') return a.sugar - b.sugar;
        if (sortBy === 'sugar-desc') return b.sugar - a.sugar;
        return 0;
      });
  }, [selectedCuration, selectedCategory, selectedBrand, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCuration('all');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="space-y-6">
      {/* Unified 2-Tier Filter Panel */}
      <UnifiedFilterPanel
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedCuration={selectedCuration}
        setSelectedCuration={setSelectedCuration}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        onResetFilters={handleResetFilters}
        resultCount={filteredDrinks.length}
      />

      {/* Results Count & Sort Dropdown Popover */}
      <div className="flex items-center justify-between text-xs text-[#78716C] px-1 relative">
        <div>
          <span>검색 결과: </span>
          <strong className="text-[#231915]">{filteredDrinks.length}</strong>개 음료
          {(selectedCuration !== 'all' || selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery) && (
            <span className="ml-2 text-[#78716C]">
              (필터 적용 중)
            </span>
          )}
        </div>

        {/* Sort Popover Button & Dropdown */}
        <div ref={sortRef} className="relative">
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#EFECE6] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#231915] hover:border-[#78716C]/40 shadow-xs transition-all"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-[#78716C]" />
            <span>{(SORT_OPTIONS.find((s) => s.id === sortBy) || SORT_OPTIONS[0]).shortLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#78716C]" />
          </button>

          {/* Sort Dropdown Menu Popover */}
          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-30 w-52 rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] p-1.5 shadow-xl transition-all">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSortBy(opt.id);
                      setIsSortOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#FAF8F5] font-bold text-[#231915]'
                        : 'text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#231915]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-[#231915]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Drinks Bento Grid */}
      {filteredDrinks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDrinks.map((drink) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              onSelectDrink={onSelectDrink}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#EFECE6] bg-[#FFFFFF] py-16 text-center">
          <p className="text-base font-bold tracking-tight text-[#231915]">
            조건에 일치하는 음료가 없습니다.
          </p>
          <p className="mt-1 text-xs text-[#78716C]">
            다른 카테고리나 브랜드 칩을 선택하시거나 검색어를 확인해 보세요.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 rounded-xl bg-[#231915] px-4 py-2 text-xs font-semibold text-[#FAF8F5] transition-opacity hover:opacity-90"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
