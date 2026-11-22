import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  List,
  Printer,
  Sparkles,
  Stamp,
} from 'lucide-react';
import type { DailyRecord, SentenceProgress, ViewLayout } from '../types';
import { countCompletedSentences, createEmptyProgress, formatKoreanDate, isSentenceDone } from '../utils/storage';
import { SentenceCard } from './SentenceCard';

interface DailyWorkspaceProps {
  record: DailyRecord;
  sourceSummary: string;
  onUpdateSentenceProgress: (sentenceId: string, patch: Partial<SentenceProgress>) => void;
  onSaveReflection: (favoriteSentenceId: string | undefined, reflection: string) => void;
  onOpenPrint: () => void;
  onGoToExtract: () => void;
}

export function DailyWorkspace({
  record,
  sourceSummary,
  onUpdateSentenceProgress,
  onSaveReflection,
  onOpenPrint,
  onGoToExtract,
}: DailyWorkspaceProps) {
  const [layout, setLayout] = useState<ViewLayout>('step');
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<string | undefined>(
    record.favoriteSentenceId || record.sentences[0]?.id,
  );
  const [reflectionInput, setReflectionInput] = useState(record.reflection || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const safeIndex = Math.min(activeIndex, Math.max(0, record.sentences.length - 1));
  const currentSentence = record.sentences[safeIndex];
  const completedCount = countCompletedSentences(record);
  const totalCount = record.sentences.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  const handleReflectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection(selectedFavoriteId, reflectionInput.trim());
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Study Set Header & Mode Toolbar */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-[#E4DFD3] dark:border-[#2E2A25]">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#666158] dark:text-[#A8A196]">
            <span>{formatKoreanDate(record.date)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              완료 {completedCount}/{totalCount}문장
            </span>
            {record.sourceUrl && (
              <>
                <span aria-hidden="true">·</span>
                <a
                  href={record.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#1E3A5F] dark:text-[#93C5FD] hover:underline"
                >
                  원본 영상 보기
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </>
            )}
          </div>

          <h1 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#1E1D1B] dark:text-[#F0ECE1] text-balance">
            {record.studySetTitle}
          </h1>

          <p className="text-sm sm:text-[15px] text-[#666158] dark:text-[#A8A196] leading-relaxed">
            {sourceSummary}
          </p>
        </div>

        {/* Workspace Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div
            className="inline-flex items-center p-1 rounded-lg bg-[#EFEAE0] dark:bg-[#221F1B] border border-[#E4DFD3] dark:border-[#342F29]"
            role="group"
            aria-label="필사 보기 방식"
          >
            <button
              type="button"
              onClick={() => setLayout('step')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                layout === 'step'
                  ? 'bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] shadow-xs'
                  : 'text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              한 문장씩 집중
            </button>
            <button
              type="button"
              onClick={() => setLayout('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                layout === 'list'
                  ? 'bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] shadow-xs'
                  : 'text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              전체 한눈에
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#24211D] transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5 text-[#1E3A5F] dark:text-[#7FA6D6]" aria-hidden="true" />
            손글씨 인쇄 뷰
          </button>

          <button
            type="button"
            onClick={onGoToExtract}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#1E3A5F] dark:bg-[#7FA6D6] text-white dark:text-[#141311] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            다른 영상 추출
          </button>
        </div>
      </section>

      {/* Main Typing Workspace */}
      {layout === 'step' && currentSentence ? (
        <div className="space-y-5">
          {/* Stepper navigation bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="문장 번호 선택">
              {record.sentences.map((s, idx) => {
                const done = isSentenceDone(record.progressBySentenceId[s.id]);
                const active = idx === safeIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-9 min-w-[38px] px-2.5 inline-flex items-center justify-center gap-1 rounded-lg text-xs font-mono-tabular font-medium border transition-colors ${
                      active
                        ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white dark:bg-[#7FA6D6] dark:border-[#7FA6D6] dark:text-[#141311]'
                        : done
                          ? 'bg-[#1E3A5F]/10 border-[#1E3A5F]/30 text-[#1E3A5F] dark:bg-[#7FA6D6]/15 dark:border-[#7FA6D6]/30 dark:text-[#93C5FD]'
                          : 'bg-white dark:bg-[#1C1A17] border-[#E4DFD3] dark:border-[#2E2A25] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
                    }`}
                  >
                    {done && <Check className="w-3 h-3" aria-hidden="true" />}
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safeIndex === 0}
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3EFE6] dark:hover:bg-[#24211D] transition-colors whitespace-nowrap shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                이전 문장
              </button>
              <button
                type="button"
                disabled={safeIndex >= record.sentences.length - 1}
                onClick={() => setActiveIndex((i) => Math.min(record.sentences.length - 1, i + 1))}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3EFE6] dark:hover:bg-[#24211D] transition-colors whitespace-nowrap shrink-0"
              >
                다음 문장
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <SentenceCard
            sentence={currentSentence}
            index={safeIndex}
            total={record.sentences.length}
            progress={
              record.progressBySentenceId[currentSentence.id] ||
              createEmptyProgress(currentSentence.id)
            }
            onUpdateProgress={(patch) => onUpdateSentenceProgress(currentSentence.id, patch)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {record.sentences.map((s, idx) => (
            <SentenceCard
              key={s.id}
              sentence={s}
              index={idx}
              total={record.sentences.length}
              progress={record.progressBySentenceId[s.id] || createEmptyProgress(s.id)}
              onUpdateProgress={(patch) => onUpdateSentenceProgress(s.id, patch)}
            />
          ))}
        </div>
      )}

      {/* One-line Reflection & Daily Stamp Card */}
      <section className="bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#ECE7DC] dark:border-[#2C2823]">
          <div>
            <h2 className="font-editorial text-xl font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
              오늘의 필사 회고
            </h2>
            <p className="text-sm text-[#666158] dark:text-[#A8A196] mt-1">
              {allDone
                ? '오늘의 모든 문장을 필사했습니다. 가장 마음에 남은 한 문장과 짧은 소감을 남기고 도장을 찍어 보세요.'
                : `현재 ${completedCount}/${totalCount}문장을 완료했습니다. 마음에 남은 문장을 골라 오늘의 기록을 남겨 보세요.`}
            </p>
          </div>
          {record.isStamped && (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E3A5F] dark:text-[#93C5FD]">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              오늘의 출석 도장 완료
            </div>
          )}
        </div>

        <form onSubmit={handleReflectionSubmit} className="pt-6 space-y-6">
          <div>
            <div className="text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-3">
              오늘 가장 마음에 와닿은 문장 1개 선택
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {record.sentences.map((s, idx) => {
                const isSelected = selectedFavoriteId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedFavoriteId(s.id)}
                    className={`text-left p-3.5 rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-[#1E3A5F] dark:border-[#7FA6D6] bg-[#1E3A5F]/5 dark:bg-[#7FA6D6]/10'
                        : 'border-[#E4DFD3] dark:border-[#2E2A25] bg-[#FCFBF7] dark:bg-[#151412] hover:border-[#C5BDB0] dark:hover:border-[#433D35]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-[#666158] dark:text-[#A8A196] mb-1">
                      <span className="font-mono-tabular">문장 {String(idx + 1).padStart(2, '0')}</span>
                      {isSelected && (
                        <span className="text-[#1E3A5F] dark:text-[#93C5FD] font-medium">
                          선택됨
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-[#1E1D1B] dark:text-[#F0ECE1] line-clamp-2">
                      {s.english}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="daily-reflection-input"
              className="block text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-2"
            >
              오늘의 한 줄 소감
            </label>
            <textarea
              id="daily-reflection-input"
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              rows={2}
              placeholder="오늘 필사하면서 새롭게 와닿은 표현이나 다짐을 한 줄로 남겨 보세요..."
              className="w-full rounded-xl border border-[#D8D1C3] dark:border-[#38332C] bg-[#FCFBF7] dark:bg-[#151412] px-4 py-3 text-sm sm:text-base text-[#1E1D1B] dark:text-[#F0ECE1] placeholder:text-[#9D968A] dark:placeholder:text-[#666057] focus:outline-none focus:border-[#1E3A5F] dark:focus:border-[#7FA6D6] transition-colors resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#666158] dark:text-[#A8A196]">
              {savedNotice ? (
                <span className="text-[#1E3A5F] dark:text-[#93C5FD] font-medium">
                  오늘의 필사 기록과 습관 도장이 아카이브에 저장되었습니다.
                </span>
              ) : (
                <span>저장 시 나의 필사 노트와 습관 캘린더에 자동 반영됩니다.</span>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E3A5F] dark:bg-[#7FA6D6] text-white dark:text-[#141311] text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              <Stamp className="w-4 h-4" aria-hidden="true" />
              {record.isStamped ? '회고 수정 및 다시 저장' : '오늘의 필사 완료 & 도장 찍기'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
