import React from 'react';
import { Sparkles, ArrowRight, Compass, Coffee, ShieldCheck } from 'lucide-react';

export default function RecommendationView({ onGoToExplore }) {
  return (
    <div className="space-y-6">
      {/* Editorial Teaser Box */}
      <section className="relative overflow-hidden rounded-3xl border border-[#EFECE6] bg-[#FFFFFF] p-8 shadow-xs text-center sm:py-16 sm:px-12">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FAF8F5] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#EFECE6]/40 blur-2xl" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Minimal Line Icon Badge */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#231915] text-[#FAF8F5] shadow-xs">
            <Sparkles className="h-7 w-7 stroke-[1.75]" />
          </div>

          <span className="mt-6 inline-block rounded-full bg-[#EFECE6] px-3.5 py-1 text-[11px] font-semibold tracking-wider text-[#78716C] uppercase">
            AI Personalized Curation Engine
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#231915] sm:text-3xl">
            나만의 맞춤 커피 추천 모듈 준비 중
          </h1>

          <p className="mt-3 text-sm text-[#78716C] leading-relaxed">
            체라님의 하루 리듬, 오늘 집중이 필요한 시간대, 카페인 민감도를 종합 분석하여 가장 완벽한 한 잔을 제안하는 스마트 추천 엔진을 준비하고 있습니다.
          </p>

          {/* Feature Teaser Cards */}
          <div className="mt-8 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFFFFF] text-[#231915] shadow-xs">
                <Coffee className="h-4 w-4" />
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-[#231915]">
                생체 리듬 기반
              </h3>
              <p className="mt-1 text-[11px] text-[#78716C] leading-tight">
                기상 시간과 코르티솔 주기를 고려한 카페인 타이밍
              </p>
            </div>

            <div className="rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFFFFF] text-[#231915] shadow-xs">
                <Compass className="h-4 w-4" />
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-[#231915]">
                취향 플레이버 매칭
              </h3>
              <p className="mt-1 text-[11px] text-[#78716C] leading-tight">
                산미, 고소함, 디카페인 등 세밀한 테이스팅 노트 분석
              </p>
            </div>

            <div className="rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFFFFF] text-[#231915] shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-[#231915]">
                스마트 영양 밸런스
              </h3>
              <p className="mt-1 text-[11px] text-[#78716C] leading-tight">
                당류와 칼로리 상한선을 지키는 안심 큐레이션
              </p>
            </div>
          </div>

          {/* Action Button to Explore Tab */}
          <div className="mt-8">
            <button
              type="button"
              onClick={onGoToExplore}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#231915] px-6 py-3.5 text-sm font-semibold text-[#FAF8F5] shadow-xs transition-all hover:bg-[#3D2C24] hover:shadow-md"
            >
              <span>다른 음료 더보기 (전체 음료 45종 탐색)</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
