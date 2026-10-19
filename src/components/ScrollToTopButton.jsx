import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 최상단 근처(200px 미만)에서는 숨김
      if (currentScrollY < 200) {
        setIsVisible(false);
      } else {
        // 사용자가 위로 스크롤할 때(currentScrollY < lastScrollY)만 노출
        // 아래로 스크롤할 때는 콘텐츠를 가리지 않도록 숨김
        if (currentScrollY < lastScrollY - 5) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY + 5) {
          setIsVisible(false);
        }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="최상단으로 이동"
      className={`fixed right-4 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#3D2C24]/20 bg-[#231915] text-[#FAF8F5] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#3D2C24] active:scale-95 sm:bottom-8 sm:right-8 ${
        isVisible
          ? 'bottom-20 opacity-100 pointer-events-auto translate-y-0'
          : 'bottom-20 opacity-0 pointer-events-none translate-y-3'
      }`}
    >
      <ArrowUp className="h-5 w-5 stroke-[2.25]" />
    </button>
  );
}
