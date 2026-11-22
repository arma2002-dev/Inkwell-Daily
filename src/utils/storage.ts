import { DAILY_SETS_BANK, SAMPLE_DAY1_SET } from '../data/sampleDay1';
import type { DailyRecord, SentenceItem, SentenceProgress, StudySet } from '../types';

const STORAGE_KEYS = {
  STUDY_SETS: 'inkwell_study_sets_v3',
  ACTIVE_SET_ID: 'inkwell_active_set_id_v3',
  DAILY_RECORDS: 'inkwell_daily_records_v3',
  THEME: 'inkwell_theme_v1',
} as const;

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatKoreanDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return dateKey;
  const dt = new Date(y, m - 1, d);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${y}년 ${m}월 ${d}일 (${weekdays[dt.getDay()]})`;
}

export function loadStudySets(): StudySet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_SETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDY_SETS, JSON.stringify(DAILY_SETS_BANK));
      return DAILY_SETS_BANK;
    }
    const parsed = JSON.parse(raw) as StudySet[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DAILY_SETS_BANK;
    }
    return parsed.map((set) => ({
      ...set,
      sentences: set.sentences.slice(0, 5),
    }));
  } catch {
    return DAILY_SETS_BANK;
  }
}

export function saveStudySets(sets: StudySet[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDY_SETS, JSON.stringify(sets));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadActiveSetId(sets: StudySet[]): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_SET_ID);
    if (stored && sets.some((s) => s.id === stored)) {
      return stored;
    }
  } catch {
    // fallback
  }
  return sets[0]?.id || SAMPLE_DAY1_SET.id;
}

export function saveActiveSetId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SET_ID, id);
  } catch {
    // ignore
  }
}

export function loadDailyRecords(): Record<string, DailyRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, DailyRecord>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveDailyRecords(records: Record<string, DailyRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
  } catch {
    // ignore
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // ignore
  }
  return 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch {
    // ignore
  }
}

export function createEmptyProgress(sentenceId: string): SentenceProgress {
  return {
    sentenceId,
    englishInput: '',
    englishAccuracy: 0,
    englishWpm: 0,
    englishCompleted: false,
    koreanInput: '',
    koreanMode: 'guided',
    koreanRevealed: false,
    koreanCompleted: false,
    handwrittenCompleted: false,
    updatedAt: new Date().toISOString(),
  };
}

export function createDailyRecordFromSet(date: string, set: StudySet): DailyRecord {
  const progressBySentenceId: Record<string, SentenceProgress> = {};
  for (const s of set.sentences) {
    progressBySentenceId[s.id] = createEmptyProgress(s.id);
  }
  return {
    date,
    studySetId: set.id,
    studySetTitle: set.title,
    sourceUrl: set.sourceUrl,
    sentences: set.sentences,
    progressBySentenceId,
    reflection: '',
    isStamped: false,
  };
}

export function isSentenceDone(p?: SentenceProgress): boolean {
  if (!p) return false;
  if (p.handwrittenCompleted) return true;
  return p.englishCompleted && p.koreanCompleted;
}

export function countCompletedSentences(record?: DailyRecord): number {
  if (!record) return 0;
  return record.sentences.reduce((acc, s) => {
    return acc + (isSentenceDone(record.progressBySentenceId[s.id]) ? 1 : 0);
  }, 0);
}

export function normalizeQuoteChars(str: string): string {
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, '-')
    .replace(/\u2013/g, '-');
}

export function evaluateTyping(target: string, input: string): {
  accuracy: number;
  isComplete: boolean;
  charStates: Array<'correct' | 'wrong' | 'pending'>;
} {
  const normTarget = normalizeQuoteChars(target);
  const normInput = normalizeQuoteChars(input);

  let correctCount = 0;
  const charStates: Array<'correct' | 'wrong' | 'pending'> = [];

  for (let i = 0; i < normTarget.length; i++) {
    if (i >= normInput.length) {
      charStates.push('pending');
    } else if (normInput[i] === normTarget[i]) {
      charStates.push('correct');
      correctCount++;
    } else {
      charStates.push('wrong');
    }
  }

  const typedLen = normInput.length;
  const accuracy = typedLen === 0 ? 100 : Math.round((correctCount / Math.min(typedLen, normTarget.length)) * 100);
  const isComplete = typedLen >= normTarget.length && accuracy >= 85;

  return { accuracy, isComplete, charStates };
}

function addDays(dateKey: string, delta: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function calculateStreaks(records: Record<string, DailyRecord>): {
  currentStreak: number;
  bestStreak: number;
  totalStampedDays: number;
  totalSentencesDone: number;
  averageAccuracy: number;
} {
  const stampedDates = new Set<string>();
  let totalSentencesDone = 0;
  let accuracySum = 0;
  let accuracyCount = 0;

  for (const record of Object.values(records)) {
    const done = countCompletedSentences(record);
    totalSentencesDone += done;
    if (record.isStamped || (record.sentences.length > 0 && done >= record.sentences.length)) {
      stampedDates.add(record.date);
    }
    for (const p of Object.values(record.progressBySentenceId)) {
      if (p.englishInput.trim().length > 0 && p.englishAccuracy > 0) {
        accuracySum += p.englishAccuracy;
        accuracyCount++;
      }
    }
  }

  const today = getTodayKey();
  const yesterday = addDays(today, -1);

  let currentStreak = 0;
  let cursor = stampedDates.has(today) ? today : stampedDates.has(yesterday) ? yesterday : null;
  while (cursor && stampedDates.has(cursor)) {
    currentStreak++;
    cursor = addDays(cursor, -1);
  }

  // Compute best streak across all sorted stamped dates
  const sorted = Array.from(stampedDates).sort();
  let bestStreak = 0;
  let run = 0;
  let prev: string | null = null;

  for (const d of sorted) {
    if (prev && addDays(prev, 1) === d) {
      run++;
    } else {
      run = 1;
    }
    if (run > bestStreak) bestStreak = run;
    prev = d;
  }

  return {
    currentStreak,
    bestStreak,
    totalStampedDays: stampedDates.size,
    totalSentencesDone,
    averageAccuracy: accuracyCount > 0 ? Math.round(accuracySum / accuracyCount) : 0,
  };
}

export function buildMarkdownExport(records: DailyRecord[]): string {
  const lines: string[] = [];
  lines.push('# Inkwell Daily · 나의 영한 필사 노트');
  lines.push('');

  for (const rec of records) {
    lines.push(`## ${formatKoreanDate(rec.date)} — ${rec.studySetTitle}`);
    if (rec.sourceUrl) {
      lines.push(`- 출처: ${rec.sourceUrl}`);
    }
    lines.push(`- 완료 문장: ${countCompletedSentences(rec)} / ${rec.sentences.length}`);
    lines.push('');

    const fav = rec.sentences.find((s: SentenceItem) => s.id === rec.favoriteSentenceId);
    if (fav) {
      lines.push('### 오늘 가장 마음에 와닿은 문장');
      lines.push(`> "${fav.english}"`);
      lines.push(`> ${fav.korean}`);
      lines.push('');
    }

    if (rec.reflection.trim()) {
      lines.push('### 오늘의 한 줄 회고');
      lines.push(rec.reflection.trim());
      lines.push('');
    }

    lines.push('### 필사 문장 기록');
    rec.sentences.forEach((s, idx) => {
      const p = rec.progressBySentenceId[s.id];
      lines.push(`#### ${idx + 1}. ${s.english}`);
      lines.push(`- 모범 한국어: ${s.korean}`);
      if (p?.koreanInput?.trim()) {
        lines.push(`- 나의 한국어 필사 (${p.koreanMode === 'self' ? '셀프 번역' : '보고 쓰기'}): ${p.koreanInput.trim()}`);
      }
      if (p?.englishInput?.trim()) {
        lines.push(`- 영어 타이핑 정확도: ${p.englishAccuracy}% · ${p.englishWpm} WPM`);
      }
      if (s.vocabulary.length > 0) {
        lines.push(
          `- 핵심 어휘: ${s.vocabulary.map((v) => `${v.word} (${v.meaning})`).join(' / ')}`,
        );
      }
      lines.push('');
    });
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

export function buildTextExport(records: DailyRecord[]): string {
  const lines: string[] = [];
  lines.push('Inkwell Daily · 나의 영한 필사 노트');
  lines.push('====================================');
  lines.push('');

  for (const rec of records) {
    lines.push(`[${formatKoreanDate(rec.date)}] ${rec.studySetTitle}`);
    if (rec.sourceUrl) lines.push(`출처: ${rec.sourceUrl}`);
    lines.push('');

    rec.sentences.forEach((s, idx) => {
      const p = rec.progressBySentenceId[s.id];
      lines.push(`${idx + 1}. ${s.english}`);
      lines.push(`   해석: ${s.korean}`);
      if (p?.koreanInput?.trim()) {
        lines.push(`   내 필사: ${p.koreanInput.trim()}`);
      }
      lines.push('');
    });

    if (rec.reflection.trim()) {
      lines.push(`오늘의 회고: ${rec.reflection.trim()}`);
      lines.push('');
    }
    lines.push('------------------------------------');
    lines.push('');
  }

  return lines.join('\n');
}

export function triggerFileDownload(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
