import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Stamp } from 'lucide-react';
import type { DailyRecord } from '../types';
import {
  calculateStreaks,
  countCompletedSentences,
  formatKoreanDate,
  getTodayKey,
} from '../utils/storage';

interface HabitCalendarProps {
  records: Record<string, DailyRecord>;
  onSelectArchiveDate: (dateKey: string) => void;
}

function toDateKey(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function HabitCalendar({ records, onSelectArchiveDate }: HabitCalendarProps) {
  const stats = useMemo(() => calculateStreaks(records), [records]);
  const todayKey = getTodayKey();
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    stamped: boolean;
  } | null>(null);

  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // 16 weeks (112 days) contribution grid ending today
  const heatmapWeeks = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun..6=Sat
    const totalDays = 16 * 7;
    const endSaturdayOffset = 6 - dayOfWeek;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + endSaturdayOffset);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);

    const weeks: Array<Array<{ dateKey: string; isFuture: boolean; count: number; stamped: boolean }>> = [];
    const cursor = new Date(startDate);

    for (let w = 0; w < 16; w++) {
      const week: Array<{ dateKey: string; isFuture: boolean; count: number; stamped: boolean }> = [];
      for (let d = 0; d < 7; d++) {
        const key = toDateKey(cursor);
        const rec = records[key];
        const count = countCompletedSentences(rec);
        const stamped = Boolean(rec?.isStamped || (rec && rec.sentences.length > 0 && count >= rec.sentences.length));
        const isFuture = key > todayKey;
        week.push({ dateKey: key, isFuture, count, stamped });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, [records, todayKey]);

  const monthCells = useMemo(() => {
    const firstDay = new Date(viewMonth.year, viewMonth.month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(viewMonth.year, viewMonth.month + 1, 0).getDate();

    const cells: Array<{ day: number | null; dateKey?: string }> = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(viewMonth.year, viewMonth.month, d);
      cells.push({ day: d, dateKey: toDateKey(dt) });
    }
    return cells;
  }, [viewMonth]);

  const shiftMonth = (delta: number) => {
    setViewMonth((prev) => {
      const dt = new Date(prev.year, prev.month + delta, 1);
      return { year: dt.getFullYear(), month: dt.getMonth() };
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="pb-6 border-b border-[#E4DFD3] dark:border-[#2E2A25] space-y-2">
        <div className="text-xs text-[#666158] dark:text-[#A8A196]">
          매일의 기록이 만드는 언어 근육
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
          습관 캘린더 & 잔디 심기
        </h1>
        <p className="text-sm text-[#666158] dark:text-[#A8A196]">
          하루 5~7문장의 꾸준한 필사가 쌓여 짙은 잉크빛 기록으로 남습니다.
        </p>
      </section>

      {/* 4-Column KPI Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '현재 연속 필사', value: `${stats.currentStreak}일`, note: '오늘 또는 어제 기준 연속' },
          { label: '최장 연속 기록', value: `${stats.bestStreak}일`, note: `누적 출석 ${stats.totalStampedDays}일` },
          { label: '누적 완료 문장', value: `${stats.totalSentencesDone}문장`, note: '영어·한국어 필사 합계' },
          {
            label: '평균 영어 정확도',
            value: stats.averageAccuracy > 0 ? `${stats.averageAccuracy}%` : '—',
            note: '타이핑 기준 평균치',
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl p-5 space-y-1.5"
          >
            <div className="text-xs text-[#666158] dark:text-[#A8A196]">{kpi.label}</div>
            <div className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
              {kpi.value}
            </div>
            <div className="text-xs text-[#857E73] dark:text-[#7D766B]">{kpi.note}</div>
          </div>
        ))}
      </section>

      {/* Contribution Heatmap (잔디 심기) */}
      <section className="bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-lg font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
              최근 16주 잉크 잔디 기록
            </h2>
            <p className="text-xs text-[#666158] dark:text-[#A8A196] mt-0.5">
              {hoveredCell
                ? `${formatKoreanDate(hoveredCell.date)} · 완료 ${hoveredCell.count}문장${
                    hoveredCell.stamped ? ' · 출석 도장 완료' : ''
                  }`
                : '각 칸에 마우스를 올리면 해당 날짜의 필사량을 확인할 수 있습니다.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#666158] dark:text-[#A8A196]">
            <span>적음</span>
            <span className="w-3 h-3 rounded-[3px] bg-[#F1EDE4] dark:bg-[#25221E] border border-[#E4DFD3] dark:border-[#342F29]" />
            <span className="w-3 h-3 rounded-[3px] bg-[#B8CBE0] dark:bg-[#2A425E]" />
            <span className="w-3 h-3 rounded-[3px] bg-[#6488B4] dark:bg-[#496F9B]" />
            <span className="w-3 h-3 rounded-[3px] bg-[#1E3A5F] dark:bg-[#7FA6D6]" />
            <span>많음</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1.5 min-w-max">
            <div className="grid grid-rows-7 gap-1.5 pr-2 text-[11px] font-mono-tabular text-[#857E73] dark:text-[#7D766B]">
              <span>일</span>
              <span>월</span>
              <span>화</span>
              <span>수</span>
              <span>목</span>
              <span>금</span>
              <span>토</span>
            </div>
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-rows-7 gap-1.5">
                {week.map((cell) => {
                  if (cell.isFuture) {
                    return <div key={cell.dateKey} className="w-4 h-4 rounded-[4px] opacity-0" />;
                  }
                  const levelClass =
                    cell.count === 0 && !cell.stamped
                      ? 'bg-[#F1EDE4] dark:bg-[#25221E] border border-[#E4DFD3] dark:border-[#342F29]'
                      : cell.stamped || cell.count >= 5
                        ? 'bg-[#1E3A5F] dark:bg-[#7FA6D6]'
                        : cell.count >= 3
                          ? 'bg-[#6488B4] dark:bg-[#496F9B]'
                          : 'bg-[#B8CBE0] dark:bg-[#2A425E]';

                  return (
                    <button
                      key={cell.dateKey}
                      type="button"
                      onMouseEnter={() =>
                        setHoveredCell({
                          date: cell.dateKey,
                          count: cell.count,
                          stamped: cell.stamped,
                        })
                      }
                      onFocus={() =>
                        setHoveredCell({
                          date: cell.dateKey,
                          count: cell.count,
                          stamped: cell.stamped,
                        })
                      }
                      onClick={() => {
                        if (records[cell.dateKey]) {
                          onSelectArchiveDate(cell.dateKey);
                        }
                      }}
                      aria-label={`${cell.dateKey}: ${cell.count}문장 완료`}
                      className={`w-4 h-4 rounded-[4px] transition-transform hover:scale-110 ${levelClass} ${
                        cell.dateKey === todayKey ? 'ring-1 ring-[#B45309] dark:ring-[#FBBF24] ring-offset-1 ring-offset-white dark:ring-offset-[#1C1A17]' : ''
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Stamp Calendar */}
      <section className="bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-editorial text-lg font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
            {viewMonth.year}년 {viewMonth.month + 1}월 필사 도장판
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="이전 달"
              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[#D8D1C3] dark:border-[#38332C] text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#24211D]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="다음 달"
              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[#D8D1C3] dark:border-[#38332C] text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#24211D]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[#666158] dark:text-[#A8A196]">
          {['일', '월', '화', '수', '목', '금', '토'].map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {monthCells.map((cell, idx) => {
            if (!cell.day || !cell.dateKey) {
              return <div key={`empty-${idx}`} className="h-16 sm:h-20" />;
            }

            const rec = records[cell.dateKey];
            const done = countCompletedSentences(rec);
            const isStamped = Boolean(
              rec?.isStamped || (rec && rec.sentences.length > 0 && done >= rec.sentences.length),
            );
            const isToday = cell.dateKey === todayKey;
            const hasAnyProgress = done > 0 || isStamped;

            return (
              <button
                key={cell.dateKey}
                type="button"
                disabled={!hasAnyProgress}
                onClick={() => hasAnyProgress && onSelectArchiveDate(cell.dateKey!)}
                className={`h-16 sm:h-20 p-2 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                  isStamped
                    ? 'border-[#1E3A5F]/45 dark:border-[#7FA6D6]/50 bg-[#1E3A5F]/5 dark:bg-[#7FA6D6]/10 hover:bg-[#1E3A5F]/10'
                    : isToday
                      ? 'border-[#B45309]/50 dark:border-[#FBBF24]/50 bg-[#FCFBF7] dark:bg-[#151412]'
                      : 'border-[#ECE7DC] dark:border-[#2A2621] bg-[#FCFBF7] dark:bg-[#151412]'
                } ${!hasAnyProgress ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span
                  className={`text-xs font-mono-tabular ${
                    isToday
                      ? 'font-bold text-[#B45309] dark:text-[#FBBF24]'
                      : 'text-[#666158] dark:text-[#A8A196]'
                  }`}
                >
                  {cell.day}
                </span>

                <div className="flex items-center justify-between gap-1">
                  {isStamped ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E3A5F] dark:text-[#93C5FD]">
                      <Stamp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span className="hidden sm:inline">완료</span>
                    </span>
                  ) : done > 0 ? (
                    <span className="text-[11px] font-mono-tabular text-[#666158] dark:text-[#A8A196]">
                      {done}문장
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
