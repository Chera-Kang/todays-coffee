import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Check, AlertCircle, Info, PlusCircle, ArrowRight } from 'lucide-react';
import DrinkThumbnail from './DrinkThumbnail';
import menusData from '../data/menus.json';

const BRAND_STYLES = {
  starbucks: { badgeBg: 'bg-[#EBF5F0]', badgeText: 'text-[#00704A]', dot: 'bg-[#00704A]' },
  megacoffee: { badgeBg: 'bg-[#FEF9E6]', badgeText: 'text-[#8A6D00]', dot: 'bg-[#D4A017]' },
  compose: { badgeBg: 'bg-[#FFF7EB]', badgeText: 'text-[#A05E00]', dot: 'bg-[#E69C24]' },
  paulbassett: { badgeBg: 'bg-[#FAEAEC]', badgeText: 'text-[#A6192E]', dot: 'bg-[#A6192E]' },
  twosome: { badgeBg: 'bg-[#FDF0F0]', badgeText: 'text-[#D62734]', dot: 'bg-[#D62734]' },
  ediya: { badgeBg: 'bg-[#EDF2FA]', badgeText: 'text-[#1B3B8A]', dot: 'bg-[#1B3B8A]' },
  paik: { badgeBg: 'bg-[#FEFCE8]', badgeText: 'text-[#926004]', dot: 'bg-[#F5B800]' },
  hollys: { badgeBg: 'bg-[#FDF2F3]', badgeText: 'text-[#BA1828]', dot: 'bg-[#BA1828]' }
};

export default function DrinkDetailModal({
  drink,
  bean,
  isOpen,
  onClose,
  onAddDrink,
  onSelectDrink
}) {
  const [memo, setMemo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const contentRef = useRef(null);

  // 음료 변경 시(타 브랜드 메뉴 선택 등) 스크롤 즉시 최상단 초기화
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    setMemo('');
    setErrorMessage('');
    setIsSuccess(false);
  }, [drink?.id]);

  // 타 브랜드 대체 음료 추천 (동일 카테고리이면서 다른 브랜드 2종)
  const rivalDrinks = useMemo(() => {
    if (!drink) return [];
    return menusData
      .filter((m) => m.brandId !== drink.brandId && (m.category === drink.category || m.boundaryTag === drink.boundaryTag))
      .slice(0, 2);
  }, [drink]);

  if (!isOpen || !drink) return null;

  const brandStyle = BRAND_STYLES[drink.brandId] || {
    badgeBg: 'bg-[#FAF8F5]',
    badgeText: 'text-[#78716C]',
    dot: 'bg-[#78716C]'
  };

  const beanBrandStyle = bean ? (BRAND_STYLES[bean.brandId] || {
    badgeBg: 'bg-[#FAF8F5]',
    badgeText: 'text-[#78716C]',
    dot: 'bg-[#78716C]'
  }) : null;

  // Validation Rule:
  // - Max 30 chars
  // - Cannot be whitespace only (when not empty)
  // - Disallow special characters
  const validateMemo = (val) => {
    if (!val || val.length === 0) {
      setErrorMessage('');
      return true;
    }

    if (val.trim().length === 0) {
      setErrorMessage('공백만으로는 메모를 작성할 수 없습니다.');
      return false;
    }

    if (val.length > 30) {
      setErrorMessage('메모는 최대 30자 이내로 입력해 주세요.');
      return false;
    }

    const specialCharsRegex = /[!@#$%^&*()+=\[\]{};':"\\|<>/?~`]/;
    if (specialCharsRegex.test(val)) {
      setErrorMessage('특수문자(!@#$%^&*() 등)는 입력하실 수 없습니다.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleMemoChange = (e) => {
    const val = e.target.value;
    setMemo(val);
    validateMemo(val);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateMemo(memo)) {
      return;
    }

    onAddDrink(drink, memo);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setMemo('');
      onClose();
    }, 700);
  };

  // Render 5-dot rating with 3 tailored colors
  const renderDots = (value, label, activeColor = 'bg-[#231915]') => {
    return (
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#231915]/60 backdrop-blur-xs">
      {/* Background Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Dialog Box (화면 중앙 정렬 & dvh 대응) */}
      <div className="relative z-10 flex max-h-[88dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-[#EFECE6] bg-[#FFFFFF] shadow-2xl">
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-[#EFECE6] px-6 py-4 bg-[#FFFFFF]">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${brandStyle.badgeBg} ${brandStyle.badgeText}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${brandStyle.dot}`} />
              {drink.brand}
            </span>
            <span className="text-xs text-[#78716C]">· {drink.category}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#78716C] transition-colors hover:bg-[#FAF8F5] hover:text-[#231915]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content (Scrollbar Hidden via scrollbar-hide) */}
        <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-hide px-6 py-5 space-y-5">
          {/* Visual Thumbnail + Title & Description (폰트 스케일업) */}
          <div className="flex items-start gap-4">
            <DrinkThumbnail drink={drink} size={72} className="shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold tracking-tight text-[#231915] sm:text-3xl leading-tight">
                {drink.name}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#78716C]">
                {drink.description}
              </p>
              {drink.boundaryTag && (
                <span className="mt-2 inline-flex items-center rounded-md border border-[#EFECE6] bg-[#FAF8F5] px-2.5 py-0.5 text-xs font-semibold text-[#574E4A]">
                  #{drink.boundaryTag}
                </span>
              )}
            </div>
          </div>

          {/* Nutrition Table (Grid Card) */}
          <div className="rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#231915]">
              <Info className="h-4 w-4 stroke-[1.8] text-[#78716C]" />
              전체 영양성분 정보 ({drink.volume}ml 기준)
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div className="rounded-xl border border-[#EFECE6] bg-[#FFFFFF] p-2.5 text-center">
                <span className="text-xs text-[#78716C]">카페인</span>
                <p className={`mt-0.5 text-sm font-semibold ${drink.caffeine >= 150 ? 'text-[#D97757]' : drink.caffeine <= 30 ? 'text-[#5B7A5E]' : 'text-[#231915]'}`}>
                  {drink.caffeine} <span className="text-xs font-normal text-[#78716C]">mg</span>
                </p>
              </div>
              <div className="rounded-xl border border-[#EFECE6] bg-[#FFFFFF] p-2.5 text-center">
                <span className="text-xs text-[#78716C]">당류</span>
                <p className={`mt-0.5 text-sm font-semibold ${drink.sugar <= 5 ? 'text-[#5B7A5E]' : 'text-[#231915]'}`}>
                  {drink.sugar} <span className="text-xs font-normal text-[#78716C]">g</span>
                </p>
              </div>
              <div className="rounded-xl border border-[#EFECE6] bg-[#FFFFFF] p-2.5 text-center">
                <span className="text-xs text-[#78716C]">칼로리</span>
                <p className="mt-0.5 text-sm font-semibold text-[#231915]">
                  {drink.calories} <span className="text-xs font-normal text-[#78716C]">kcal</span>
                </p>
              </div>
              <div className="rounded-xl border border-[#EFECE6] bg-[#FFFFFF] p-2.5 text-center">
                <span className="text-xs text-[#78716C]">단백질</span>
                <p className="mt-0.5 text-sm font-semibold text-[#231915]">
                  {drink.protein} <span className="text-xs font-normal text-[#78716C]">g</span>
                </p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-[#78716C]">
              * 성인 기준 일일 카페인 최대 권장량은 400mg, 당류 권장 섭취량은 50g입니다.
            </p>
          </div>

          {/* Matched Bean Characteristics (자연스러운 문구 교정) */}
          {bean && (
            <div className="rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] p-4">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${beanBrandStyle.badgeBg} ${beanBrandStyle.badgeText}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${beanBrandStyle.dot}`} />
                  {bean.brand}
                </span>
                <span className="text-xs text-[#78716C]">
                  Roast Lv.{bean.roast}
                </span>
              </div>
              <h4 className="mt-1 text-base font-bold tracking-tight text-[#231915]">
                {bean.name}
              </h4>
              <p className="mt-1 text-sm text-[#78716C] leading-relaxed">
                {bean.description}
              </p>

              {/* Dots Rating (로스팅 #C06236, 산미 #5B7A5E, 바디감 #231915 통일) */}
              <div className="mt-3.5 space-y-2 rounded-xl bg-[#FAF8F5] p-3">
                {renderDots(bean.roast, '로스팅 정도 (Roast)', 'bg-[#C06236]')}
                {renderDots(bean.acidity, '산미 (Acidity)', 'bg-[#5B7A5E]')}
                {renderDots(bean.body, '바디감 (Body)', 'bg-[#231915]')}
              </div>

              {/* Tasting Notes Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {bean.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-[#EFECE6] bg-[#FAF8F5] px-2.5 py-0.5 text-xs text-[#78716C]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Today's Consumed Form & Tasting Memo Input Area */}
          <div className="rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-4">
            <div className="flex items-center justify-between">
              <label htmlFor="tasting-memo" className="text-xs font-bold text-[#231915]">
                한 줄 테이스팅 메모
              </label>
              <span className="text-xs text-[#78716C]">
                {memo.length} / 30자
              </span>
            </div>

            <div className="mt-2">
              <input
                id="tasting-memo"
                type="text"
                value={memo}
                onChange={handleMemoChange}
                maxLength={30}
                placeholder="한줄 메모 입력해주세요."
                className="w-full rounded-xl border border-[#EFECE6] bg-[#FFFFFF] px-3.5 py-2.5 text-base sm:text-sm text-[#231915] placeholder:text-[#78716C]/60 focus:border-[#231915] focus:outline-none focus:ring-1 focus:ring-[#231915]"
              />
            </div>

            {/* Inline Error Message */}
            {errorMessage && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#D97757]">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* 타 브랜드 추천 메뉴 (프랜차이즈 간 가성비/영양 비교) */}
          {rivalDrinks.length > 0 && (
            <div className="rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#231915]">
                  타 브랜드 메뉴 비교
                </span>
                <span className="text-[11px] text-[#78716C]">
                  동일 카테고리 추천
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rivalDrinks.map((rival) => {
                  const rivalStyle = BRAND_STYLES[rival.brandId] || {
                    badgeBg: 'bg-[#FFFFFF]',
                    badgeText: 'text-[#78716C]',
                    dot: 'bg-[#78716C]'
                  };
                  return (
                    <div
                      key={rival.id}
                      onClick={() => onSelectDrink && onSelectDrink(rival)}
                      className="group flex cursor-pointer items-center justify-between rounded-xl border border-[#EFECE6] bg-[#FFFFFF] p-2.5 transition-all hover:border-[#78716C]/40 hover:shadow-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[10px] font-semibold ${rivalStyle.badgeBg} ${rivalStyle.badgeText}`}>
                            <span className={`h-1 w-1 rounded-full ${rivalStyle.dot}`} />
                            {rival.brand}
                          </span>
                          <span className="text-[11px] text-[#78716C] font-mono">{rival.caffeine}mg</span>
                        </div>
                        <h5 className="mt-1 text-xs font-bold text-[#231915] truncate group-hover:text-[#D97757] transition-colors">
                          {rival.name}
                        </h5>
                      </div>
                      <span className="text-[11px] font-semibold text-[#78716C] group-hover:text-[#231915] shrink-0">
                        비교 ➔
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Fixed Bottom Footer Action Button & Fade Mask */}
        <div className="relative sticky bottom-0 z-20 border-t border-[#EFECE6] bg-[#FFFFFF] px-4 sm:px-6 pt-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:py-4 shadow-xs">
          {/* Subtle Top Gradient Fade Mask indicating more scrollable content above */}
          <div className="pointer-events-none absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-black/5 to-transparent" />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={Boolean(errorMessage) || isSuccess}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3.5 text-xs sm:text-sm font-semibold transition-all break-keep whitespace-nowrap ${
              isSuccess
                ? 'bg-[#5B7A5E] text-white shadow-sm'
                : 'bg-[#231915] text-[#FAF8F5] hover:bg-[#3D2C24] shadow-xs'
            }`}
          >
            {isSuccess ? (
              <>
                <Check className="h-4 w-4 stroke-[2.5]" />
                담기 완료! 일일 트래커에 반영되었습니다
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                오늘 마신 커피에 담기 (+{drink.caffeine}mg)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
