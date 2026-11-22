import { useEffect, useState } from 'react';
import { Grid, List, Printer, X } from 'lucide-react';
import type { DailyRecord } from '../types';
import { formatKoreanDate } from '../utils/storage';

interface PrintSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DailyRecord;
}

export function PrintSheetModal({ isOpen, onClose, record }: PrintSheetModalProps) {
  const [paperStyle, setPaperStyle] = useState<'lined' | 'grid'>('lined');
  const [includeKorean, setIncludeKorean] = useState(true);
  const [includeVocab, setIncludeVocab] = useState(true);
  const [practiceRows, setPracticeRows] = useState<3 | 5>(3);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col overflow-y-auto p-3 sm:p-6 print:p-0 print:bg-white print:static"
      role="dialog"
      aria-modal="true"
      aria-label="손글씨 인쇄용 필사 시트"
    >
      {/* Modal Control Bar (hidden on print) */}
      <div className="no-print max-w-[900px] w-full mx-auto mb-4 bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex items-center p-1 rounded-lg bg-[#EFEAE0] dark:bg-[#221F1B]"
            role="group"
            aria-label="노트 배경 양식"
          >
            <button
              type="button"
              onClick={() => setPaperStyle('lined')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                paperStyle === 'lined'
                  ? 'bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] shadow-xs'
                  : 'text-[#666158] dark:text-[#A8A196]'
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              줄노트
            </button>
            <button
              type="button"
              onClick={() => setPaperStyle('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                paperStyle === 'grid'
                  ? 'bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] shadow-xs'
                  : 'text-[#666158] dark:text-[#A8A196]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" aria-hidden="true" />
              격자 모눈
            </button>
          </div>

          <label className="inline-flex items-center gap-1.5 text-xs text-[#1E1D1B] dark:text-[#F0ECE1] cursor-pointer">
            <input
              type="checkbox"
              checked={includeKorean}
              onChange={(e) => setIncludeKorean(e.target.checked)}
              className="accent-[#1E3A5F]"
            />
            한국어 해석 포함
          </label>

          <label className="inline-flex items-center gap-1.5 text-xs text-[#1E1D1B] dark:text-[#F0ECE1] cursor-pointer">
            <input
              type="checkbox"
              checked={includeVocab}
              onChange={(e) => setIncludeVocab(e.target.checked)}
              className="accent-[#1E3A5F]"
            />
            핵심 어휘 포함
          </label>

          <button
            type="button"
            onClick={() => setPracticeRows((r) => (r === 3 ? 5 : 3))}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-[#D8D1C3] dark:border-[#38332C] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]"
          >
            여백 {practiceRows}줄
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E3A5F] dark:bg-[#7FA6D6] text-white dark:text-[#141311] text-xs font-semibold hover:opacity-90 whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            인쇄 / PDF 저장
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="인쇄 미리보기 닫기"
            className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#D8D1C3] dark:border-[#38332C] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable A4 Sheet */}
      <div
        className={`print-only-sheet max-w-[900px] w-full mx-auto bg-[#FFFEFA] text-[#1E1D1B] border border-[#E4DFD3] rounded-2xl p-8 sm:p-12 shadow-xl ${
          paperStyle === 'grid' ? 'paper-grid' : 'paper-lined'
        }`}
      >
        <div className="pb-5 mb-6 border-b border-[#D5CEC0] flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs text-[#666158] font-mono-tabular">
              Inkwell Daily Handwriting Sheet · {formatKoreanDate(record.date)}
            </div>
            <h2 className="font-editorial text-2xl font-semibold text-[#1E1D1B] mt-1">
              {record.studySetTitle}
            </h2>
          </div>
          <div className="text-xs text-[#666158] font-mono-tabular">
            총 {record.sentences.length}문장 · 손필사 / 태블릿 필기용
          </div>
        </div>

        <div className="space-y-8">
          {record.sentences.map((s, idx) => (
            <div key={s.id} className="break-inside-avoid space-y-2.5">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono-tabular text-xs font-semibold text-[#1E3A5F]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p className="font-editorial text-lg font-medium leading-snug text-[#1E1D1B]">
                  {s.english}
                </p>
              </div>

              {includeKorean && (
                <p className="text-sm text-[#57524B] pl-6">
                  {s.korean}
                </p>
              )}

              {includeVocab && s.vocabulary.length > 0 && (
                <p className="text-xs text-[#6B655D] pl-6">
                  핵심 표현: {s.vocabulary.map((v) => `${v.word} (${v.meaning})`).join(' · ')}
                </p>
              )}

              {/* Handwriting blank lines */}
              <div className="pl-6 pt-1 space-y-0">
                {Array.from({ length: practiceRows }).map((_, rIdx) => (
                  <div
                    key={rIdx}
                    className="h-9 border-b border-dashed border-[#C9C1B2]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-5 border-t border-[#D5CEC0] break-inside-avoid">
          <div className="text-xs font-semibold text-[#57524B] mb-2">
            오늘의 한 줄 회고 (One-line Reflection)
          </div>
          <div className="h-9 border-b border-dashed border-[#C9C1B2]" />
          <div className="h-9 border-b border-dashed border-[#C9C1B2]" />
        </div>
      </div>
    </div>
  );
}
