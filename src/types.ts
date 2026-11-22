export interface VocabItem {
  word: string;
  meaning: string;
  example: string;
}

export interface SentenceItem {
  id: string;
  english: string;
  chunkedEnglish?: string;
  korean: string;
  contextNote: string;
  vocabulary: VocabItem[];
}

export type QuoteMood = 'kitchen' | 'time_distance' | 'shopping' | 'general';

export interface DailyQuote {
  id: string;
  english: string;
  chunkedEnglish: string;
  korean: string;
  author: string;
  mood: QuoteMood;
  moodLabel: string;
}

export interface StudySet {
  id: string;
  title: string;
  sourceUrl?: string;
  sourceSummary: string;
  createdAt: string;
  isSample?: boolean;
  sentences: SentenceItem[];
}

export type KoreanMode = 'guided' | 'self';

export interface SentenceProgress {
  sentenceId: string;
  englishInput: string;
  englishAccuracy: number;
  englishWpm: number;
  englishCompleted: boolean;
  koreanInput: string;
  koreanMode: KoreanMode;
  koreanRevealed: boolean;
  koreanCompleted: boolean;
  handwrittenCompleted: boolean;
  updatedAt: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  studySetId: string;
  studySetTitle: string;
  sourceUrl?: string;
  sentences: SentenceItem[];
  progressBySentenceId: Record<string, SentenceProgress>;
  favoriteSentenceId?: string;
  reflection: string;
  completedAt?: string;
  isStamped: boolean;
}

export type ActiveTab = 'today' | 'archive' | 'calendar';
export type ViewLayout = 'step' | 'list';
export type UnitTopic = 'all' | 'kitchen' | 'time_distance' | 'shopping';
