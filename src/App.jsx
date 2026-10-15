import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroCuration, { CURATION_PRESETS } from './components/HeroCuration';
import DrinkCard from './components/DrinkCard';
import DrinkDetailModal from './components/DrinkDetailModal';
import CaffeineTrackerDrawer from './components/CaffeineTrackerDrawer';
import BeanGuideView from './components/BeanGuideView';
import BrandCompareView from './components/BrandCompareView';

import menusData from './data/menus.json';
import beansData from './data/beans.json';
import brandsData from './data/brands.json';

import {
  getConsumedCoffees,
  addConsumedCoffee,
  removeConsumedCoffee,
  clearConsumedCoffees
} from './utils/storage';

import { Search, RotateCcw, Filter, SlidersHorizontal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('drinks'); // 'drinks' | 'beans' | 'brands'
  const [selectedCuration, setSelectedCuration] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'caffeine-desc' | 'calories-asc' | 'sugar-asc'

  // Modals & Drawers state
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Consumed Coffees State (LocalStorage)
  const [consumedList, setConsumedList] = useState([]);

  useEffect(() => {
    setConsumedList(getConsumedCoffees());
  }, []);

  const handleAddDrink = (drink, memo) => {
    const updated = addConsumedCoffee(drink, memo);
    setConsumedList(updated);
  };

  const handleRemoveDrink = (id) => {
    const updated = removeConsumedCoffee(id);
    setConsumedList(updated);
  };

  const handleClearAllDrinks = () => {
    const updated = clearConsumedCoffees();
    setConsumedList(updated);
  };

  // Find matching bean for selected drink
  const matchedBean = useMemo(() => {
    if (!selectedDrink || !selectedDrink.beanId) return null;
    return beansData.find((b) => b.id === selectedDrink.beanId) || null;
  }, [selectedDrink]);

  // Filtered & Sorted Drinks (Intersection Filter)
  const filteredDrinks = useMemo(() => {
    const curationObj = CURATION_PRESETS.find((c) => c.id === selectedCuration);
    const curationFilter = curationObj ? curationObj.filter : () => true;

    return menusData
      .filter((drink) => {
        // 1. Curation filter
        if (!curationFilter(drink)) return false;

        // 2. Brand filter
        if (selectedBrand !== 'all' && drink.brandId !== selectedBrand) return false;

        // 3. Search keyword filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = drink.name.toLowerCase().includes(q);
          const matchBrand = drink.brand.toLowerCase().includes(q);
          const matchDesc = drink.description.toLowerCase().includes(q);
          const matchCategory = drink.category.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc && !matchCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'caffeine-desc') return b.caffeine - a.caffeine;
        if (sortBy === 'calories-asc') return a.calories - b.calories;
        if (sortBy === 'sugar-asc') return a.sugar - b.sugar;
        return 0;
      });
  }, [selectedCuration, selectedBrand, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCuration('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#231915]">
      {/* Global Navigation Header with Caffeine Tracker */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        consumedList={consumedList}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {activeTab === 'drinks' && (
          <div className="space-y-6">
            {/* Editorial Hero Curation Section */}
            <HeroCuration
              selectedCuration={selectedCuration}
              onSelectCuration={setSelectedCuration}
            />

            {/* Sub-Filters & Search Bar Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
              {/* Brand Chips (Horizontal scroll) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
                <span className="hidden items-center gap-1 text-xs font-semibold text-[#78716C] lg:flex mr-1">
                  <Filter className="h-3.5 w-3.5" />
                  브랜드:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  className={`cursor-pointer shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedBrand === 'all'
                      ? 'bg-[#231915] text-[#FAF8F5]'
                      : 'bg-[#FAF8F5] text-[#78716C] hover:text-[#231915]'
                  }`}
                >
                  전체 브랜드
                </button>
                {brandsData.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBrand(b.id)}
                    className={`cursor-pointer shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      selectedBrand === b.id
                        ? 'bg-[#231915] text-[#FAF8F5]'
                        : 'bg-[#FAF8F5] text-[#78716C] hover:text-[#231915]'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-1 items-center gap-2 lg:max-w-md lg:justify-end">
                {/* Search Input (16px font to prevent Safari zoom) */}
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="음료명, 카테고리 검색..."
                    className="w-full rounded-xl border border-[#EFECE6] bg-[#FAF8F5] py-2 pl-9 pr-3 text-base text-[#231915] placeholder:text-[#78716C]/60 focus:border-[#231915] focus:bg-[#FFFFFF] focus:outline-none sm:text-xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#78716C] hover:text-[#231915]"
                    >
                      지우기
                    </button>
                  )}
                </div>

                {/* Sort Select */}
                <div className="shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="cursor-pointer rounded-xl border border-[#EFECE6] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#231915] focus:border-[#231915] focus:outline-none"
                  >
                    <option value="default">기본순</option>
                    <option value="caffeine-desc">카페인 높은순</option>
                    <option value="calories-asc">칼로리 낮은순</option>
                    <option value="sugar-asc">당류 낮은순</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Indicators & Count */}
            <div className="flex items-center justify-between text-xs text-[#78716C] px-1">
              <div>
                <span>검색 결과: </span>
                <strong className="text-[#231915]">{filteredDrinks.length}</strong>개 음료
                {(selectedCuration !== 'all' || selectedBrand !== 'all' || searchQuery) && (
                  <span className="ml-2 text-[#78716C]">
                    (필터 적용 중)
                  </span>
                )}
              </div>

              {(selectedCuration !== 'all' || selectedBrand !== 'all' || searchQuery || sortBy !== 'default') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex cursor-pointer items-center gap-1 text-[#78716C] hover:text-[#231915] underline underline-offset-2"
                >
                  <RotateCcw className="h-3 w-3" />
                  필터 초기화
                </button>
              )}
            </div>

            {/* Drinks Bento Grid */}
            {filteredDrinks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDrinks.map((drink) => (
                  <DrinkCard
                    key={drink.id}
                    drink={drink}
                    onSelectDrink={setSelectedDrink}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#EFECE6] bg-[#FFFFFF] py-16 text-center">
                <p className="font-serif text-base font-bold text-[#231915]">
                  조건에 일치하는 음료가 없습니다.
                </p>
                <p className="mt-1 text-xs text-[#78716C]">
                  다른 컨디션 칩을 선택하시거나 검색어를 확인해 보세요.
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
        )}

        {/* Tab 2: Bean Guide */}
        {activeTab === 'beans' && (
          <BeanGuideView
            onSelectBeanToDrinks={() => setActiveTab('drinks')}
          />
        )}

        {/* Tab 3: Brand Compare */}
        {activeTab === 'brands' && (
          <BrandCompareView />
        )}
      </main>

      {/* Drink Detail Modal (Bottom Sheet on Mobile, Centered on PC) */}
      <DrinkDetailModal
        drink={selectedDrink}
        bean={matchedBean}
        isOpen={Boolean(selectedDrink)}
        onClose={() => setSelectedDrink(null)}
        onAddDrink={handleAddDrink}
      />

      {/* Today's Consumed Caffeine Tracker Drawer */}
      <CaffeineTrackerDrawer
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        consumedList={consumedList}
        onRemoveItem={handleRemoveDrink}
        onClearAll={handleClearAllDrinks}
      />

      {/* Subtle Editorial Footer */}
      <footer className="mt-16 border-t border-[#EFECE6] bg-[#FFFFFF] py-8 text-center text-xs text-[#78716C]">
        <div className="mx-auto max-w-6xl px-4 space-y-1">
          <p className="font-serif font-bold text-[#231915]">오늘의커피 (Today's Coffee)</p>
          <p>
            스타벅스 · 메가커피 · 컴포즈커피 · 폴바셋 공식 영양정보 기준 분석 데이터 제공
          </p>
          <p className="text-[11px] text-[#78716C]/70">
            성인 일일 최대 카페인 권장량: 400mg | 당류 권장 섭취량: 50g 이하
          </p>
        </div>
      </footer>
    </div>
  );
}
