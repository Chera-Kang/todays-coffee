import React, { useState } from 'react';
import { X, Check, AlertCircle, Info, PlusCircle } from 'lucide-react';
import DrinkThumbnail from './DrinkThumbnail';

export default function DrinkDetailModal({
  drink,
  bean,
  isOpen,
  onClose,
  onAddDrink
}) {
  const [memo, setMemo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !drink) return null;

  // Validation Rule:
  // - Max 30 chars
  // - Cannot be whitespace only (when not empty)
  // - Disallow special characters like !@#$%^&*() etc.
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

    // Disallowed special chars: !@#$%^&*() and symbols
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
    e.preventDefault();
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

  // Render 5-dot rating
  const renderDots = (value, label) => {
    return (
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#78716C]">{label}</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={`h-2 w-2 rounded-full transition-colors ${
                num <= value ? 'bg-[#231915]' : 'bg-[#EFECE6]'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#231915]/60 backdrop-blur-xs sm:items-center sm:p-4">
      {/* Background Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Box (dvh aware) */}
      <div className="relative z-10 flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-[#EFECE6] bg-[#FFFFFF] shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFECE6] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-xs font-semibold text-[#78716C]">
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* Visual Thumbnail + Title & Description */}
          <div className="flex items-start gap-4">
            <DrinkThumbnail drink={drink} size={72} className="shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold tracking-tight text-[#231915] sm:text-2xl leading-tight">
                {drink.name}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[#78716C] sm:text-sm">
                {drink.description}
              </p>
              {drink.boundaryTag && (
                <span className="mt-2 inline-flex items-center rounded-md border border-[#EFECE6] bg-[#FAF8F5] px-2 py-0.5 text-[11px] font-semibold text-[#574E4A]">
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
                <span className="text-[11px] text-[#78716C]">칼로리</span>
                <p className="mt-0.5 font-bold text-[#231915]">
                  {drink.calories} <span className="text-xs font-normal text-[#78716C]">kcal</span>
                </p>
              </div>
              <div className="rounded-xl border border-[#EFECE6] bg-[#FFFFFF] p-2.5 text-center">
                <span className="text-[11px] text-[#78716C]">카페인</span>
                <p className={`mt-0.5 font-bold ${drink.caffeine >= 150 ? 'text-[#D97757]' : drink.caffeine <= 30 ? 'text-[#5B7A5E]' : 'text-[#231915]'}`}>
                  {drink.caffeine} <span className="text-xs font-normal text-[#78716C]">mg</span>
                </p>
              </div>
              <div className="rounded-xl border border-[#EFECE6] bg-[#FFFFFF] p-2.5 text-center">
                <span className="text-[11px] text-[#78716C]">당류</span>
                <p className={`mt-0.5 font-bold ${drink.sugar <= 5 ? 'text-[#5B7A5E]' : 'text-[#231915]'}`}>
                  {drink.sugar} <span className="text-xs font-normal text-[#78716C]">g</span>
                </p>
              </div>
              <div className="rounded-xl border border-[#EFECE6] bg-[#FFFFFF] p-2.5 text-center">
                <span className="text-[11px] text-[#78716C]">단백질</span>
                <p className="mt-0.5 font-bold text-[#231915]">
                  {drink.protein} <span className="text-xs font-normal text-[#78716C]">g</span>
                </p>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-[#78716C]">
              * 성인 기준 일일 카페인 최대 권장량은 400mg, 당류 권장 섭취량은 50g입니다.
            </p>
          </div>

          {/* Matched Bean Characteristics */}
          {bean && (
            <div className="rounded-2xl border border-[#EFECE6] bg-[#FFFFFF] p-4">
              <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
                매칭 원두 프로필
              </span>
              <h4 className="mt-1 text-sm font-bold tracking-tight text-[#231915]">
                {bean.name}
              </h4>
              <p className="mt-1 text-xs text-[#78716C] leading-relaxed">
                {bean.description}
              </p>

              {/* Dots Rating */}
              <div className="mt-3.5 space-y-2 rounded-xl bg-[#FAF8F5] p-3">
                {renderDots(bean.roast, '로스팅 강도 (Roast)')}
                {renderDots(bean.acidity, '산미 (Acidity)')}
                {renderDots(bean.body, '바디감 (Body)')}
              </div>

              {/* Tasting Notes Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {bean.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-[#EFECE6] bg-[#FAF8F5] px-2.5 py-0.5 text-[11px] text-[#78716C]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Today's Consumed Form & Tasting Memo */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-4">
            <div className="flex items-center justify-between">
              <label htmlFor="tasting-memo" className="text-xs font-bold text-[#231915]">
                오늘 마신 음료 담기 & 한 줄 테이스팅 메모
              </label>
              <span className="text-[11px] text-[#78716C]">
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
                placeholder="예: 산뜻하고 달콤해서 오후 리프레시에 제격 (선택 입력)"
                className="w-full rounded-xl border border-[#EFECE6] bg-[#FFFFFF] px-3.5 py-2.5 text-base text-[#231915] placeholder:text-[#78716C]/60 focus:border-[#231915] focus:outline-none focus:ring-1 focus:ring-[#231915]"
              />
            </div>

            {/* Inline Error Message */}
            {errorMessage && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#D97757]">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={Boolean(errorMessage) || isSuccess}
              className={`mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                isSuccess
                  ? 'bg-[#5B7A5E] text-white'
                  : 'bg-[#231915] text-[#FAF8F5] hover:bg-[#3D2C24]'
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
                  오늘 마신 음료에 담기 (+{drink.caffeine}mg)
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
