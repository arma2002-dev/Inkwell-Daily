import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  PenTool,
  RotateCcw,
  Square,
  Volume2,
} from 'lucide-react';
import type { KoreanMode, SentenceItem, SentenceProgress } from '../types';
import { speakEnglish, stopSpeaking } from '../utils/speech';
import { evaluateTyping, isSentenceDone } from '../utils/storage';

interface SentenceCardProps {
  sentence: SentenceItem;
  index: number;
  total: number;
  progress: SentenceProgress;
  onUpdateProgress: (patch: Partial<SentenceProgress>) => void;
}

export function SentenceCard({
  sentence,
  index,
  total,
  progress,
  onUpdateProgress,
}: SentenceCardProps) {
  const [speechRate, setSpeechRate] = useState<0.8 | 1.0>(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingVocab, setSpeakingVocab] = useState<string | null>(null);
  const typingStartRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [sentence.id]);

  const { accuracy, isComplete, charStates } = evaluateTyping(
    sentence.english,
    progress.englishInput,
  );

  const sentenceDone = isSentenceDone(progress);

  const handleEnglishChange = (value: string) => {
    if (value.length === 0) {
      typingStartRef.current = null;
      onUpdateProgress({
        englishInput: '',
        englishAccuracy: 0,
        englishWpm: 0,
        englishCompleted: false,
      });
      return;
    }

    if (!typingStartRef.current) {
      typingStartRef.current = Date.now();
    }

    const elapsedMinutes = Math.max((Date.now() - typingStartRef.current) / 60000, 0.05);
    const wordsTyped = value.trim().length / 5;
    const wpm = value.length >= 4 ? Math.min(220, Math.round(wordsTyped / elapsedMinutes)) : 0;

    const evalRes = evaluateTyping(sentence.english, value);
    onUpdateProgress({
      englishInput: value,
      englishAccuracy: evalRes.accuracy,
      englishWpm: wpm,
      englishCompleted: evalRes.isComplete,
    });
  };

  const handleResetEnglish = () => {
    typingStartRef.current = null;
    onUpdateProgress({
      englishInput: '',
      englishAccuracy: 0,
      englishWpm: 0,
      englishCompleted: false,
    });
  };

  const handleKoreanChange = (value: string) => {
    onUpdateProgress({
      koreanInput: value,
      koreanCompleted: value.trim().length >= 4,
    });
  };

  const handleToggleKoreanMode = (mode: KoreanMode) => {
    onUpdateProgress({
      koreanMode: mode,
      koreanRevealed: mode === 'guided' ? true : progress.koreanRevealed,
    });
  };

  const handleSpeakSentence = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setSpeakingVocab(null);
    speakEnglish(
      sentence.english,
      speechRate,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false),
    );
  };

  const handleSpeakVocab = (word: string) => {
    setIsSpeaking(false);
    speakEnglish(
      word,
      speechRate,
      () => setSpeakingVocab(word),
      () => setSpeakingVocab(null),
      () => setSpeakingVocab(null),
    );
  };

  const hasStartedTyping = progress.englishInput.length > 0;
  const activeCharIndex = progress.englishInput.length;

  return (
    <article className="bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl p-6 sm:p-8 transition-colors duration-150">
      {/* Top quiet editorial header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#ECE7DC] dark:border-[#2C2823]">
        <div className="flex items-center gap-2.5 text-xs text-[#666158] dark:text-[#A8A196] font-mono-tabular">
          <span className="font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
            문장 {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span aria-hidden="true">·</span>
          {sentenceDone ? (
            <span className="inline-flex items-center gap-1 font-medium text-[#1E3A5F] dark:text-[#93C5FD]">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              필사 완료
            </span>
          ) : (
            <span>필사 대기 중</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Speed selector */}
          <div
            className="inline-flex items-center p-0.5 rounded-lg bg-[#F3EFE6] dark:bg-[#26231F] border border-[#E4DFD3] dark:border-[#342F29]"
            role="group"
            aria-label="발음 재생 속도"
          >
            {([0.8, 1.0] as const).map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setSpeechRate(rate)}
                className={`px-2.5 py-1 text-xs font-mono-tabular rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  speechRate === rate
                    ? 'bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] font-semibold shadow-xs'
                    : 'text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
                }`}
              >
                {rate.toFixed(1)}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSpeakSentence}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              isSpeaking
                ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white dark:bg-[#7FA6D6] dark:border-[#7FA6D6] dark:text-[#141311]'
                : 'bg-white dark:bg-[#24211D] border-[#D8D1C3] dark:border-[#38332C] text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#2C2823]'
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                멈추기
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#1E3A5F] dark:text-[#7FA6D6]" aria-hidden="true" />
                원어민 발음 듣기
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateProgress({ handwrittenCompleted: !progress.handwrittenCompleted })
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              progress.handwrittenCompleted
                ? 'bg-[#1E3A5F]/10 border-[#1E3A5F]/40 text-[#1E3A5F] dark:bg-[#7FA6D6]/15 dark:border-[#7FA6D6]/40 dark:text-[#93C5FD]'
                : 'bg-white dark:bg-[#24211D] border-[#D8D1C3] dark:border-[#38332C] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
            }`}
            title="노트나 태블릿에 손으로 직접 필사한 경우 완료로 표시합니다"
          >
            <PenTool className="w-3.5 h-3.5" aria-hidden="true" />
            {progress.handwrittenCompleted ? '손필사 완료됨' : '손필사 완료 체크'}
          </button>
        </div>
      </div>

      {/* Section 1: English Original & Live Ink Feedback */}
      <div className="pt-6 pb-7">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-xs font-medium text-[#666158] dark:text-[#A8A196]">
            01. 영어 원문 필사
          </span>
          <div className="flex items-center gap-3 text-xs font-mono-tabular text-[#666158] dark:text-[#A8A196]">
            <span>
              정확도{' '}
              <strong
                className={
                  !hasStartedTyping
                    ? 'text-[#666158] dark:text-[#A8A196]'
                    : accuracy >= 95
                      ? 'text-[#1E3A5F] dark:text-[#93C5FD]'
                      : accuracy >= 80
                        ? 'text-[#B45309] dark:text-[#FBBF24]'
                        : 'text-[#B91C1C] dark:text-[#FCA5A5]'
                }
              >
                {hasStartedTyping ? `${accuracy}%` : '—'}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              속도{' '}
              <strong className="text-[#1E1D1B] dark:text-[#F0ECE1]">
                {progress.englishWpm > 0 ? `${progress.englishWpm} WPM` : '—'}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {Math.min(progress.englishInput.length, sentence.english.length)}/{sentence.english.length}자
            </span>
          </div>
        </div>

        {/* Character-by-character live ink preview */}
        <p
          className="font-editorial text-xl sm:text-[23px] leading-[1.65] tracking-[-0.01em] select-text mb-3"
          aria-label={sentence.english}
        >
          {sentence.english.split('').map((char, idx) => {
            if (!hasStartedTyping) {
              return (
                <span key={idx} className="text-[#1E1D1B] dark:text-[#F0ECE1]">
                  {char}
                </span>
              );
            }

            const state = charStates[idx];
            const isCursor = idx === activeCharIndex;

            if (state === 'correct') {
              return (
                <span
                  key={idx}
                  className="text-[#1E3A5F] dark:text-[#93C5FD] font-medium"
                >
                  {char}
                </span>
              );
            }
            if (state === 'wrong') {
              return (
                <span
                  key={idx}
                  className="text-[#B91C1C] dark:text-[#FCA5A5] underline decoration-2 underline-offset-4 bg-[#FEE2E2]/65 dark:bg-[#7F1D1D]/45 rounded-[2px]"
                  title="오타가 있습니다"
                >
                  {char}
                </span>
              );
            }
            return (
              <span
                key={idx}
                className={`text-[#9D968A] dark:text-[#666057] ${
                  isCursor ? 'border-b-2 border-[#1E3A5F] dark:border-[#7FA6D6]' : ''
                }`}
              >
                {char}
              </span>
            );
          })}
        </p>

        {sentence.contextNote && (
          <p className="text-xs sm:text-sm text-[#666158] dark:text-[#A8A196] mb-4">
            {sentence.contextNote}
          </p>
        )}

        <div className="relative">
          <textarea
            value={progress.englishInput}
            onChange={(e) => handleEnglishChange(e.target.value)}
            rows={2}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="위 영어 문장을 천천히 음미하며 한 글자씩 따라 써 보세요..."
            className="w-full rounded-xl border border-[#D8D1C3] dark:border-[#38332C] bg-[#FCFBF7] dark:bg-[#151412] px-4 py-3 text-base text-[#1E1D1B] dark:text-[#F0ECE1] placeholder:text-[#9D968A] dark:placeholder:text-[#666057] focus:outline-none focus:border-[#1E3A5F] dark:focus:border-[#7FA6D6] transition-colors resize-none leading-relaxed"
          />
          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="text-xs">
              {isComplete ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-[#1E3A5F] dark:text-[#93C5FD]">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  영어 문장 필사를 깔끔하게 마쳤습니다 (정확도 {accuracy}%)
                </span>
              ) : hasStartedTyping && accuracy < 85 ? (
                <span className="text-[#B91C1C] dark:text-[#FCA5A5]">
                  붉은 밑줄 표시된 철자와 문장부호를 확인해 보세요.
                </span>
              ) : (
                <span className="text-[#857E73] dark:text-[#7D766B]">
                  정확도 85% 이상으로 문장 끝까지 입력하면 자동 완료됩니다.
                </span>
              )}
            </div>
            {hasStartedTyping && (
              <button
                type="button"
                onClick={handleResetEnglish}
                className="inline-flex items-center gap-1 text-xs text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1] transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                다시 쓰기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Korean Transcription Workspace */}
      <div className="pt-7 pb-7 border-t border-[#ECE7DC] dark:border-[#2C2823]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="text-xs font-medium text-[#666158] dark:text-[#A8A196]">
            02. 한국어 의미 필사
          </span>

          <div
            className="inline-flex items-center p-0.5 rounded-lg bg-[#F3EFE6] dark:bg-[#26231F] border border-[#E4DFD3] dark:border-[#342F29]"
            role="group"
            aria-label="한국어 필사 방식 선택"
          >
            <button
              type="button"
              onClick={() => handleToggleKoreanMode('guided')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                progress.koreanMode === 'guided'
                  ? 'bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] shadow-xs'
                  : 'text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
              }`}
            >
              보고 쓰기
            </button>
            <button
              type="button"
              onClick={() => handleToggleKoreanMode('self')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                progress.koreanMode === 'self'
                  ? 'bg-white dark:bg-[#1C1A17] text-[#1E1D1B] dark:text-[#F0ECE1] shadow-xs'
                  : 'text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
              }`}
            >
              셀프 번역 필사
            </button>
          </div>
        </div>

        {progress.koreanMode === 'guided' ? (
          <p className="text-base sm:text-lg leading-relaxed text-[#1E1D1B] dark:text-[#F0ECE1] mb-4 font-medium">
            {sentence.korean}
          </p>
        ) : (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 py-2.5 px-3.5 rounded-lg bg-[#F6F3EC] dark:bg-[#24211D] text-xs text-[#666158] dark:text-[#A8A196]">
            <span>
              영어 원문의 뜻을 먼저 스스로 우리말로 옮겨 적은 뒤, 모범 번역과 나란히 비교해 보세요.
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateProgress({ koreanRevealed: !progress.koreanRevealed })
              }
              className="inline-flex items-center gap-1.5 font-medium text-[#1E3A5F] dark:text-[#93C5FD] hover:underline whitespace-nowrap shrink-0"
            >
              {progress.koreanRevealed ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                  모범 번역 숨기기
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  모범 번역과 비교하기
                </>
              )}
            </button>
          </div>
        )}

        <textarea
          value={progress.koreanInput}
          onChange={(e) => handleKoreanChange(e.target.value)}
          rows={2}
          placeholder={
            progress.koreanMode === 'guided'
              ? '모범 한국어 문장을 손으로 쓰듯 차분히 옮겨 적어 보세요...'
              : '위 영어 문장을 나만의 자연스러운 한국어 문장으로 번역해 보세요...'
          }
          className="w-full rounded-xl border border-[#D8D1C3] dark:border-[#38332C] bg-[#FCFBF7] dark:bg-[#151412] px-4 py-3 text-base text-[#1E1D1B] dark:text-[#F0ECE1] placeholder:text-[#9D968A] dark:placeholder:text-[#666057] focus:outline-none focus:border-[#1E3A5F] dark:focus:border-[#7FA6D6] transition-colors resize-none leading-relaxed"
        />

        {progress.koreanMode === 'self' && progress.koreanRevealed && (
          <div className="mt-4 pt-4 border-t border-dashed border-[#DFD8CA] dark:border-[#332E28] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-1">
                나의 번역
              </div>
              <p className="text-sm leading-relaxed text-[#1E1D1B] dark:text-[#F0ECE1]">
                {progress.koreanInput.trim() || '아직 입력한 번역이 없습니다.'}
              </p>
            </div>
            <div>
              <div className="text-xs font-medium text-[#1E3A5F] dark:text-[#93C5FD] mb-1">
                모범 번역
              </div>
              <p className="text-sm leading-relaxed text-[#1E1D1B] dark:text-[#F0ECE1]">
                {sentence.korean}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Key Vocabulary & Expressions */}
      {sentence.vocabulary.length > 0 && (
        <div className="pt-6 border-t border-[#ECE7DC] dark:border-[#2C2823]">
          <div className="text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-3.5">
            03. 핵심 어휘 및 표현
          </div>
          <ul className="divide-y divide-[#F0ECE3] dark:divide-[#28241F]">
            {sentence.vocabulary.map((v, vIdx) => (
              <li key={vIdx} className="py-2.5 first:pt-0 last:pb-0 flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeakVocab(v.word)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A5F] dark:text-[#93C5FD] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] rounded"
                    title="단어 발음 듣기"
                  >
                    <Volume2
                      className={`w-3.5 h-3.5 ${
                        speakingVocab === v.word ? 'animate-pulse' : ''
                      }`}
                      aria-hidden="true"
                    />
                    {v.word}
                  </button>
                  <span aria-hidden="true" className="text-[#9D968A] dark:text-[#666057]">
                    ·
                  </span>
                  <span className="text-sm text-[#1E1D1B] dark:text-[#F0ECE1]">
                    {v.meaning}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#666158] dark:text-[#A8A196] pl-5 italic">
                  {v.example}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
