import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import menusData from '../data/menus.json';
import beansData from '../data/beans.json';
import DrinkCard from './DrinkCard';

// 1. 실제 검색 트렌드 기반 5대 구어체 상황별 테마
export const TREND_THEMES = [
  {
    id: 'nutty-heavy',
    title: '산미 없이 고소하고 묵직한 커피',
    subtitle: '호불호 없는 다크초콜릿·견과류 풍미의 데일리 커피',
    badge: '대중적 베스트',
    exploreCurationId: 'all',
    exploreCategoryId: '에스프레소·커피',
    match: (drink, bean) => {
      const isCoffee = drink.category === '에스프레소·커피' || drink.category === '콜드브루';
      if (!isCoffee) return false;
      if (bean) {
        return bean.acidity <= 2 && (bean.body >= 4 || bean.roast >= 4);
      }
      return !drink.name.includes('산미') && !drink.name.includes('블론드');
    }
  },
  {
    id: 'diet-zero',
    title: '식단 중에도 죄책감 없는 제로·저당',
    subtitle: '트레이너·영양사가 추천하는 당류 5g 이하 & 저칼로리 메뉴',
    badge: '다이어트 픽',
    exploreCurationId: 'diet',
    exploreCategoryId: 'all',
    match: (drink) => {
      return (drink.sugar <= 5 && drink.calories <= 50) || drink.name.includes('제로') || drink.name.includes('노슈거');
    }
  },
  {
    id: 'afternoon-sleep',
    title: '오후 3시 이후, 잠 못 잘 걱정 없는 메뉴',
    subtitle: '수면에 방해되지 않는 부드러운 디카페인 & 논커피',
    badge: '숙면 안심',
    exploreCurationId: 'afternoon-decaf',
    exploreCategoryId: '디카페인',
    match: (drink) => {
      return drink.category === '디카페인' || drink.caffeine <= 30;
    }
  },
  {
    id: 'commute-booster',
    title: '출근길·야근 전 잠 확 깨는 고카페인 수혈',
    subtitle: '가성비와 각성 효과를 모두 챙긴 카페인 150mg 이상 부스터',
    badge: '에너지 부스터',
    exploreCurationId: 'booster',
    exploreCategoryId: 'all',
    match: (drink) => {
      return drink.caffeine >= 150;
    }
  },
  {
    id: 'refresh-sweet',
    title: '커피는 안 땡길 때, 상큼·달콤 리프레시',
    subtitle: '기분 전환을 돕는 프랜차이즈 베스트셀러 티·에이드·라떼',
    badge: '기분 전환',
    exploreCurationId: 'all',
    exploreCategoryId: '티·에이드·스무디',
    match: (drink) => {
      return (
        drink.category === '논커피·라떼' ||
        drink.category === '티·에이드·스무디' ||
        drink.name.includes('에이드') ||
        drink.name.includes('아이스티') ||
        drink.name.includes('프라페')
      );
    }
  }
];

// 2. 바리스타 스타일 취향 세부 선택 옵션
const STYLE_OPTIONS = [
  { id: 'all', label: '전체 스타일' },
  { id: 'black', label: '깔끔한 블랙', shortLabel: '블랙' },
  { id: 'milk', label: '부드러운 라떼', shortLabel: '라떼' },
  { id: 'tea-ade', label: '상큼한 티·에이드', shortLabel: '티·에이드' }
];

const FLAVOR_OPTIONS = [
  { id: 'all', label: '전체 맛의 결' },
  { id: 'nutty-heavy', label: '고소·묵직함', shortLabel: '고소함' },
  { id: 'fruity-acidic', label: '화사한 산미', shortLabel: '산미' },
  { id: 'sweet', label: '달콤한 당충전', shortLabel: '달콤' },
  { id: 'low-sugar', label: '담백한 제로·저당', shortLabel: '제로·저당' }
];

// 3. '추천 선정 이유' 정제 코멘트 (35~45자 내외 온전한 2줄 문장)
function getWhyPickComment(themeId) {
  switch (themeId) {
    case 'nutty-heavy':
      return '산미가 거의 없고 묵직한 바디감과 고소한 견과류 풍미가 조화로워요.';
    case 'diet-zero':
      return '당류와 칼로리 부담 없이 운동 전후나 식단 중에 깔끔하게 즐기기 좋아요.';
    case 'afternoon-sleep':
      return '부담 없는 카페인 함량으로 늦은 오후나 저녁 시간에도 편안하게 마실 수 있어요.';
    case 'commute-booster':
      return '일일 권장량의 40% 이상을 채워주는 강력한 각성 효과의 에너지 메뉴예요.';
    case 'refresh-sweet':
      return '달콤하고 상큼한 플레이버로 기분 전환에 제격인 인기 베스트셀러예요.';
    default:
      return '8대 프랜차이즈 중 가장 균형 잡힌 밸런스로 많은 사랑을 받는 검증된 메뉴예요.';
  }
}

export default function RecommendationView({ onSelectDrink, onNavigateToExplore }) {
  // 테마 1번 기본 선택
  const [selectedThemeId, setSelectedThemeId] = useState('nutty-heavy');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedFlavor, setSelectedFlavor] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const currentTheme = useMemo(() => {
    return TREND_THEMES.find((t) => t.id === selectedThemeId) || TREND_THEMES[0];
  }, [selectedThemeId]);

  // Bean Map
  const beansMap = useMemo(() => {
    const map = new Map();
    beansData.forEach((b) => map.set(b.id, b));
    return map;
  }, []);

  const hasCustomFilter = selectedStyle !== 'all' || selectedFlavor !== 'all';

  // 필터 요약 문구 생성
  const filterSummaryText = useMemo(() => {
    const parts = [];
    if (selectedStyle !== 'all') {
      const s = STYLE_OPTIONS.find((opt) => opt.id === selectedStyle);
      parts.push(`스타일: ${s?.shortLabel || s?.label}`);
    }
    if (selectedFlavor !== 'all') {
      const f = FLAVOR_OPTIONS.find((opt) => opt.id === selectedFlavor);
      parts.push(`맛: ${f?.shortLabel || f?.label}`);
    }
    return parts.join(' / ');
  }, [selectedStyle, selectedFlavor]);

  // Filter Logic: 1차 테마 + 2차 취향 교차 필터
  const { exactMatches, fallbackThemeMatches, isFallback } = useMemo(() => {
    // 1. 상위 테마 기준 매칭
    const themeMatches = menusData.filter((drink) => {
      const bean = drink.beanId ? beansMap.get(drink.beanId) : null;
      return currentTheme.match(drink, bean);
    });

    // 2. 세부 교차 필터 적용
    const crossMatches = themeMatches.filter((drink) => {
      const bean = drink.beanId ? beansMap.get(drink.beanId) : null;

      // Style Match
      if (selectedStyle === 'black') {
        const isBlack =
          drink.category === '에스프레소·커피' ||
          drink.category === '콜드브루' ||
          drink.name.includes('아메리카노') ||
          drink.name.includes('룽고') ||
          drink.name.includes('롱블랙');
        const isNotMilk = !drink.name.includes('라떼') && !drink.name.includes('마키아또') && !drink.name.includes('모카');
        if (!isBlack || !isNotMilk) return false;
      }
      if (selectedStyle === 'milk') {
        const isMilk =
          drink.category === '라떼' ||
          drink.category === '논커피·라떼' ||
          drink.name.includes('라떼') ||
          drink.name.includes('마키아또') ||
          drink.name.includes('카푸치노') ||
          drink.name.includes('딜라이트') ||
          drink.name.includes('플랫화이트');
        if (!isMilk) return false;
      }
      if (selectedStyle === 'tea-ade') {
        const isTeaAde =
          drink.category === '티·에이드·스무디' ||
          drink.name.includes('에이드') ||
          drink.name.includes('티') ||
          drink.name.includes('아이스티') ||
          drink.name.includes('주스');
        if (!isTeaAde) return false;
      }

      // Flavor Match
      if (selectedFlavor === 'nutty-heavy') {
        const isNutty =
          (bean && (bean.body >= 4 || bean.acidity <= 2)) ||
          drink.name.includes('아메리카노') ||
          drink.name.includes('헤이즐넛') ||
          drink.name.includes('토피') ||
          drink.name.includes('오트');
        if (!isNutty) return false;
      }
      if (selectedFlavor === 'fruity-acidic') {
        const isFruity =
          (bean && bean.acidity >= 3) ||
          drink.name.includes('자몽') ||
          drink.name.includes('딸기') ||
          drink.name.includes('복숭아') ||
          drink.name.includes('샤인머스캣') ||
          drink.name.includes('블론드');
        if (!isFruity) return false;
      }
      if (selectedFlavor === 'sweet') {
        const isSweet =
          drink.sugar >= 20 ||
          drink.name.includes('바닐라') ||
          drink.name.includes('연유') ||
          drink.name.includes('초콜릿') ||
          drink.name.includes('프라페') ||
          drink.name.includes('쉐이크');
        if (!isSweet) return false;
      }
      if (selectedFlavor === 'low-sugar') {
        if (drink.sugar > 5) return false;
      }

      return true;
    });

    if (crossMatches.length > 0) {
      return {
        exactMatches: crossMatches,
        fallbackThemeMatches: [],
        isFallback: false
      };
    }

    // Zero-Result Fallback: 결과가 0건이면 상위 테마 기준 상위 3종 추출
    return {
      exactMatches: [],
      fallbackThemeMatches: themeMatches.slice(0, 3),
      isFallback: true
    };
  }, [currentTheme, selectedStyle, selectedFlavor, beansMap]);

  // Display Drinks: TOP 6 (다양한 브랜드 우선 배치)
  const displayDrinks = useMemo(() => {
    const list = isFallback ? fallbackThemeMatches : exactMatches;
    const seenBrands = new Set();
    const diverseList = [];
    const restList = [];

    list.forEach((drink) => {
      if (!seenBrands.has(drink.brandId)) {
        seenBrands.add(drink.brandId);
        diverseList.push(drink);
      } else {
        restList.push(drink);
      }
    });

    return [...diverseList, ...restList].slice(0, 6);
  }, [exactMatches, fallbackThemeMatches, isFallback]);

  const totalThemeMatchCount = useMemo(() => {
    return menusData.filter((drink) => {
      const bean = drink.beanId ? beansMap.get(drink.beanId) : null;
      return currentTheme.match(drink, bean);
    }).length;
  }, [currentTheme, beansMap]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. 상단: 메인 타이틀 및 서브카피 시선 집중 좌측 정렬 */}
      <section className="space-y-2.5">
        <div className="px-1">
          <span className="inline-block rounded-full bg-[#EFECE6] px-3 py-1 text-xs font-semibold tracking-wider text-[#78716C]">
            오늘의 맞춤 큐레이션
          </span>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#231915]">
            오늘 어떤 커피를 찾으시나요?
          </h2>
          <p className="mt-1.5 text-sm text-[#78716C] leading-relaxed">
            포털 인기 검색어와 영양성분을 바탕으로 지금 딱 맞는 한 잔을 제안합니다.
          </p>
        </div>

        {/* 5대 테마 카드 그리드 (단어 단위 줄바꿈 break-keep & 시각적 위계 교정) */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {TREND_THEMES.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setSelectedThemeId(theme.id);
                  setSelectedStyle('all');
                  setSelectedFlavor('all');
                }}
                className={`group flex cursor-pointer flex-col justify-between rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[#231915] bg-[#231915] text-[#FAF8F5] shadow-md ring-1 ring-[#231915]'
                    : 'border-[#EFECE6] bg-[#FFFFFF] text-[#231915] hover:border-[#78716C]/40 hover:bg-[#FAF8F5]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isSelected
                          ? 'bg-[#FFFFFF]/20 text-white'
                          : 'bg-[#FAF8F5] text-[#78716C] border border-[#EFECE6]'
                      }`}
                    >
                      {theme.badge}
                    </span>
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-[#D97757]" />
                    )}
                  </div>
                  <h3 className="mt-2.5 text-sm font-bold text-[#231915] group-hover:text-[#D97757] leading-snug break-keep transition-colors">
                    <span className={isSelected ? 'text-[#FAF8F5]' : 'text-[#231915]'}>
                      {theme.title}
                    </span>
                  </h3>
                </div>
                <p
                  className={`mt-1 text-xs leading-normal break-keep line-clamp-2 ${
                    isSelected ? 'text-[#FAF8F5]/80' : 'text-[#78716C]'
                  }`}
                >
                  {theme.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. 중단: 슬림 접이식(Accordion) 세부 취향 선택 */}
      <section className="space-y-2">
        {!hasCustomFilter ? (
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex h-9 w-full cursor-pointer items-center justify-between rounded-xl border border-[#EFECE6] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm text-[#574E4A] shadow-2xs transition-all hover:border-[#78716C]/40 hover:bg-[#FAF8F5]"
          >
            <div className="flex items-center gap-1.5 font-medium">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#78716C]" />
              <span>+ 입맛에 맞는 세부 취향 선택 (스타일·맛)</span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-[#78716C] transition-transform duration-200 ${
                isFilterOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        ) : (
          <div className="flex h-9 w-full items-center justify-between rounded-xl border border-[#231915]/30 bg-[#FAF8F5] px-3.5 text-xs sm:text-sm text-[#231915] shadow-2xs">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex cursor-pointer items-center gap-1.5 font-semibold hover:underline"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#D97757]" />
              <span>
                세부 조율 중 ({filterSummaryText})
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#78716C] transition-transform duration-200 ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedStyle('all');
                setSelectedFlavor('all');
              }}
              className="flex cursor-pointer items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-bold text-[#78716C] hover:bg-[#EFECE6] hover:text-[#231915] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span>초기화</span>
            </button>
          </div>
        )}

        {/* 아코디언 드롭다운 컨텐츠 */}
        {isFilterOpen && (
          <div className="rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] p-3.5 sm:p-4 shadow-xs space-y-2.5 transition-all">
            {/* Step 1: 음료 스타일 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              <span className="text-xs font-bold text-[#78716C] shrink-0 w-16">
                스타일:
              </span>
              <div className="flex items-center gap-1.5">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedStyle(opt.id)}
                    className={`cursor-pointer shrink-0 rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium transition-all ${
                      selectedStyle === opt.id
                        ? 'bg-[#231915] text-[#FAF8F5] font-semibold shadow-xs'
                        : 'border border-[#EFECE6] bg-[#FAF8F5] text-[#78716C] hover:text-[#231915] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: 선호하는 맛의 결 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              <span className="text-xs font-bold text-[#78716C] shrink-0 w-16">
                맛의 결:
              </span>
              <div className="flex items-center gap-1.5">
                {FLAVOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedFlavor(opt.id)}
                    className={`cursor-pointer shrink-0 rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium transition-all ${
                      selectedFlavor === opt.id
                        ? 'bg-[#231915] text-[#FAF8F5] font-semibold shadow-xs'
                        : 'border border-[#EFECE6] bg-[#FAF8F5] text-[#78716C] hover:text-[#231915] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Zero-Result Fallback Alert */}
      {isFallback && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#D97757]/30 bg-[#FFF5F2] p-3.5 text-xs sm:text-sm text-[#231915]">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#D97757] mt-0.5" />
          <div>
            <p className="font-bold text-[#D97757]">
              정확히 일치하는 메뉴가 없어, 가장 결이 비슷한 대표 메뉴를 대신 추천해 드려요.
            </p>
            <p className="mt-0.5 text-xs text-[#78716C]">
              선택하신 조건('{STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.label}' + '{FLAVOR_OPTIONS.find((f) => f.id === selectedFlavor)?.label}')을 완화하시거나 아래 추천 음료를 확인해 보세요.
            </p>
          </div>
        </div>
      )}

      {/* 3. 하단: 추천 결과 카드 그리드 (공통 DrinkCard 게이지 바 디자인 일원화) */}
      <section className="space-y-3.5">
        <div className="flex items-baseline justify-between px-1">
          <div>
            <span className="text-sm font-bold text-[#231915]">
              지금 추천하는 메뉴 {displayDrinks.length}선
            </span>
            <span className="ml-2 text-xs text-[#78716C]">
              ('{currentTheme.title}' 테마 기준)
            </span>
          </div>
          <span className="text-xs text-[#78716C]">
            카드 클릭 시 성분 상세 & 담기
          </span>
        </div>

        {/* 6종 큐레이션 카드 그리드 (공통 DrinkCard + Sparkles 2줄 압축 코멘트 슬롯) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayDrinks.map((drink) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              onSelectDrink={onSelectDrink}
              topSlot={
                <div className="mb-3 flex items-start gap-2 rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-2.5 text-xs leading-relaxed text-[#574E4A]">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#D97757] mt-0.5" />
                  <p className="line-clamp-2 break-keep font-medium">
                    {getWhyPickComment(selectedThemeId)}
                  </p>
                </div>
              }
            />
          ))}
        </div>
      </section>

      {/* 4. 하단: '음료 탐색' 탭과의 자연스러운 Flow 연동 버튼 2종 */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 pb-6">
        <button
          type="button"
          onClick={() => {
            onNavigateToExplore({
              curationId: currentTheme.exploreCurationId,
              categoryId: currentTheme.exploreCategoryId
            });
          }}
          className="group flex cursor-pointer items-center justify-center gap-2 w-full sm:w-auto rounded-2xl bg-[#231915] px-7 py-3.5 text-xs sm:text-sm font-semibold text-[#FAF8F5] shadow-xs hover:bg-[#3D2C24] hover:shadow-md transition-all"
        >
          <span>이 조건에 맞는 음료 더 찾아보기 (총 {totalThemeMatchCount}개)</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={() => {
            onNavigateToExplore({
              curationId: 'all',
              categoryId: 'all'
            });
          }}
          className="flex cursor-pointer items-center justify-center gap-1.5 w-full sm:w-auto rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#78716C] hover:text-[#231915] hover:border-[#78716C]/40 transition-all"
        >
          <span>전체 음료 목록 둘러보기 →</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
}
