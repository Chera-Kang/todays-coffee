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
        <span className="inline-block rounded-full bg-[#EFECE6] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#78716C] uppercase">
          Brand Intelligence
        </span>
        <h2 className="mt-2 font-serif text-2xl font-bold text-[#231915]">
          4대 커피 프랜차이즈 한눈에 비교
        </h2>
        <p className="mt-1 text-sm text-[#78716C]">
          기본 아메리카노의 용량, 가격, 100ml당 단가와 메뉴별 카페인 특성을 비교 분석했습니다.
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
                  <h3 className="font-serif text-xl font-bold text-[#231915]">
                    {brand.name}
                  </h3>
                  <span className="text-xs text-[#78716C]">
                    {brand.nameEn}
                  </span>
                </div>
                <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-[11px] font-semibold text-[#78716C]">
                  {brand.tagline}
                </span>
              </div>

              <p className="mt-2.5 text-xs text-[#78716C] leading-relaxed">
                {brand.description}
              </p>

              {/* Infographic KPI Stats */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3 text-center">
                  <div className="flex items-center justify-center text-[#78716C] mb-1">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] text-[#78716C]">기본 가격</span>
                  <p className="mt-0.5 text-sm font-bold text-[#231915]">
                    {brand.americanoInfo.price.toLocaleString()}원
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3 text-center">
                  <div className="flex items-center justify-center text-[#78716C] mb-1">
                    <Droplet className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] text-[#78716C]">기본 용량</span>
                  <p className="mt-0.5 text-sm font-bold text-[#231915]">
                    {brand.americanoInfo.volume}ml
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3 text-center">
                  <div className="flex items-center justify-center text-[#78716C] mb-1">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] text-[#78716C]">100ml당 단가</span>
                  <p className="mt-0.5 text-sm font-bold text-[#231915]">
                    {brand.americanoInfo.pricePer100ml}원
                  </p>
                </div>

                <div className="rounded-xl border border-[#EFECE6] bg-[#FAF8F5] p-3 text-center">
                  <div className="flex items-center justify-center text-[#78716C] mb-1">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[10px] text-[#78716C]">평균 카페인</span>
                  <p className="mt-0.5 text-sm font-bold text-[#231915]">
                    {brand.avgCaffeine}mg
                  </p>
                </div>
              </div>

              {/* Price per 100ml Visual Bar */}
              <div className="mt-4 rounded-xl bg-[#FAF8F5] p-3.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#78716C]">가성비 척도 (100ml당 단가 비교)</span>
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
              <span className="text-[11px] font-semibold text-[#78716C]">
                핵심 강점 및 서비스
              </span>
              <ul className="mt-2 space-y-1">
                {brand.features?.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-[#231915]">
                    <span className="h-1 w-1 rounded-full bg-[#78716C]" />
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
