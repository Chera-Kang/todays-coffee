import React from 'react';
import { Zap, Leaf, Moon, Activity, LayoutGrid } from 'lucide-react';

export const CURATION_PRESETS = [
  {
    id: 'all',
    label: '전체 음료',
    subtitle: '8대 브랜드 45종',
    icon: LayoutGrid,
    filter: () => true,
    conditionText: '전체 메뉴 보기'
  },
  {
    id: 'booster',
    label: '야근·집중 부스터',
    subtitle: '카페인 150mg 이상',
    icon: Zap,
    filter: (item) => item.caffeine >= 150,
    conditionText: '카페인 ≥ 150mg'
  },
  {
    id: 'diet',
    label: '식단 관리·제로슈거',
    subtitle: '당류 5g 이하 & 50kcal 이하',
    icon: Leaf,
    filter: (item) => item.sugar <= 5 && item.calories <= 50,
    conditionText: '당류 ≤ 5g & 칼로리 ≤ 50kcal'
  },
  {
    id: 'afternoon-decaf',
    label: '오후 3시 이후 디카페인',
    subtitle: '카페인 30mg 이하',
    icon: Moon,
    filter: (item) => item.caffeine <= 30,
    conditionText: '카페인 ≤ 30mg'
  },
  {
    id: 'pre-workout',
    label: '운동 전 아메리카노 대용',
    subtitle: '카페인 150mg 이상 & 30kcal 이하',
    icon: Activity,
    filter: (item) => item.caffeine >= 150 && item.calories <= 30,
    conditionText: '카페인 ≥ 150mg & 칼로리 ≤ 30kcal'
  }
];

export default function HeroCuration({ selectedCuration, onSelectCuration }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#EFECE6] bg-[#FFFFFF] p-6 shadow-xs sm:p-8">
      {/* Decorative Warm Ambient Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#EFECE6]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#FAF8F5] blur-2xl" />

      <div className="relative z-10 max-w-2xl">
        <span className="inline-block rounded-full bg-[#EFECE6] px-3 py-1 text-xs font-semibold tracking-wider text-[#78716C]">
          맞춤 음료 큐레이션
        </span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#231915] sm:text-3xl sm:leading-snug">
          오늘 당신의 컨디션에는<br />
          어떤 음료가 필요한가요?
        </h1>
        <p className="mt-2 text-sm text-[#78716C] leading-relaxed">
          국내 대표 8대 프랜차이즈의 커피부터 논커피까지, 영양성분과 원두 데이터를 분석해 가장 이상적인 한 잔을 제안합니다.
        </p>
      </div>

      {/* Curation Filter Chips */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {CURATION_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedCuration === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectCuration(preset.id)}
              className={`group flex cursor-pointer flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-[#231915] bg-[#231915] text-[#FAF8F5] shadow-sm ring-1 ring-[#231915]'
                  : 'border-[#EFECE6] bg-[#FAF8F5] text-[#231915] hover:border-[#78716C]/40 hover:bg-[#FFFFFF]'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  isSelected
                    ? 'bg-[#FFFFFF]/15 text-[#FAF8F5]'
                    : 'bg-[#FFFFFF] text-[#231915] shadow-xs'
                }`}
              >
                <Icon className="h-4 w-4 stroke-[1.8]" />
              </div>
              <span className="mt-2.5 text-xs sm:text-sm font-bold leading-tight">
                {preset.label}
              </span>
              <span
                className={`mt-1 text-xs ${
                  isSelected ? 'text-[#FAF8F5]/80' : 'text-[#78716C]'
                }`}
              >
                {preset.conditionText}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
