import React, { useEffect, useState } from 'react';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFoundView({ onNavigateHome }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      onNavigateHome();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onNavigateHome]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center animate-fade-in">
      {/* Editorial Minimal Blank Card */}
      <div className="flex max-w-md flex-col items-center">
        {/* Subtle Icon Badge */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] shadow-2xs">
          <Compass className="h-6 w-6 stroke-[1.5] text-[#78716C]" />
        </div>

        {/* Small Tag */}
        <span className="mt-5 rounded-full bg-[#EFECE6] px-3 py-0.5 text-[11px] font-bold tracking-wider text-[#78716C] uppercase">
          Page Not Found (404)
        </span>

        {/* Main Headline */}
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#231915] sm:text-3xl">
          페이지를 찾을 수 없습니다
        </h2>

        {/* Description (모바일/PC 모두 온전한 2줄 문장으로 명확히 줄바꿈) */}
        <div className="mt-2 text-sm leading-relaxed text-[#78716C] break-keep space-y-1">
          <p>주소가 잘못되었거나 존재하지 않는 페이지입니다.</p>
          <p>
            <strong className="text-[#231915] font-semibold">{countdown}초 후</strong> 추천 커피 첫 페이지로 자동 이동합니다.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            type="button"
            onClick={onNavigateHome}
            className="group flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#231915] px-5 py-3 text-xs sm:text-sm font-semibold text-[#FAF8F5] shadow-xs transition-all hover:bg-[#3D2C24] active:scale-95"
          >
            <span>첫 페이지(맞춤 큐레이션)로 이동</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
