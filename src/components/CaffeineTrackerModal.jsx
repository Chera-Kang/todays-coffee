import React, { useMemo } from 'react';
import { X, Trash2, AlertTriangle, Coffee, RotateCcw, ShieldCheck, Moon } from 'lucide-react';

export default function CaffeineTrackerModal({
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

  // Uncap percentage: exact calculation without capping at 100%
  const actualPercentage = Math.round((totalCaffeine / maxCaffeine) * 100);
  const barWidth = Math.min(actualPercentage, 100);
  const isOverLimit = totalCaffeine > 400;

  // Sleep Cut-off Guide based on caffeine half-life (5~6 hours)
  const sleepGuide = useMemo(() => {
    if (totalCaffeine === 0) {
      return {
        title: '아직 카페인 섭취 전입니다',
        desc: '상쾌한 하루를 위한 첫 잔을 골라보세요. 밤 11시 취침 기준, 오후 4시 전까지 카페인 음료를 즐기기 좋습니다.'
      };
    }
    if (totalCaffeine <= 150) {
      return {
        title: '가벼운 각성 상태 (숙면 안심)',
        desc: '체내 반감기(약 5~6시간)를 고려할 때, 오후 4시 이전까지는 추가 섭취해도 밤 11시 숙면에 무리가 없습니다.'
      };
    }
    if (totalCaffeine <= 350) {
      return {
        title: '적정 활력 충전 완료',
        desc: '현재 체내에 충분한 카페인이 작용 중입니다. 추가 커피는 디카페인이나 허브티를 선택하시면 편안한 밤을 보낼 수 있어요.'
      };
    }
    return {
      title: '카페인 상한선 도달 / 초과 주의',
      desc: '카페인 대사 분해에 7시간 이상 소요될 수 있습니다. 오늘 추가 카페인 섭취는 쉬어가고 미온수를 충분히 섭취해 주세요.'
    };
  }, [totalCaffeine]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#231915]/60 backdrop-blur-xs">
      {/* Background Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Centered Modal Box (화면 중앙 & dvh aware) */}
      <div className="relative z-10 flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#EFECE6] bg-[#FFFFFF] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFECE6] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#231915] text-[#FAF8F5]">
              <Coffee className="h-4 w-4 stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-[#231915]">
                오늘 마신 음료 기록
              </h2>
              <p className="text-[11px] text-[#78716C]">
                총 {consumedList.length}잔 기록됨 (일일 권장량 400mg)
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-4">
          {/* Caffeine Consumption Gauge Box */}
          <div className="rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-5 space-y-3.5">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold text-[#78716C]">
                  총 카페인 섭취량
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-2xl font-extrabold tracking-tight ${
                      isOverLimit ? 'text-[#D97757]' : 'text-[#231915]'
                    }`}
                  >
                    {totalCaffeine}
                  </span>
                  <span className="text-xs text-[#78716C]">/ 400 mg</span>
                </div>
              </div>

              {/* Progress Gauge Bar */}
              <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#EFECE6]">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverLimit ? 'bg-[#D97757]' : 'bg-[#231915]'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Percentage Output (Uncapped) */}
              <div className="mt-1.5 flex justify-between text-xs font-semibold">
                <span className={isOverLimit ? 'text-[#D97757]' : 'text-[#78716C]'}>
                  권장량 대비 <strong className="text-sm font-bold">{actualPercentage}%</strong>
                  {isOverLimit && ' (초과)'}
                </span>
                <span className="text-[#78716C] text-[11px] font-normal">
                  일일 상한 400mg
                </span>
              </div>
            </div>

            {/* Over-Limit Warning Box */}
            {isOverLimit && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#D97757]/30 bg-[#FFF5F2] p-3 text-xs text-[#D97757]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-bold">일일 권장량 초과 (+{totalCaffeine - 400}mg 초과)</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-[#D97757]/90">
                    성인 일일 최대 카페인 권장량(400mg)을 초과했습니다. 물을 충분히 섭취하시거나 디카페인 음료를 권장합니다.
                  </p>
                </div>
              </div>
            )}

            {/* Sub Nutrients Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="rounded-xl bg-[#FFFFFF] p-2.5 text-center border border-[#EFECE6]">
                <span className="text-[11px] text-[#78716C]">합산 칼로리</span>
                <p className="font-bold text-[#231915] mt-0.5">{totalCalories} kcal</p>
              </div>
              <div className="rounded-xl bg-[#FFFFFF] p-2.5 text-center border border-[#EFECE6]">
                <span className="text-[11px] text-[#78716C]">합산 당류</span>
                <p className="font-bold text-[#231915] mt-0.5">{totalSugar} g</p>
              </div>
            </div>
          </div>

          {/* Sleep Cut-off Guide Card */}
          <div className="flex items-start gap-3 rounded-2xl border border-[#EFECE6] bg-[#FAF8F5] p-3.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#231915] text-[#FAF8F5]">
              <Moon className="h-3.5 w-3.5 text-[#D97757]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                  숙면 안심 가이드 (반감기 5~6h)
                </span>
              </div>
              <p className="mt-0.5 text-xs font-bold text-[#231915]">{sleepGuide.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#78716C] break-keep">
                {sleepGuide.desc}
              </p>
            </div>
          </div>

          {/* Consumed Items List */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-[#231915]">
              마신 음료 목록 ({consumedList.length})
            </span>

            {consumedList.length === 0 ? (
              <div className="flex h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-[#EFECE6] bg-[#FAF8F5] text-center text-[#78716C]">
                <Coffee className="h-8 w-8 stroke-[1.2] opacity-40" />
                <p className="mt-2 text-xs font-medium">오늘 아직 기록된 음료가 없습니다.</p>
                <p className="mt-0.5 text-[11px] text-[#78716C]/70">
                  음료 카드를 눌러 '오늘 마신 음료에 담기'를 해보세요.
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
                        <span className="rounded-md bg-[#FAF8F5] px-1.5 py-0.5 text-[10px] font-semibold text-[#78716C]">
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

                  {/* Tasting Memo */}
                  {item.memo && (
                    <div className="mt-2 rounded-lg bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#231915]">
                      <span className="text-[10px] font-semibold text-[#78716C] mr-1.5">메모:</span>
                      {item.memo}
                    </div>
                  )}

                  {/* Nutrients Chips */}
                  <div className="mt-2.5 flex items-center gap-3 border-t border-[#EFECE6]/60 pt-2 text-[11px] text-[#78716C]">
                    <span>카페인 <strong className="text-[#231915]">{item.caffeine}mg</strong></span>
                    <span>칼로리 <strong className="text-[#231915]">{item.calories}kcal</strong></span>
                    <span>당류 <strong className="text-[#231915]">{item.sugar}g</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
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
