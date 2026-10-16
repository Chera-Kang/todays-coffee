import React, { useState, useMemo } from 'react';
import { Tag, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import beansData from '../data/beans.json';

// 1차 직관적 취향 프리셋
const TASTE_PRESETS = [
  {
    id: 'all',
    label: '전체 원두',
    match: () => true
  },
  {
    id: 'nutty',
    label: '고소·견과류 (산미 없음)',
    match: (b) =>
      b.acidity <= 2 &&
      b.tags?.some((t) => t.includes('견과') || t.includes('고소') || t.includes('아몬드') || t.includes('보리'))
  },
  {
    id: 'chocolate',
    label: '다크초콜릿·진한 풍미',
    match: (b) =>
      b.roast >= 4 &&
      b.tags?.some((t) => t.includes('초콜릿') || t.includes('카카오') || t.includes('스모키'))
  },
  {
    id: 'fruity',
    label: '화사한 과일·산미',
    match: (b) =>
      b.acidity >= 3 &&
      b.tags?.some((t) => t.includes('시트러스') || t.includes('과일') || t.includes('베리') || t.includes('플로럴') || t.includes('산미'))
  },
  {
    id: 'decaf',
    label: '부드러운 디카페인',
    match: (b) => b.tags?.some((t) => t.includes('디카페인'))
  }
];

export default function BeanGuideView({ onSelectBeanToDrinks }) {
  // 1차 필터 상태
  const [selectedTaste, setSelectedTaste] = useState('all');

  // 2차 필터(상세 스펙) 접이식 토글 상태
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBody, setSelectedBody] = useState('all'); // 'all' | 'light' | 'medium' | 'heavy'
  const [selectedRoast, setSelectedRoast] = useState('all'); // 'all' | 'medium' | 'dark'
  const [selectedTag, setSelectedTag] = useState('all');

  // Collect all unique tags for 2차 filter
  const allTags = useMemo(() => {
    return Array.from(new Set(beansData.flatMap((b) => b.tags || [])));
  }, []);

  // Filter beans with 1차 + 2차 combined logic
  const filteredBeans = useMemo(() => {
    const tasteObj = TASTE_PRESETS.find((t) => t.id === selectedTaste);
    const tasteMatch = tasteObj ? tasteObj.match : () => true;

    return beansData.filter((b) => {
      // 1. 1차 취향 필터
      if (!tasteMatch(b)) return false;

      // 2. 2차 상세 바디감 필터
      if (selectedBody === 'light' && b.body > 2) return false;
      if (selectedBody === 'medium' && b.body !== 3) return false;
      if (selectedBody === 'heavy' && b.body < 4) return false;

      // 3. 2차 상세 로스팅 필터
      if (selectedRoast === 'medium' && (b.roast < 2 || b.roast > 3)) return false;
      if (selectedRoast === 'dark' && b.roast < 4) return false;

      // 4. 2차 세부 태그 필터
      if (selectedTag !== 'all' && !b.tags?.includes(selectedTag)) return false;

      return true;
    });
  }, [selectedTaste, selectedBody, selectedRoast, selectedTag]);

  const handleResetFilters = () => {
    setSelectedTaste('all');
    setSelectedBody('all');
    setSelectedRoast('all');
    setSelectedTag('all');
  };

  const isDetailFilterActive = selectedBody !== 'all' || selectedRoast !== 'all' || selectedTag !== 'all';

  const renderDots = (value, label, activeColor = 'bg-[#231915]') => (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[#78716C]">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              num <= value ? activeColor : 'bg-[#EFECE6]'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Intro Header & 1차 / 2차 Filter Hub */}
      <div className="rounded-3xl border border-[#EFECE6] bg-[#FFFFFF] p-6 shadow-xs sm:p-8 space-y-5">
        <div>
          <span className="inline-block rounded-full bg-[#EFECE6] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#78716C] uppercase">
            Specialty Bean Guide
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#231915]">
            원두 프로필 & 테이스팅 가이드
          </h2>
          <p className="mt-1 text-sm text-[#78716C]">
            나의 취향에 맞는 원두를 쉽고 직관적으로 찾아보세요. 산미 없는 고소함부터 매니아를 위한 세부 스펙까지 제공합니다.
          </p>
        </div>

        {/* 1차 필터: 대중적인 직관적 취향 선택 (알약형 버튼) */}
        <div>
          <span className="text-xs font-bold text-[#231915]">
            1단계: 내가 좋아하는 커피 맛 선택
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {TASTE_PRESETS.map((preset) => {
              const isSelected = selectedTaste === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedTaste(preset.id)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#231915] text-[#FAF8F5] shadow-sm ring-1 ring-[#231915]'
                      : 'border border-[#EFECE6] bg-[#FAF8F5] text-[#78716C] hover:text-[#231915] hover:bg-[#FFFFFF]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2차 필터 접이식 토글 버튼 */}
        <div className="border-t border-[#EFECE6] pt-3.5">
          <button
            type="button"
            onClick={() => setIsDetailOpen((prev) => !prev)}
            className="flex cursor-pointer items-center justify-between w-full text-left text-xs font-bold text-[#231915] hover:text-[#D97757] transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>상세 스펙으로 찾기 (바디감 · 로스팅 단계 · 세부 향미)</span>
              {isDetailFilterActive && (
                <span className="rounded-full bg-[#D97757] px-2 py-0.2 text-[10px] font-bold text-white">
                  적용 중
                </span>
              )}
            </div>
            {isDetailOpen ? (
              <ChevronUp className="h-4 w-4 text-[#78716C]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#78716C]" />
            )}
          </button>

          {/* 2차 상세 스펙 영역 (Collapsible) */}
          {isDetailOpen && (
            <div className="mt-4 rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-4.5 space-y-4">
              {/* 바디감 선택 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-[11px] font-bold text-[#78716C] w-20 shrink-0">
                  바디감 강도:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: '전체 바디감' },
                    { id: 'light', label: '가벼움 (Lv.1~2)' },
                    { id: 'medium', label: '미디엄 (Lv.3)' },
                    { id: 'heavy', label: '묵직함 (Lv.4~5)' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedBody(item.id)}
                      className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                        selectedBody === item.id
                          ? 'bg-[#231915] text-[#FAF8F5] font-semibold'
                          : 'border border-[#EFECE6] bg-[#FFFFFF] text-[#78716C] hover:text-[#231915]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 로스팅 단계 선택 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-[11px] font-bold text-[#78716C] w-20 shrink-0">
                  로스팅 강도:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: '전체 로스팅' },
                    { id: 'medium', label: '마일드/미디엄 (Lv.2~3)' },
                    { id: 'dark', label: '다크 로스트 (Lv.4~5)' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedRoast(item.id)}
                      className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                        selectedRoast === item.id
                          ? 'bg-[#231915] text-[#FAF8F5] font-semibold'
                          : 'border border-[#EFECE6] bg-[#FFFFFF] text-[#78716C] hover:text-[#231915]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 세부 테이스팅 노트 태그 */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <span className="text-[11px] font-bold text-[#78716C] w-20 shrink-0 mt-1">
                  세부 향미 태그:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTag('all')}
                    className={`cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                      selectedTag === 'all'
                        ? 'bg-[#231915] text-[#FAF8F5]'
                        : 'border border-[#EFECE6] bg-[#FFFFFF] text-[#78716C] hover:text-[#231915]'
                    }`}
                  >
                    #전체
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
                        selectedTag === tag
                          ? 'bg-[#231915] text-[#FAF8F5]'
                          : 'border border-[#EFECE6] bg-[#FFFFFF] text-[#78716C] hover:text-[#231915]'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Count & Reset */}
        <div className="flex items-center justify-between text-xs text-[#78716C] pt-1">
          <div>
            <span>매칭된 원두: </span>
            <strong className="text-[#231915]">{filteredBeans.length}</strong>종
          </div>
          {(selectedTaste !== 'all' || isDetailFilterActive) && (
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
      </div>

      {/* Beans Grid */}
      {filteredBeans.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBeans.map((bean) => (
            <div
              key={bean.id}
              className="flex flex-col justify-between rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] p-6 shadow-xs transition-all hover:border-[#78716C]/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#78716C]">
                    {bean.brand}
                  </span>
                  <span className="text-[11px] text-[#78716C]">
                    Roast Lv.{bean.roast}
                  </span>
                </div>

                <h3 className="mt-2.5 text-lg font-bold tracking-tight text-[#231915]">
                  {bean.name}
                </h3>
                <p className="mt-1 text-xs text-[#78716C] leading-relaxed">
                  {bean.description}
                </p>
              </div>

              <div className="mt-5 space-y-3 border-t border-[#EFECE6] pt-4">
                {/* Dot meters */}
                <div className="space-y-2 rounded-xl bg-[#FAF8F5] p-3">
                  {renderDots(bean.roast, '로스팅 강도 (Roast)', 'bg-[#3D2C24]')}
                  {renderDots(bean.acidity, '산미 (Acidity)', 'bg-[#5B7A5E]')}
                  {renderDots(bean.body, '바디감 (Body)', 'bg-[#231915]')}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {bean.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[#FAF8F5] border border-[#EFECE6] px-2 py-0.5 text-[10px] font-medium text-[#78716C]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#EFECE6] bg-[#FFFFFF] py-16 text-center">
          <p className="text-base font-bold tracking-tight text-[#231915]">
            조건에 일치하는 원두가 없습니다.
          </p>
          <p className="mt-1 text-xs text-[#78716C]">
            1차 취향 필터를 변경하거나 상세 스펙을 초기화해 보세요.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 rounded-xl bg-[#231915] px-4 py-2 text-xs font-semibold text-[#FAF8F5] transition-opacity hover:opacity-90"
          >
            원두 필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
