import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import RecommendationView from './components/RecommendationView';
import DrinksExploreView from './components/DrinksExploreView';
import BeanGuideView from './components/BeanGuideView';
import BrandCompareView from './components/BrandCompareView';
import NotFoundView from './components/NotFoundView';
import DrinkDetailModal from './components/DrinkDetailModal';
import CaffeineTrackerModal from './components/CaffeineTrackerModal';
import ScrollToTopButton from './components/ScrollToTopButton';

import menusData from './data/menus.json';
import beansData from './data/beans.json';

import {
  getConsumedCoffees,
  addConsumedCoffee,
  removeConsumedCoffee,
  clearConsumedCoffees,
  checkAndResetMidnight
} from './utils/storage';

export default function App() {
  // 1. Navigation & Route States
  const [activeTab, setActiveTab] = useState('recommendation'); // 'recommendation' | 'drinks' | 'beans' | 'brands'
  const [isNotFound, setIsNotFound] = useState(false);
  const [exploreFilter, setExploreFilter] = useState(null);

  // Modals & Drawers state
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Consumed Coffees State (LocalStorage)
  const [consumedList, setConsumedList] = useState([]);

  // 0. 마운트 시 로컬스토리지 로드 및 자정 자동 리셋 감지
  useEffect(() => {
    setConsumedList(getConsumedCoffees());

    const handleMidnightCheck = () => {
      const resetResult = checkAndResetMidnight();
      if (resetResult !== null) {
        setConsumedList(resetResult);
      }
    };

    window.addEventListener('focus', handleMidnightCheck);
    document.addEventListener('visibilitychange', handleMidnightCheck);
    const intervalTimer = setInterval(handleMidnightCheck, 60000); // 1분 간격 자정 검사

    return () => {
      window.removeEventListener('focus', handleMidnightCheck);
      document.removeEventListener('visibilitychange', handleMidnightCheck);
      clearInterval(intervalTimer);
    };
  }, []);

  // 1. HTML5 History API & 해시 라우팅: 안드로이드 뒤로가기 모달 제어, 메뉴별 Page화 및 404 URL 오류 검증
  useEffect(() => {
    const handleHashSync = () => {
      const rawHash = window.location.hash;
      const hash = rawHash || '#tab=recommendation';

      let isValid = false;

      // 1-1. 탭(Page) 검증
      if (hash.startsWith('#tab=')) {
        const tabName = hash.replace('#tab=', '');
        if (['recommendation', 'drinks', 'beans', 'brands'].includes(tabName)) {
          isValid = true;
          setActiveTab(tabName);
          setSelectedDrink(null);
          setIsTrackerOpen(false);
        }
      } else if (hash === '#tracker') {
        isValid = true;
        setIsTrackerOpen(true);
        setSelectedDrink(null);
      } else if (hash.startsWith('#drink-')) {
        const drinkId = hash.replace('#drink-', '');
        const targetDrink = menusData.find((m) => m.id === drinkId);
        if (targetDrink) {
          isValid = true;
          setSelectedDrink(targetDrink);
          setIsTrackerOpen(false);
        }
      }

      if (!isValid) {
        // 알 수 없거나 존재하지 않는 해시/음료 ID인 경우 404 Blank 페이지 렌더링
        setIsNotFound(true);
        setSelectedDrink(null);
        setIsTrackerOpen(false);
        return;
      }

      setIsNotFound(false);
    };

    // 초기 진입 시 기본 해시 설정 및 동기화
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#tab=recommendation');
    }
    handleHashSync();

    window.addEventListener('popstate', handleHashSync);
    return () => window.removeEventListener('popstate', handleHashSync);
  }, []);

  // 2. 탭 변경 시 스크롤 위치 즉시 최상단 초기화
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  // 3. 모달 활성화 시 전체 페이지 스크롤 방지 (iOS Safari 바디락 보강)
  useEffect(() => {
    if (Boolean(selectedDrink) || isTrackerOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
        document.documentElement.style.overflow = '';
      };
    }
  }, [selectedDrink, isTrackerOpen]);

  // 모달 오픈/닫기 히스토리 헬퍼
  const handleOpenDrinkModal = (drink) => {
    if (selectedDrink) {
      // 이미 모달이 열려 있는 상태에서 타 브랜드 메뉴를 선택한 경우:
      // 모달이 층층이 쌓이지 않도록 replaceState로 현재 엔트리만 교체!
      setSelectedDrink(drink);
      window.history.replaceState({ modal: 'drink', id: drink.id }, '', `#drink-${drink.id}`);
      return;
    }
    // 새로 모달을 여는 경우: 히스토리에 push
    setSelectedDrink(drink);
    window.history.pushState({ modal: 'drink', id: drink.id }, '', `#drink-${drink.id}`);
  };

  const handleCloseDrinkModal = () => {
    setSelectedDrink(null);
    if (window.location.hash.startsWith('#drink-')) {
      window.history.back();
    }
  };

  const handleOpenTracker = () => {
    setIsTrackerOpen(true);
    window.history.pushState({ modal: 'tracker' }, '', '#tracker');
  };

  const handleCloseTracker = () => {
    setIsTrackerOpen(false);
    if (window.location.hash === '#tracker') {
      window.history.back();
    }
  };

  // 탭(Page) 변경 시 pushState로 히스토리 적재 -> 뒤로가기 시 이전 탭으로 이동 가능
  const handleTabChange = (tab) => {
    if (activeTab === tab && window.location.hash === `#tab=${tab}`) return;
    setActiveTab(tab);
    window.history.pushState(null, '', `#tab=${tab}`);
  };

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

  const handleNavigateToExplore = ({ curationId = 'all', categoryId = 'all' } = {}) => {
    setExploreFilter({ curationId, categoryId, ts: Date.now() });
    setActiveTab('drinks');
    window.history.pushState(null, '', '#tab=drinks');
  };

  const handleNavigateHome = () => {
    setIsNotFound(false);
    setSelectedDrink(null);
    setIsTrackerOpen(false);
    setActiveTab('recommendation');
    window.history.replaceState(null, '', '#tab=recommendation');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#231915]">
      {/* Global Navigation Header with 4 Tabs & Caffeine Tracker */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        consumedList={consumedList}
        onOpenTracker={handleOpenTracker}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* URL 오류 시 노출되는 Blank 404 페이지 */}
        {isNotFound ? (
          <NotFoundView onNavigateHome={handleNavigateHome} />
        ) : (
          <>
            {/* Tab 1: 추천 커피 */}
            {activeTab === 'recommendation' && (
              <RecommendationView
                onSelectDrink={handleOpenDrinkModal}
                onNavigateToExplore={handleNavigateToExplore}
              />
            )}

        {/* Tab 2: 음료 탐색 (2-Tier 필터 & 벤토 그리드 - 독립 컴포넌트) */}
        {activeTab === 'drinks' && (
          <DrinksExploreView
            onSelectDrink={handleOpenDrinkModal}
            initialFilter={exploreFilter}
          />
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
          </>
        )}
      </main>

      {/* Drink Detail Modal */}
      <DrinkDetailModal
        drink={selectedDrink}
        bean={matchedBean}
        isOpen={Boolean(selectedDrink)}
        onClose={handleCloseDrinkModal}
        onAddDrink={handleAddDrink}
        onSelectDrink={handleOpenDrinkModal}
      />

      {/* Today's Consumed Caffeine Tracker Modal */}
      <CaffeineTrackerModal
        isOpen={isTrackerOpen}
        onClose={handleCloseTracker}
        consumedList={consumedList}
        onRemoveItem={handleRemoveDrink}
        onClearAll={handleClearAllDrinks}
      />

      {/* Subtle Editorial Footer */}
      <footer className="mt-16 border-t border-[#EFECE6] bg-[#FFFFFF] py-8 text-center text-xs text-[#78716C]">
        <div className="mx-auto max-w-6xl px-4 space-y-1">
          <p className="font-bold tracking-tight text-[#231915]">오늘의커피 (Today's Coffee)</p>
          <p>
            8대 브랜드 공식 영양정보 기준 분석 데이터 제공
          </p>
          <p className="text-[11px] text-[#78716C]/70">
            성인 일일 최대 카페인 권장량: 400mg | 당류 권장 섭취량: 50g 이하
          </p>
        </div>
      </footer>

      {/* Upward Scroll-Detecting FAB (최상단 이동) */}
      <ScrollToTopButton />
    </div>
  );
}
