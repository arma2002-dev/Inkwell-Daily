import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Download, Share2, X } from 'lucide-react';
import type { DailyRecord } from '../types';

type CardTheme = 'ivory' | 'midnight' | 'sand';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DailyRecord;
  streakCount: number;
}

const CARD_THEMES: Record<
  CardTheme,
  {
    label: string;
    bg: string;
    border: string;
    innerBorder: string;
    primaryText: string;
    secondaryText: string;
    accent: string;
    quoteMark: string;
    dotColor: string;
  }
> = {
  ivory: {
    label: '아이보리 종이',
    bg: '#F9F7F2',
    border: '#DDD5C7',
    innerBorder: '#E7E0D3',
    primaryText: '#1E1D1B',
    secondaryText: '#5F5A51',
    accent: '#1E3A5F',
    quoteMark: '#C8D3E0',
    dotColor: 'rgba(30, 29, 27, 0.03)',
  },
  midnight: {
    label: '미드나잇 잉크',
    bg: '#161F2B',
    border: '#2A3748',
    innerBorder: '#232F3E',
    primaryText: '#F3EFE6',
    secondaryText: '#B0BAC7',
    accent: '#8AB4E8',
    quoteMark: '#2E435C',
    dotColor: 'rgba(243, 239, 230, 0.035)',
  },
  sand: {
    label: '웜 샌드',
    bg: '#EFE8DA',
    border: '#D4C8B3',
    innerBorder: '#DFD5C3',
    primaryText: '#241E18',
    secondaryText: '#675D51',
    accent: '#8B4A16',
    quoteMark: '#D6C4AE',
    dotColor: 'rgba(36, 30, 24, 0.03)',
  },
};

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  isKorean: boolean,
): string[] {
  const lines: string[] = [];
  if (!text.trim()) return lines;

  if (!isKorean) {
    const words = text.split(/\s+/);
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width <= maxWidth) {
        current = test;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  // Korean word-aware wrapping with character fallback for long tokens
  const tokens = text.split(/\s+/);
  let current = '';
  for (const token of tokens) {
    const candidate = current ? `${current} ${token}` : token;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) {
        lines.push(current);
        current = '';
      }
      if (ctx.measureText(token).width <= maxWidth) {
        current = token;
      } else {
        let chunk = '';
        for (const ch of token) {
          if (ctx.measureText(chunk + ch).width <= maxWidth) {
            chunk += ch;
          } else {
            if (chunk) lines.push(chunk);
            chunk = ch;
          }
        }
        current = chunk;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function ShareCardModal({
  isOpen,
  onClose,
  record,
  streakCount,
}: ShareCardModalProps) {
  const [selectedSentenceId, setSelectedSentenceId] = useState<string>(
    () => record.favoriteSentenceId || record.sentences[0]?.id || '',
  );
  const [cardTheme, setCardTheme] = useState<CardTheme>('ivory');
  const [includeReflection, setIncludeReflection] = useState(
    () => Boolean(record.reflection?.trim()),
  );
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedSentenceId(record.favoriteSentenceId || record.sentences[0]?.id || '');
      setIncludeReflection(Boolean(record.reflection?.trim()));
      setStatusMessage(null);
      setCopied(false);
    }
  }, [isOpen, record.favoriteSentenceId, record.reflection, record.sentences]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const activeSentence = useMemo(() => {
    return (
      record.sentences.find((s) => s.id === selectedSentenceId) || record.sentences[0]
    );
  }, [record.sentences, selectedSentenceId]);

  useEffect(() => {
    if (!isOpen || !activeSentence) return;

    let cancelled = false;

    const drawCard = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (cancelled) return;

      const canvas = canvasRef.current || document.createElement('canvas');
      canvasRef.current = canvas;
      const W = 1080;
      const H = 1350;
      canvas.width = W;
      canvas.height = H;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const palette = CARD_THEMES[cardTheme];

      // Background fill
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle deterministic paper texture dots
      ctx.fillStyle = palette.dotColor;
      for (let y = 18; y < H; y += 22) {
        for (let x = (y % 44 === 18 ? 14 : 26); x < W; x += 28) {
          ctx.fillRect(x, y, 2, 2);
        }
      }

      // Outer & inner editorial frames
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, W - 96, H - 96);

      ctx.strokeStyle = palette.innerBorder;
      ctx.lineWidth = 1;
      ctx.strokeRect(62, 62, W - 124, H - 124);

      const padX = 112;
      const contentW = W - padX * 2;

      // Top Header: Brand Nib + Inkwell Daily
      ctx.save();
      ctx.translate(padX, 128);
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(14, -4);
      ctx.lineTo(24, 6);
      ctx.lineTo(10, 24);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = palette.accent;
      ctx.font = '600 22px "Fraunces", Georgia, serif';
      ctx.fillText('Inkwell Daily', padX + 36, 144);

      // Top Right: Date & Streak
      ctx.textAlign = 'right';
      ctx.fillStyle = palette.secondaryText;
      ctx.font = '500 20px "JetBrains Mono", monospace';
      const displayDate = record.date.replace(/-/g, '. ');
      const metaRight =
        streakCount > 0 ? `${displayDate} · ${streakCount}일 연속` : displayDate;
      ctx.fillText(metaRight, W - padX, 144);
      ctx.textAlign = 'left';

      // Top hairline divider
      ctx.strokeStyle = palette.innerBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padX, 184);
      ctx.lineTo(W - padX, 184);
      ctx.stroke();

      // Measure English & Korean blocks to vertically center cleanly
      const englishFontSize = activeSentence.english.length > 135 ? 42 : 48;
      const englishLineHeight = Math.round(englishFontSize * 1.48);
      ctx.font = `500 ${englishFontSize}px "Fraunces", Georgia, serif`;
      const enLines = wrapTextLines(ctx, activeSentence.english, contentW, false);

      const koreanFontSize = 27;
      const koreanLineHeight = 46;
      ctx.font = `400 ${koreanFontSize}px "Plus Jakarta Sans", sans-serif`;
      const koLines = wrapTextLines(ctx, activeSentence.korean, contentW, true);

      const reflectionText =
        includeReflection && record.reflection.trim() ? record.reflection.trim() : '';
      let reflLines: string[] = [];
      if (reflectionText) {
        ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
        reflLines = wrapTextLines(ctx, reflectionText, contentW - 36, true).slice(0, 3);
      }

      const enBlockH = enLines.length * englishLineHeight;
      const koBlockH = koLines.length * koreanLineHeight;
      const reflBlockH = reflLines.length > 0 ? 54 + reflLines.length * 36 : 0;
      const totalBodyH = enBlockH + 64 + koBlockH + reflBlockH;

      const areaTop = 250;
      const areaBottom = 1130;
      const startY = Math.max(
        areaTop + 50,
        areaTop + Math.round((areaBottom - areaTop - totalBodyH) / 2),
      );

      // Decorative opening quote mark
      ctx.fillStyle = palette.quoteMark;
      ctx.font = '600 120px "Fraunces", Georgia, serif';
      ctx.fillText('“', padX - 8, startY - 24);

      // English lines
      ctx.fillStyle = palette.primaryText;
      ctx.font = `500 ${englishFontSize}px "Fraunces", Georgia, serif`;
      let cursorY = startY + 26;
      for (const line of enLines) {
        ctx.fillText(line, padX, cursorY);
        cursorY += englishLineHeight;
      }

      // Short accent divider
      cursorY += 16;
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(padX, cursorY);
      ctx.lineTo(padX + 72, cursorY);
      ctx.stroke();

      // Korean lines
      cursorY += 56;
      ctx.fillStyle = palette.secondaryText;
      ctx.font = `400 ${koreanFontSize}px "Plus Jakarta Sans", sans-serif`;
      for (const line of koLines) {
        ctx.fillText(line, padX, cursorY);
        cursorY += koreanLineHeight;
      }

      // Optional Reflection block
      if (reflLines.length > 0) {
        cursorY += 32;
        ctx.fillStyle = palette.accent;
        ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('오늘의 한 줄 회고', padX, cursorY);
        cursorY += 34;

        ctx.fillStyle = palette.primaryText;
        ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
        for (const line of reflLines) {
          ctx.fillText(line, padX, cursorY);
          cursorY += 36;
        }
      }

      // Bottom hairline divider
      ctx.strokeStyle = palette.innerBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padX, 1158);
      ctx.lineTo(W - padX, 1158);
      ctx.stroke();

      // Bottom Left: Study Set Title
      ctx.fillStyle = palette.secondaryText;
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      const titleLines = wrapTextLines(ctx, record.studySetTitle, contentW - 180, true);
      ctx.fillText(titleLines[0] || '오늘의 5문장 영어 필사', padX, 1212);

      ctx.fillStyle = palette.accent;
      ctx.font = '500 18px "JetBrains Mono", monospace';
      ctx.fillText('5 / 5 SENTENCES TRANSCRIBED', padX, 1246);

      // Bottom Right: Circular Ink Stamp Seal
      const stampX = W - padX - 52;
      const stampY = 1222;
      ctx.save();
      ctx.translate(stampX, stampY);
      ctx.rotate(-0.12);
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 44, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = palette.accent;
      ctx.textAlign = 'center';
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('필사 완료', 0, -2);
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.fillText('INKWELL', 0, 16);
      ctx.restore();

      setPreviewUrl(canvas.toDataURL('image/png'));
    };

    drawCard();

    return () => {
      cancelled = true;
    };
  }, [isOpen, activeSentence, cardTheme, includeReflection, record, streakCount]);

  if (!isOpen || !activeSentence) return null;

  const getCanvasBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!canvasRef.current) {
        resolve(null);
        return;
      }
      canvasRef.current.toBlob((blob) => resolve(blob), 'image/png');
    });
  };

  const handleDownload = async () => {
    const blob = await getCanvasBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inkwell-${record.date}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage('PNG 이미지 카드가 기기에 저장되었습니다.');
  };

  const handleNativeShare = async () => {
    setStatusMessage(null);
    const blob = await getCanvasBlob();
    if (!blob) return;

    const file = new File([blob], `inkwell-${record.date}.png`, { type: 'image/png' });
    const shareData = {
      title: 'Inkwell Daily · 오늘의 필사 카드',
      text: `${activeSentence.english}\n— ${activeSentence.korean}`,
      files: [file],
    };

    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share(shareData);
        setStatusMessage('이미지 카드를 공유했습니다.');
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback when browser doesn't support Web Share file sharing (e.g. desktop browsers)
    await handleDownload();
    setStatusMessage(
      '현재 브라우저에서 직접 공유 창을 지원하지 않아 PNG 이미지로 저장했습니다. 저장된 이미지를 바로 공유해 보세요.',
    );
  };

  const handleCopyImage = async () => {
    setStatusMessage(null);
    const blob = await getCanvasBlob();
    if (!blob) return;

    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setStatusMessage('이미지가 클립보드에 복사되었습니다. 메신저나 노트에 바로 붙여넣어 보세요.');
        setTimeout(() => setCopied(false), 2500);
        return;
      } catch {
        // Fallback below
      }
    }
    setStatusMessage('클립보드 이미지 복사를 지원하지 않는 환경입니다. PNG 저장 버튼을 이용해 주세요.');
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="오늘의 핵심 문장 이미지 카드 공유"
    >
      <div className="bg-white dark:bg-[#1C1A17] border border-[#E4DFD3] dark:border-[#2E2A25] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#ECE7DC] dark:border-[#2C2823] flex items-center justify-between gap-4">
          <div>
            <h2 className="font-editorial text-xl font-semibold text-[#1E1D1B] dark:text-[#F0ECE1]">
              오늘의 필사 카드 공유
            </h2>
            <p className="text-xs text-[#666158] dark:text-[#A8A196] mt-0.5">
              오늘 완주한 핵심 문장을 종이 엽서 형태의 이미지로 저장하거나 공유하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="공유 창 닫기"
            className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#D8D1C3] dark:border-[#38332C] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: Preview + Controls */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Card Preview */}
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-[#F3EFE6] dark:bg-[#141311] rounded-xl p-4 border border-[#E4DFD3] dark:border-[#2E2A25]">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="생성된 오늘의 필사 이미지 카드 미리보기"
                className="w-full max-w-[340px] aspect-[4/5] rounded-lg shadow-md object-contain"
              />
            ) : (
              <div className="w-full max-w-[340px] aspect-[4/5] flex items-center justify-center text-xs text-[#666158] dark:text-[#A8A196]">
                이미지 카드 생성 중...
              </div>
            )}
          </div>

          {/* Right: Customization & Share Buttons */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <div className="text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-2">
                01. 카드에 담을 문장 선택
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {record.sentences.map((s, idx) => {
                  const active = s.id === activeSentence.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSentenceId(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-colors ${
                        active
                          ? 'border-[#1E3A5F] dark:border-[#7FA6D6] bg-[#1E3A5F]/5 dark:bg-[#7FA6D6]/10 text-[#1E1D1B] dark:text-[#F0ECE1]'
                          : 'border-[#E4DFD3] dark:border-[#2E2A25] bg-[#FCFBF7] dark:bg-[#151412] text-[#666158] dark:text-[#A8A196] hover:text-[#1E1D1B] dark:hover:text-[#F0ECE1]'
                      }`}
                    >
                      <span className="font-mono-tabular font-semibold mr-1.5">
                        0{idx + 1}.
                      </span>
                      <span className="line-clamp-1">{s.english}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-[#666158] dark:text-[#A8A196] mb-2">
                02. 카드 종이 테마
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CARD_THEMES) as CardTheme[]).map((key) => {
                  const t = CARD_THEMES[key];
                  const active = cardTheme === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCardTheme(key)}
                      className={`p-2.5 rounded-xl border text-left transition-colors ${
                        active
                          ? 'border-[#1E3A5F] dark:border-[#7FA6D6] ring-1 ring-[#1E3A5F]/30'
                          : 'border-[#E4DFD3] dark:border-[#2E2A25]'
                      }`}
                    >
                      <span
                        className="block w-full h-5 rounded-md border border-black/10 mb-1.5"
                        style={{ backgroundColor: t.bg }}
                      />
                      <span className="block text-[11px] font-medium text-[#1E1D1B] dark:text-[#F0ECE1] whitespace-nowrap">
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {record.reflection.trim() && (
              <label className="flex items-center gap-2 text-xs text-[#1E1D1B] dark:text-[#F0ECE1] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeReflection}
                  onChange={(e) => setIncludeReflection(e.target.checked)}
                  className="accent-[#1E3A5F]"
                />
                카드 하단에 나의 한 줄 회고 함께 담기
              </label>
            )}

            {statusMessage && (
              <p className="text-xs text-[#1E3A5F] dark:text-[#93C5FD] leading-relaxed">
                {statusMessage}
              </p>
            )}

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E3A5F] dark:bg-[#7FA6D6] text-white dark:text-[#141311] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Share2 className="w-4 h-4" aria-hidden="true" />
                이미지 공유하기
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#24211D] text-xs font-medium text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#2C2823] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  PNG 저장
                </button>
                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#D8D1C3] dark:border-[#38332C] bg-white dark:bg-[#24211D] text-xs font-medium text-[#1E1D1B] dark:text-[#F0ECE1] hover:bg-[#F3EFE6] dark:hover:bg-[#2C2823] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1E3A5F] dark:text-[#93C5FD]" aria-hidden="true" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      이미지 복사
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
