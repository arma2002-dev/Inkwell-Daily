import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileText,
  NotebookPen,
  Search,
} from 'lucide-react';
import type { DailyRecord } from '../types';
import {
  buildMarkdownExport,
  buildTextExport,
  countCompletedSentences,
  formatKoreanDate,
  triggerFileDownload,
} from '../utils/storage';

interface NotebookArchiveProps {
  records: Record<string, DailyRecord>;
  initialSelectedDate?: string | null;
}

type ArchiveFilter = 'all' | 'stamped' | 'reflected';

export function NotebookArchive({ records, initialSelectedDate }: NotebookArchiveProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ArchiveFilter>('all');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(() =>
    initialSelectedDate ? { [initialSelectedDate]: true } : {},
  );

  const sortedRecords = useMemo(() => {
    return Object.values(records)
      .filter((rec) => {
        const hasActivity =
          rec.isStamped ||
          rec.reflection.trim().length > 0 ||
          Object.values(rec.progressBySentenceId).some(
            (p) =>
              p.englishInput.trim().length > 0 ||
              p.koreanInput.trim().length > 0 ||
              p.handwrittenCompleted,
          );
        return hasActivity;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [records]);

  const filteredRecords = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedRecords.filter((rec) => {
      if (filter === 'stamped' && !rec.isStamped) return false;
      if (filter === 'reflected' && !rec.reflection.trim()) return false;
      if (!q) return true;

      const haystack = [
        rec.studySetTitle,
        rec.reflection,
        rec.date,
        ...rec.sentences.flatMap((s) => [
          s.english,
          s.korean,
          rec.progressBySentenceId[s.id]?.koreanInput || '',
          ...s.vocabulary.map((v) => `${v.word} ${v.meaning}`),
        ]),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [sortedRecords, query, filter]);

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const handleExportAllMarkdown = () => {
    if (filteredRecords.length === 0) return;
    const md = buildMarkdownExport(filteredRecords);
    triggerFileDownload('inkwell-notebook-archive.md', md, 'text/markdown;charset=utf-8');
  };

  const handleExportAllText = () => {
    if (filteredRecords.length === 0) return;
    const txt = buildTextExport(filteredRecords);
    triggerFileDownload('inkwell-notebook-archive.txt', txt, 'text/plain;charset=utf-8');
  };

  return (
    <div className="space-y-8">
      {/* Header & Export Toolbar */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-[#E4DFD3] dark:border-[#2E2A25]">
        <div className="space-y-2">
          <div className="text-xs text-[#666158] dark:text-[#A8A196]">
            날짜별 영한 필사 아카이브
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
            나의 필사 노트북
          </h1>
          <p className="text-sm text-[#666158] dark:text-[#A8A196]">
            내가 직접 옮겨 적은 영어·한국어 문장과 오늘의 한 줄 회고를 검색하고 파일로 소장할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled={filteredRecords.length === 0}
            onClick={handleExportAllMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#24211D] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[#1E3A5F] dark:text-[#7FA6D6]" aria-hidden="true" />
            마크다운(.md) 내보내기
          </button>
          <button
            type="button"
            disabled={filteredRecords.length === 0}
            onClick={handleExportAllText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#24211D] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-[#1E3A5F] dark:text-[#7FA6D6]" aria-hidden="true" />
            텍스트(.txt) 내보내기
          </button>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[#857E73] dark:text-[#7D766B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="영어 문장, 한국어 번역, 어휘, 회고 검색..."
            className="w-full rounded-xl border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#1C1A17] pl-10 pr-4 py-2 text-sm text-[#1E1D1B] dark:text-[#F0ECE1] placeholder:text-[#9D968A] dark:placeholder:text-[#666057] focus:outline-none focus:border-[#1E3A5F] dark:focus:border-[#7FA6D6]"
          />
        </div>

        <div
          className="inline-flex items-center p-1 rounded-lg bg-[#EFEAE0] dark:bg-[#221F1B] border border-[#E4DFD3] dark:border-[#342F29]"
          role="group"
          aria-label="노트 필터"
        >
          {(
            [
              { id: 'all', label: '전체 기록' },
              { id: 'stamped', label: '도장 완료' },
              { id: 'reflected', label: '회고 작성됨' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filter === f.id
                  ? 'bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] shadow-xs'
                  : 'text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl p-10 text-center space-y-3">
          <NotebookPen className="w-8 h-8 mx-auto text-[#857E73] dark:text-[#7D766B]" aria-hidden="true" />
          <h2 className="font-editorial text-lg font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
            아직 기록된 필사 노트가 없습니다
          </h2>
          <p className="text-sm text-[#666158] dark:text-[#A8A196] max-w-md mx-auto">
            [오늘의 필사] 탭에서 문장을 따라 쓰거나 회고를 저장하면 날짜별로 차곡차곡 이곳에 쌓입니다.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredRecords.map((rec) => {
            const doneCount = countCompletedSentences(rec);
            const favSentence = rec.sentences.find((s) => s.id === rec.favoriteSentenceId);
            const isExpanded = Boolean(expandedDates[rec.date]);

            return (
              <article
                key={rec.date}
                className="bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl p-6 sm:p-7 space-y-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#666158] dark:text-[#A8A196] font-mono-tabular">
                      <span className="font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
                        {formatKoreanDate(rec.date)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        완료 {doneCount}/{rec.sentences.length}문장
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{rec.isStamped ? '출석 도장 완료' : '작성 중'}</span>
                      {rec.sourceUrl && (
                        <>
                          <span aria-hidden="true">·</span>
                          <a
                            href={rec.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#1E3A5F] dark:text-[#93C5FD] hover:underline"
                          >
                            원본 영상
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        </>
                      )}
                    </div>
                    <h2 className="font-editorial text-xl font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
                      {rec.studySetTitle}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        triggerFileDownload(
                          `inkwell-${rec.date}.md`,
                          buildMarkdownExport([rec]),
                          'text/markdown;charset=utf-8',
                        )
                      }
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#E4DFD3] dark:border-[#342F29] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1] transition-colors"
                    >
                      .md 저장
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(rec.date)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#F3EFE6] dark:bg-[#26231F] text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#E8E2D5] dark:hover:bg-[#302B26] transition-colors whitespace-nowrap"
                    >
                      {isExpanded ? (
                        <>
                          문장 접기
                          <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          필사 내용 펼치기
                          <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {(favSentence || rec.reflection.trim()) && (
                  <div className="pt-4 border-t border-[#ECE7DC] dark:border-[#2C2823] space-y-3">
                    {favSentence && (
                      <div>
                        <div className="text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-1">
                          오늘 가장 마음에 와닿은 문장
                        </div>
                        <p className="font-editorial text-base sm:text-lg text-[#1E1D1B] dark:text-[#F0ECE1]">
                          “{favSentence.english}”
                        </p>
                        <p className="text-sm text-[#666158] dark:text-[#A8A196] mt-0.5">
                          {favSentence.korean}
                        </p>
                      </div>
                    )}
                    {rec.reflection.trim() && (
                      <div>
                        <div className="text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-1">
                          오늘의 한 줄 회고
                        </div>
                        <p className="text-sm text-[#1E1D1B] dark:text-[#F0ECE1] leading-relaxed">
                          {rec.reflection}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {isExpanded && (
                  <div className="pt-4 border-t border-[#ECE7DC] dark:border-[#2C2823] space-y-5">
                    {rec.sentences.map((s, idx) => {
                      const p = rec.progressBySentenceId[s.id];
                      return (
                        <div
                          key={s.id}
                          className="pb-4 last:pb-0 border-b last:border-b-0 border-dashed border-[#ECE7DC] dark:border-[#2C2823] space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#666158] dark:text-[#A8A196] font-mono-tabular">
                            <span>문장 {String(idx + 1).padStart(2, '0')}</span>
                            {p?.englishInput && (
                              <span>
                                정확도 {p.englishAccuracy}% · {p.englishWpm} WPM
                              </span>
                            )}
                          </div>
                          <p className="font-editorial text-base text-[#1E1D1B] dark:text-[#F0ECE1]">
                            {s.english}
                          </p>
                          <p className="text-sm text-[#666158] dark:text-[#A8A196]">
                            모범 해석: {s.korean}
                          </p>
                          {p?.koreanInput?.trim() && (
                            <p className="text-sm text-[#1E3A5F] dark:text-[#93C5FD]">
                              나의 한국어 필사 ({p.koreanMode === 'self' ? '셀프 번역' : '보고 쓰기'}):{' '}
                              {p.koreanInput}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
