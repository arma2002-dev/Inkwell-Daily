import { CalendarDays, Feather, Flame, Moon, NotebookPen, Printer, Sun } from 'lucide-react';
import type { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentStreak: number;
  completedCount: number;
  totalCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenPrint: () => void;
}

const NAV_ITEMS: Array<{ id: ActiveTab; label: string; icon: typeof Feather }> = [
  { id: 'today', label: '오늘의 필사', icon: Feather },
  { id: 'archive', label: '나의 필사 노트', icon: NotebookPen },
  { id: 'calendar', label: '습관 캘린더', icon: CalendarDays },
];

export function Header({
  activeTab,
  onTabChange,
  currentStreak,
  completedCount,
  totalCount,
  theme,
  onToggleTheme,
  onOpenPrint,
}: HeaderProps) {
  const progressPct = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;

  return (
    <header className="no-print sticky top-0 z-30 bg-[#F9F7F2]/95 dark:bg-[#141311]/95 backdrop-blur-sm border-b border-[#E4DFD3] dark:border-[#2E2A25]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          type="button"
          onClick={() => onTabChange('today')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] rounded-md px-1 py-0.5"
        >
          <Feather className="w-5 h-5 text-[#1E3A5F] dark:text-[#7FA6D6]" aria-hidden="true" />
          <span className="font-editorial text-xl font-semibold tracking-tight text-[#1E1D1B] dark:text-[#F0ECE1]">
            Inkwell
          </span>
        </button>

        {/* Zone 2: Desktop single-line navigation links */}
        <nav aria-label="주 메뉴" className="hidden md:flex items-center gap-7 h-full">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`relative h-full inline-flex items-center text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] ${
                  isActive
                    ? 'text-[#1E3A5F] dark:text-[#93C5FD]'
                    : 'text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1E3A5F] dark:bg-[#7FA6D6]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Streak, progress & utility actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div
            className="hidden sm:flex items-center gap-2 text-xs text-[#666158] dark:text-[#A8A196] font-mono-tabular whitespace-nowrap shrink-0"
            title="연속 필사 일수 및 오늘 진행률"
          >
            <span className="inline-flex items-center gap-1 font-medium text-[#B45309] dark:text-[#FBBF24]">
              <Flame className="w-3.5 h-3.5" aria-hidden="true" />
              {currentStreak}일째
            </span>
            <span aria-hidden="true">·</span>
            <span>
              오늘 {completedCount}/{totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#24211D] transition-colors duration-150 whitespace-nowrap shrink-0"
            title="손글씨 / 노트 인쇄 시트 보기"
          >
            <Printer className="w-3.5 h-3.5 text-[#1E3A5F] dark:text-[#7FA6D6]" aria-hidden="true" />
            <span className="hidden sm:inline">인쇄 시트</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#1C1A17] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#24211D] transition-colors duration-150 shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation strip */}
      <nav
        aria-label="모바일 주 메뉴"
        className="md:hidden flex items-center justify-between gap-1 px-3 py-1.5 border-t border-[#ECE7DC] dark:border-[#26231F] overflow-x-auto"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#1E3A5F] text-white dark:bg-[#7FA6D6] dark:text-[#141311]'
                  : 'text-[#666158] dark:text-[#A8A196]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Hairline progress bar */}
      <div className="h-[2px] w-full bg-[#ECE7DC] dark:bg-[#26231F]" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-[#1E3A5F] dark:bg-[#7FA6D6] transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </header>
  );
}
