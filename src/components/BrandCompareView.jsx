import React from 'react';
import brandsData from '../data/brands.json';
import menusData from '../data/menus.json';
import { Award, Zap, DollarSign, Droplet } from 'lucide-react';

export default function BrandCompareView() {
  // Calculate average caffeine & calorie for each brand
  const brandStats = brandsData.map((brand) => {
    const brandMenus = menusData.filter((m) => m.brandId === brand.id);
    const avgCaffeine = Math.round(
      brandMenus.reduce((acc, m) => acc + m.caffeine, 0) / (brandMenus.length || 1)
    );
    const avgCalories = Math.round(
      brandMenus.reduce((acc, m) => acc + m.calories, 0) / (brandMenus.length || 1)
    );

    return {
      ...brand,
      menuCount: brandMenus.length,
      avgCaffeine,
      avgCalories
    };
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-3xl border border-[#EFECE6] bg-[#FFFFFF] p-6 shadow-xs sm:p-8">
        <span className="inline-block rounded-full bg-[#EFECE6] px-3 py-1 text-xs font-semibold tracking-wider text-[#78716C]">
          브랜드별 스펙 분석
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#231915]">
          8대 커피 프랜차이즈 한눈에 비교
        </h2>
        <p className="mt-1 text-sm text-[#78716C] leading-relaxed">
          스타벅스, 메가커피, 컴포즈, 폴바셋, 투썸, 이디야, 빽다방, 할리스의 기본 아메리카노 용량, 가격, 100ml당 가격과 메뉴별 카페인 특성을 비교 분석했습니다.
        </p>
      </div>

      {/* Comparison Infographic Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {brandStats.map((brand) => (
          <div
            key={brand.id}
            className="flex flex-col justify-between rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] p-6 shadow-xs transition-all hover:border-[#78716C]/40"
          >
            <div>
              {/* Brand Top Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full shadow-xs"
                    style={{ backgroundColor: brand.color }}
                  />
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#231915]">
                    {brand.name}
                  </h3>
                  <span className="text-xs text-[#78716C]">
                    {brand.nameEn}
                  </span>
                </div>
                <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-xs font-semibold text-[#78716C]">
                  {brand.tagline}
                </span>
              </div>

              <p className="mt-2.5 text-sm text-[#78716C] leading-relaxed">
                {brand.description}
              </p>

              {/* Infographic KPI Stats (문구 교정: 아메리카노 기준 가격, 기본 사이즈 용량, 100ml당 가격) */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3 text-center">
                  <div className="flex items-center justify-center text-[#78716C] mb-1">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-[#78716C] whitespace-nowrap">아메리카노 가격</span>
                  <p className="mt-0.5 text-sm font-semibold text-[#231915]">
                    {brand.americanoInfo.price.toLocaleString()}원
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3 text-center">
                  <div className="flex items-center justify-center text-[#78716C] mb-1">
                    <Droplet className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-[#78716C]">기본 사이즈 용량</span>
                  <p className="mt-0.5 text-sm font-semibold text-[#231915]">
                    {brand.americanoInfo.volume}ml
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3 text-center">
                  <div className="flex items-center justify-center text-[#78716C] mb-1">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-[#78716C]">100ml당 가격</span>
                  <p className="mt-0.5 text-sm font-semibold text-[#231915]">
                    {brand.americanoInfo.pricePer100ml}원
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3 text-center">
                  <div className="flex items-center justify-center text-[#78716C] mb-1">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-[#78716C]">평균 카페인</span>
                  <p className="mt-0.5 text-sm font-semibold text-[#231915]">
                    {brand.avgCaffeine}mg
                  </p>
                </div>
              </div>

              {/* Price per 100ml Visual Bar (용량 대비 가성비 비교 로 문구 교정) */}
              <div className="mt-4 rounded-xl bg-[#FAF8F5] p-3.5">
                <div className="flex justify-between text-xs sm:text-sm font-medium">
                  <span className="text-[#78716C]">용량 대비 가성비 비교</span>
                  <span className="text-[#231915] font-bold">{brand.americanoInfo.pricePer100ml}원</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EFECE6]">
                  <div
                    className="h-full bg-[#231915] transition-all"
                    style={{
                      width: `${Math.min(
                        Math.round((brand.americanoInfo.pricePer100ml / 1600) * 100),
                        100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Brand Key Highlights */}
            <div className="mt-5 border-t border-[#EFECE6] pt-4">
              <span className="text-xs font-semibold text-[#78716C]">
                핵심 강점 및 서비스
              </span>
              <ul className="mt-2 space-y-1.5">
                {brand.features?.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-[#231915]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#78716C]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
