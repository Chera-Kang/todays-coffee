import React from 'react';
import { X, Trash2, AlertTriangle, Coffee, RotateCcw } from 'lucide-react';

export default function CaffeineTrackerDrawer({
  isOpen,
  onClose,
  consumedList,
  onRemoveItem,
  onClearAll
}) {
  if (!isOpen) return null;

  const totalCaffeine = consumedList.reduce((acc, cur) => acc + (cur.caffeine || 0), 0);
  const totalCalories = consumedList.reduce((acc, cur) => acc + (cur.calories || 0), 0);
  const totalSugar = consumedList.reduce((acc, cur) => acc + (cur.sugar || 0), 0);
  const maxCaffeine = 400;
  const isOverLimit = totalCaffeine > 400;
  const percentage = Math.min(Math.round((totalCaffeine / maxCaffeine) * 100), 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#231915]/50 backdrop-blur-xs">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container (Right side on desktop, bottom sheet on mobile) */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FFFFFF] shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFECE6] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#231915] text-[#FAF8F5]">
              <Coffee className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-[#231915]">
                오늘 마신 음료 기록
              </h2>
              <p className="text-[11px] text-[#78716C]">
                총 {consumedList.length}잔 기록됨
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#78716C] transition-colors hover:bg-[#FAF8F5] hover:text-[#231915]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Total Summary & Overlimit Alert */}
        <div className="border-b border-[#EFECE6] bg-[#FAF8F5] p-6 space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-[#78716C]">
                총 카페인 섭취량
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-extrabold ${
                    isOverLimit ? 'text-[#D97757]' : 'text-[#231915]'
                  }`}
                >
                  {totalCaffeine}
                </span>
                <span className="text-xs text-[#78716C]">/ 400 mg</span>
              </div>
            </div>

            {/* Gauge Bar */}
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#EFECE6]">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverLimit ? 'bg-[#D97757]' : 'bg-[#231915]'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-[#78716C]">
              <span>권장량 대비 {percentage}%</span>
              <span>최대 400mg</span>
            </div>
          </div>

          {/* Over-Limit Warning Badge Box */}
          {isOverLimit && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#D97757]/30 bg-[#FFF5F2] p-3 text-xs text-[#D97757]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-bold">일일 권장량 초과 ({totalCaffeine - 400}mg 초과)</p>
                <p className="mt-0.5 text-[11px] leading-tight text-[#D97757]/90">
                  성인 일일 최대 카페인 권장량(400mg)을 초과했습니다. 물을 충분히 섭취하시거나 디카페인 음료를 추천합니다.
                </p>
              </div>
            </div>
          )}

          {/* Sub Totals */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-[#FFFFFF] p-2.5 text-center border border-[#EFECE6]">
              <span className="text-[11px] text-[#78716C]">합산 칼로리</span>
              <p className="font-bold text-[#231915]">{totalCalories} kcal</p>
            </div>
            <div className="rounded-lg bg-[#FFFFFF] p-2.5 text-center border border-[#EFECE6]">
              <span className="text-[11px] text-[#78716C]">합산 당류</span>
              <p className="font-bold text-[#231915]">{totalSugar} g</p>
            </div>
          </div>
        </div>

        {/* Consumed Coffee List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {consumedList.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center text-[#78716C]">
              <Coffee className="h-10 w-10 stroke-[1.2] opacity-40" />
              <p className="mt-3 text-sm font-medium">오늘 아직 기록된 커피가 없습니다.</p>
              <p className="mt-1 text-xs text-[#78716C]/80">
                음료 카드를 눌러 '오늘 마신 커피에 담기'를 시도해 보세요.
              </p>
            </div>
          ) : (
            consumedList.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl border border-[#EFECE6] bg-[#FFFFFF] p-3.5 shadow-xs transition-all hover:border-[#78716C]/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-[#FAF8F5] px-1.5 py-0.5 text-[10px] font-medium text-[#78716C]">
                        {item.brand}
                      </span>
                      <span className="text-[10px] text-[#78716C]">
                        {item.consumedAt}
                      </span>
                    </div>
                    <h4 className="mt-1 text-sm font-bold tracking-tight text-[#231915]">
                      {item.name}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    title="기록 삭제"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#78716C] transition-colors hover:bg-[#FFF5F2] hover:text-[#D97757]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Memo */}
                {item.memo && (
                  <div className="mt-2 rounded-lg bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#231915]">
                    <span className="text-[10px] font-semibold text-[#78716C] mr-1.5">메모:</span>
                    {item.memo}
                  </div>
                )}

                {/* Nutritional Chips */}
                <div className="mt-2.5 flex items-center gap-3 border-t border-[#EFECE6]/60 pt-2 text-[11px] text-[#78716C]">
                  <span>카페인 <strong className="text-[#231915]">{item.caffeine}mg</strong></span>
                  <span>칼로리 <strong className="text-[#231915]">{item.calories}kcal</strong></span>
                  <span>당류 <strong className="text-[#231915]">{item.sugar}g</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {consumedList.length > 0 && (
          <div className="border-t border-[#EFECE6] bg-[#FAF8F5] p-4">
            <button
              type="button"
              onClick={onClearAll}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#EFECE6] bg-[#FFFFFF] py-2.5 text-xs font-semibold text-[#78716C] transition-colors hover:bg-[#FFF5F2] hover:text-[#D97757]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              오늘의 기록 전체 비우기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
