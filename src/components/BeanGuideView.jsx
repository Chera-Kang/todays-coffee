import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import beansData from '../data/beans.json';

export default function BeanGuideView({ onSelectBeanToDrinks }) {
  const [selectedTag, setSelectedTag] = useState('all');

  // Collect all unique tags
  const allTags = Array.from(
    new Set(beansData.flatMap((b) => b.tags || []))
  );

  const filteredBeans = selectedTag === 'all'
    ? beansData
    : beansData.filter((b) => b.tags?.includes(selectedTag));

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
      {/* Intro Header */}
      <div className="rounded-3xl border border-[#EFECE6] bg-[#FFFFFF] p-6 shadow-xs sm:p-8">
        <span className="inline-block rounded-full bg-[#EFECE6] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#78716C] uppercase">
          Specialty Bean Guide
        </span>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#231915]">
          원두 프로필 & 테이스팅 노트
        </h2>
        <p className="mt-1 text-sm text-[#78716C]">
          각 프랜차이즈가 사용하는 대표 블렌드와 싱글 오리진의 로스팅 정도, 산미, 바디감을 비교해 보세요.
        </p>

        {/* Tag Filters (Horizontal scroll on mobile) */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          <button
            type="button"
            onClick={() => setSelectedTag('all')}
            className={`cursor-pointer shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              selectedTag === 'all'
                ? 'bg-[#231915] text-[#FAF8F5]'
                : 'border border-[#EFECE6] bg-[#FAF8F5] text-[#78716C] hover:text-[#231915]'
            }`}
          >
            전체 원두
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`cursor-pointer shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-[#231915] text-[#FAF8F5]'
                  : 'border border-[#EFECE6] bg-[#FAF8F5] text-[#78716C] hover:text-[#231915]'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Beans Grid */}
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
                {renderDots(bean.roast, '로스팅 강도 (Darkness)', 'bg-[#3D2C24]')}
                {renderDots(bean.acidity, '산미 (Acidity)', 'bg-[#5B7A5E]')}
                {renderDots(bean.body, '바디감 (Body)', 'bg-[#231915]')}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bean.tags?.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
                      selectedTag === tag
                        ? 'bg-[#231915] text-[#FAF8F5]'
                        : 'bg-[#FAF8F5] text-[#78716C]'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
