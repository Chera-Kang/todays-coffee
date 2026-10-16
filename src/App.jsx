import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import RecommendationView from './components/RecommendationView';
import UnifiedFilterPanel, { QUICK_CURATION_PRESETS } from './components/UnifiedFilterPanel';
import DrinkCard from './components/DrinkCard';
import DrinkDetailModal from './components/DrinkDetailModal';
import CaffeineTrackerModal from './components/CaffeineTrackerModal';
import BeanGuideView from './components/BeanGuideView';
import BrandCompareView from './components/BrandCompareView';

import menusData from './data/menus.json';
import beansData from './data/beans.json';

import {
  getConsumedCoffees,
  addConsumedCoffee,
  removeConsumedCoffee,
  clearConsumedCoffees
} from './utils/storage';

export default function App() {
  // 1. Initial default active tab is 'recommendation'
  const [activeTab, setActiveTab] = useState('recommendation'); // 'recommendation' | 'drinks' | 'beans' | 'brands'

  // Filter States for 'drinks' tab
  const [selectedCuration, setSelectedCuration] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
        if (sortBy === 'calories-asc') return a.calories - b.calories;
        if (sortBy === 'sugar-asc') return a.sugar - b.sugar;
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#231915]">
      {/* Global Navigation Header with 4 Tabs & Caffeine Tracker */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        consumedList={consumedList}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Tab 1: 커피 추천 (Blank Placeholder + Action to Explore) */}
        {activeTab === 'recommendation' && (
          <RecommendationView
            onGoToExplore={() => setActiveTab('drinks')}
          />
        )}

        {/* Tab 2: 음료 탐색 (Unified Filter Panel + Drinks Bento Grid) */}
        {activeTab === 'drinks' && (
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

            {/* Results Count & Filter Indicators */}
            <div className="flex items-center justify-between text-xs text-[#78716C] px-1">
              <div>
                <span>검색 결과: </span>
                <strong className="text-[#231915]">{filteredDrinks.length}</strong>개 음료
                {(selectedCuration !== 'all' || selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery) && (
                  <span className="ml-2 text-[#78716C]">
                    (필터 적용 중)
                  </span>
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
                    onSelectDrink={setSelectedDrink}
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
        )}

        {/* Tab 3: Bean Guide (1차/2차 이원화 필터) */}
        {activeTab === 'beans' && (
          <BeanGuideView
            onSelectBeanToDrinks={() => setActiveTab('drinks')}
          />
        )}

        {/* Tab 4: Brand Compare */}
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

      {/* Today's Consumed Caffeine Tracker Modal (Unified Center Modal & Bottom Sheet) */}
      <CaffeineTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        consumedList={consumedList}
        onRemoveItem={handleRemoveDrink}
        onClearAll={handleClearAllDrinks}
      />

      {/* Subtle Editorial Footer */}
      <footer className="mt-16 border-t border-[#EFECE6] bg-[#FFFFFF] py-8 text-center text-xs text-[#78716C]">
        <div className="mx-auto max-w-6xl px-4 space-y-1">
          <p className="font-bold tracking-tight text-[#231915]">오늘의커피 (Today's Coffee)</p>
          <p>
            스타벅스 · 메가커피 · 컴포즈커피 · 폴바셋 · 투썸플레이스 · 이디야커피 · 빽다방 · 할리스 8대 브랜드 공식 영양정보 기준 분석 데이터 제공
          </p>
          <p className="text-[11px] text-[#78716C]/70">
            성인 일일 최대 카페인 권장량: 400mg | 당류 권장 섭취량: 50g 이하
          </p>
        </div>
      </footer>
    </div>
  );
}
