import { useEffect, useState } from 'react';
import { RefreshCw, Square, Volume2 } from 'lucide-react';
import type { DailyQuote } from '../types';
import { formatSentenceWithSlashes } from '../utils/phrasing';
import { speakEnglish, stopSpeaking } from '../utils/speech';

interface DailyQuoteBannerProps {
  quote: DailyQuote;
  showChunking: boolean;
  onShuffleQuote: () => void;
}

export function DailyQuoteBanner({
  quote,
  showChunking,
  onShuffleQuote,
}: DailyQuoteBannerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsSpeaking(false);
    return () => {
      stopSpeaking();
    };
  }, [quote.id]);

  const handleSpeakQuote = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    speakEnglish(
      quote.english,
      1.0,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false),
    );
  };

  const displayText = showChunking
    ? formatSentenceWithSlashes(quote.english, quote.chunkedEnglish)
    : quote.english;

  const segments = displayText.split(' / ');

  return (
    <aside
      aria-label="오늘의 영어 명언"
      className="bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl px-5 py-4 sm:px-7 sm:py-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 text-xs text-[#666158] dark:text-[#A8A196]">
          <span className="font-medium text-[#1E3A5F] dark:text-[#93C5FD]">오늘의 영어 명언</span>
          <span aria-hidden="true">·</span>
          <span>{quote.moodLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSpeakQuote}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              isSpeaking
                ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white dark:bg-[#7FA6D6] dark:border-[#7FA6D6] dark:text-[#141311]'
                : 'bg-[#FCFBF7] dark:bg-[#151412] border-[#E4DFD3] dark:border-[#342F29] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-3 h-3 fill-current" aria-hidden="true" />
                멈추기
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#1E3A5F] dark:text-[#7FA6D6]" aria-hidden="true" />
                명언 듣기
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onShuffleQuote}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[#E4DFD3] dark:border-[#342F29] bg-[#FCFBF7] dark:bg-[#151412] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1] transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            다른 명언
          </button>
        </div>
      </div>

      <blockquote className="space-y-1.5">
        <p className="font-editorial text-lg sm:text-[21px] leading-[1.6] text-[#1E1D1B] dark:text-[#F0ECE1]">
          {segments.map((seg, idx) => (
            <span key={idx}>
              {seg}
              {idx < segments.length - 1 && (
                <span
                  className="mx-1.5 text-[#1E3A5F] dark:text-[#7FA6D6] font-sans font-semibold select-none"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </span>
          ))}
        </p>

        <footer className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs sm:text-sm text-[#666158] dark:text-[#A8A196]">
          <span>{quote.korean}</span>
          <cite className="not-italic font-medium text-[#1E1D1B]/80 dark:text-[#F0ECE1]/80 shrink-0">
            — {quote.author}
          </cite>
        </footer>
      </blockquote>
    </aside>
  );
}
