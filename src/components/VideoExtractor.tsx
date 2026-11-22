import { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  ExternalLink,
  Feather,
  Loader2,
  Sparkles,
  Trash2,
  Youtube,
} from 'lucide-react';
import { DEFAULT_YOUTUBE_URL } from '../data/sampleDay1';
import type { FocusStyle, StudySet } from '../types';

interface VideoExtractorProps {
  studySets: StudySet[];
  activeSetId: string;
  onSelectSet: (setId: string) => void;
  onDeleteSet: (setId: string) => void;
  onExtractedSet: (newSet: StudySet) => void;
}

const HERO_IMAGE_PATH = '/src/assets/images/fountain_pen_notebook_1795320115011.jpg';

export function VideoExtractor({
  studySets,
  activeSetId,
  onSelectSet,
  onDeleteSet,
  onExtractedSet,
}: VideoExtractorProps) {
  const [youtubeUrl, setYoutubeUrl] = useState(DEFAULT_YOUTUBE_URL);
  const [scriptText, setScriptText] = useState('');
  const [focusStyle, setFocusStyle] = useState<FocusStyle>('balanced');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!youtubeUrl.trim() && !scriptText.trim()) {
      setErrorMsg('유튜브 URL 또는 영어/한국어 스크립트 텍스트를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/extract-sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeUrl: youtubeUrl.trim(),
          scriptText: scriptText.trim(),
          focusStyle,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        videoTitle?: string;
        sourceUrl?: string;
        sourceSummary?: string;
        sentences?: StudySet['sentences'];
      };

      if (!response.ok) {
        throw new Error(data.error || '필사 문장을 추출하는 중 문제가 발생했습니다.');
      }

      if (!data.sentences || data.sentences.length === 0) {
        throw new Error('추출된 문장이 없습니다. 스크립트 내용을 추가해 다시 시도해 주세요.');
      }

      const newSet: StudySet = {
        id: `set-${Date.now()}`,
        title: data.videoTitle || '새 필사 노트',
        sourceUrl: data.sourceUrl || (youtubeUrl.trim() || undefined),
        sourceSummary:
          data.sourceSummary || '영상의 핵심 메시지를 바탕으로 선별한 오늘의 필사 세트입니다.',
        createdAt: new Date().toISOString(),
        sentences: data.sentences,
      };

      onExtractedSet(newSet);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Editorial visual & context */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl overflow-hidden">
          <div className="relative h-56 sm:h-64 bg-[#EFEAE0] dark:bg-[#24211D]">
            {!imgFailed ? (
              <img
                src={HERO_IMAGE_PATH}
                alt="만년필과 크림색 종이 노트가 놓인 차분한 책상"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#666158] dark:text-[#A8A196] p-6 text-center">
                <Feather className="w-8 h-8 text-[#1E3A5F] dark:text-[#7FA6D6]" aria-hidden="true" />
                <span className="font-editorial text-lg font-medium">Inkwell Studio</span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="text-xs text-[#666158] dark:text-[#A8A196]">
                유튜브 & 스크립트 큐레이션
              </div>
              <h1 className="font-editorial text-2xl font-semibold text-[#1E1D1B] dark:text-[#F0ECE1] text-balance">
                영상 속 울림을 오늘의 필사 노트로 옮기세요
              </h1>
              <p className="text-sm text-[#666158] dark:text-[#A8A196] leading-relaxed">
                유튜브 영상 주소나 스크립트 일부를 입력하면 Gemini AI가 하루에 필사하기 좋은 핵심 영어 문장 5~7개와 자연스러운 한국어 번역, 핵심 어휘를 깔끔하게 정리해 드립니다.
              </p>
            </div>

            <div className="pt-4 border-t border-[#ECE7DC] dark:border-[#2C2823] text-xs text-[#666158] dark:text-[#A8A196] space-y-1">
              <p className="font-medium text-[#1E1D1B] dark:text-[#F0ECE1]">추천 활용 팁</p>
              <p>
                자막이 비공개이거나 특정 구간만 연습하고 싶을 때는 스크립트 텍스트를 함께 붙여넣으면 더욱 정확한 문장이 추출됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Extraction Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <label
                  htmlFor="youtube-url-input"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#666158] dark:text-[#A8A196]"
                >
                  <Youtube className="w-4 h-4 text-[#1E3A5F] dark:text-[#7FA6D6]" aria-hidden="true" />
                  유튜브 영상 URL
                </label>
                <button
                  type="button"
                  onClick={() => setYoutubeUrl(DEFAULT_YOUTUBE_URL)}
                  className="text-xs text-[#1E3A5F] dark:text-[#93C5FD] hover:underline"
                >
                  기본 추천 영상 채우기
                </button>
              </div>
              <input
                id="youtube-url-input"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtu.be/5E83KtnJs-I"
                className="w-full rounded-xl border border-[#D8D1C3] dark:border-[#38332C] bg-[#FCFBF7] dark:bg-[#151412] px-4 py-2.5 text-sm text-[#1E1D1B] dark:text-[#F0ECE1] placeholder:text-[#9D968A] dark:placeholder:text-[#666057] focus:outline-none focus:border-[#1E3A5F] dark:focus:border-[#7FA6D6]"
              />
            </div>

            <div>
              <label
                htmlFor="script-text-input"
                className="block text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-2"
              >
                스크립트 또는 영어/한국어 지문 직접 입력 (선택 사항)
              </label>
              <textarea
                id="script-text-input"
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                rows={5}
                placeholder="유튜브 자막이나 TED 강연, 기사 본문 등을 붙여넣으면 해당 내용을 중심으로 핵심 문장을 선별합니다..."
                className="w-full rounded-xl border border-[#D8D1C3] dark:border-[#38332C] bg-[#FCFBF7] dark:bg-[#151412] px-4 py-3 text-sm text-[#1E1D1B] dark:text-[#F0ECE1] placeholder:text-[#9D968A] dark:placeholder:text-[#666057] focus:outline-none focus:border-[#1E3A5F] dark:focus:border-[#7FA6D6] resize-y leading-relaxed"
              />
            </div>

            <div>
              <div className="text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-2.5">
                문장 큐레이션 스타일
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    { id: 'balanced', label: '균형 잡힌 핵심 문장', desc: '리듬과 의미의 조화' },
                    { id: 'conversational', label: '실용 회화 · 표현', desc: '자연스러운 구어체' },
                    { id: 'literary', label: '깊이 있는 문장', desc: '사유와 고급 어휘' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFocusStyle(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      focusStyle === opt.id
                        ? 'border-[#1E3A5F] dark:border-[#7FA6D6] bg-[#1E3A5F]/5 dark:bg-[#7FA6D6]/10'
                        : 'border-[#E4DFD3] dark:border-[#2E2A25] bg-[#FCFBF7] dark:bg-[#151412] hover:border-[#C5BDB0] dark:hover:border-[#433D35]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
                      {opt.label}
                    </div>
                    <div className="text-xs text-[#666158] dark:text-[#A8A196] mt-0.5">
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[#FCA5A5] dark:border-[#7F1D1D] bg-[#FEF2F2] dark:bg-[#450A0A]/40 text-xs sm:text-sm text-[#991B1B] dark:text-[#FECACA]"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A5F] dark:bg-[#7FA6D6] text-white dark:text-[#141311] text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  영상 맥락을 분석하고 문장을 고르는 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  오늘의 필사 세트 생성하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Saved Study Sets Switcher */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-xl font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
            불러온 필사 세트 목록
          </h2>
          <span className="text-xs font-mono-tabular text-[#666158] dark:text-[#A8A196]">
            총 {studySets.length}개 세트
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studySets.map((set) => {
            const isActive = set.id === activeSetId;
            return (
              <div
                key={set.id}
                className={`p-5 rounded-2xl border transition-colors flex flex-col justify-between gap-4 ${
                  isActive
                    ? 'bg-white dark:bg-[#1C1A17] border-[#1E3A5F] dark:border-[#7FA6D6]'
                    : 'bg-white dark:bg-[#1C1A17] border-[#E4DFD3] dark:border-[#2E2A25]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#666158] dark:text-[#A8A196]">
                    <span className="font-mono-tabular">
                      {set.sentences.length}문장 · {set.isSample ? 'Day 1 기본 세트' : '추출 세트'}
                    </span>
                    {set.sourceUrl && (
                      <a
                        href={set.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[#1E3A5F] dark:hover:text-[#93C5FD]"
                      >
                        영상 링크
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  <h3 className="font-editorial text-lg font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
                    {set.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666158] dark:text-[#A8A196] line-clamp-2">
                    {set.sourceSummary}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#ECE7DC] dark:border-[#2C2823]">
                  <button
                    type="button"
                    onClick={() => onSelectSet(set.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1E3A5F]/10 text-[#1E3A5F] dark:bg-[#7FA6D6]/15 dark:text-[#93C5FD]'
                        : 'bg-[#1E3A5F] dark:bg-[#7FA6D6] text-white dark:text-[#141311] hover:opacity-90'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        현재 학습 중
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                        이 세트로 필사하기
                      </>
                    )}
                  </button>

                  {!set.isSample && studySets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteSet(set.id)}
                      className="inline-flex items-center gap-1 text-xs text-[#666158] dark:text-[#A8A196] hover:text-[#B91C1C] dark:hover:text-[#FCA5A5] transition-colors"
                      title="이 필사 세트 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      삭제
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
