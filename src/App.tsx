import { useEffect, useMemo, useState } from 'react';
import { DailyWorkspace } from './components/DailyWorkspace';
import { HabitCalendar } from './components/HabitCalendar';
import { Header } from './components/Header';
import { NotebookArchive } from './components/NotebookArchive';
import { PrintSheetModal } from './components/PrintSheetModal';
import { ShareCardModal } from './components/ShareCardModal';
import { getCuratedSetForDate, SAMPLE_DAY1_SET } from './data/sampleDay1';
import type { ActiveTab, DailyRecord, SentenceProgress, StudySet, UnitTopic } from './types';
import {
  calculateStreaks,
  countCompletedSentences,
  createDailyRecordFromSet,
  createEmptyProgress,
  getTodayKey,
  loadDailyRecords,
  loadStudySets,
  loadTheme,
  saveDailyRecords,
  saveStudySets,
  saveTheme,
} from './utils/storage';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [studySets, setStudySets] = useState<StudySet[]>(() => loadStudySets());
  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => loadDailyRecords());
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [shareRecord, setShareRecord] = useState<DailyRecord | null>(null);
  const [archiveFocusDate, setArchiveFocusDate] = useState<string | null>(null);
  const [isGeneratingNew, setIsGeneratingNew] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const todayKey = getTodayKey();

  // Today's default set automatically comes from today's record (if custom generated) or the date-rotated 5-sentence curated bank
  const activeSet: StudySet = useMemo(() => {
    const existingRecord = records[todayKey];
    if (existingRecord) {
      const matched = studySets.find((s) => s.id === existingRecord.studySetId);
      if (matched) {
        return { ...matched, sentences: matched.sentences.slice(0, 5) };
      }
      return {
        id: existingRecord.studySetId,
        title: existingRecord.studySetTitle,
        sourceUrl: existingRecord.sourceUrl,
        sourceSummary:
          '오늘의 5문장을 차분히 읽고 손끝으로 옮겨 적는 영한 필사 루틴입니다.',
        createdAt: existingRecord.date,
        sentences: existingRecord.sentences.slice(0, 5),
      };
    }
    return getCuratedSetForDate(todayKey) || SAMPLE_DAY1_SET;
  }, [records, studySets, todayKey]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveStudySets(studySets);
  }, [studySets]);

  useEffect(() => {
    saveDailyRecords(records);
  }, [records]);

  const todayRecord: DailyRecord = useMemo(() => {
    const existing = records[todayKey];
    if (existing) {
      return {
        ...existing,
        sentences: existing.sentences.slice(0, 5),
      };
    }
    return createDailyRecordFromSet(todayKey, activeSet);
  }, [records, todayKey, activeSet]);

  const handleUpdateSentenceProgress = (
    sentenceId: string,
    patch: Partial<SentenceProgress>,
  ) => {
    setRecords((prev) => {
      const base = prev[todayKey]
        ? { ...prev[todayKey], sentences: prev[todayKey].sentences.slice(0, 5) }
        : createDailyRecordFromSet(todayKey, activeSet);

      const prevProgress =
        base.progressBySentenceId[sentenceId] || createEmptyProgress(sentenceId);

      const nextProgress: SentenceProgress = {
        ...prevProgress,
        ...patch,
        updatedAt: new Date().toISOString(),
      };

      const nextRecord: DailyRecord = {
        ...base,
        progressBySentenceId: {
          ...base.progressBySentenceId,
          [sentenceId]: nextProgress,
        },
      };

      const doneNow = countCompletedSentences(nextRecord);
      if (nextRecord.sentences.length > 0 && doneNow >= nextRecord.sentences.length) {
        nextRecord.isStamped = true;
        nextRecord.completedAt = nextRecord.completedAt || new Date().toISOString();
      }

      return {
        ...prev,
        [todayKey]: nextRecord,
      };
    });
  };

  const handleSaveReflection = (favoriteSentenceId: string | undefined, reflection: string) => {
    setRecords((prev) => {
      const base = prev[todayKey]
        ? { ...prev[todayKey], sentences: prev[todayKey].sentences.slice(0, 5) }
        : createDailyRecordFromSet(todayKey, activeSet);

      return {
        ...prev,
        [todayKey]: {
          ...base,
          favoriteSentenceId,
          reflection,
          isStamped: true,
          completedAt: base.completedAt || new Date().toISOString(),
        },
      };
    });
  };

  const handleGenerateNewFive = async (unitTopic: UnitTopic = 'all') => {
    setGenerateError(null);
    setIsGeneratingNew(true);
    try {
      const excludeSentences = todayRecord.sentences.map((s) => s.english);
      const res = await fetch('/api/daily-sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateKey: todayKey,
          excludeSentences,
          unitTopic,
        }),
      });

      const rawText = await res.text();
      let data: {
        error?: string;
        title?: string;
        sourceSummary?: string;
        sentences?: StudySet['sentences'];
      } = {};

      try {
        data = JSON.parse(rawText) as typeof data;
      } catch {
        throw new Error(
          res.ok
            ? '서버 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해 주세요.'
            : `서버 연결이 지연되었거나 일시적인 오류가 발생했습니다 (HTTP ${res.status}). 잠시 후 다시 시도해 주세요.`,
        );
      }

      if (!res.ok) {
        throw new Error(data.error || '새로운 5문장을 불러오는 중 오류가 발생했습니다.');
      }

      if (!data.sentences || data.sentences.length === 0) {
        throw new Error('생성된 문장이 없습니다. 잠시 후 다시 시도해 주세요.');
      }

      const newSet: StudySet = {
        id: `daily-gen-${Date.now()}`,
        title: data.title || '오늘의 새로운 영어 필사 5문장',
        sourceSummary:
          data.sourceSummary || '오늘 새롭게 큐레이션된 5개의 영한 필사 문장입니다.',
        createdAt: new Date().toISOString(),
        sentences: data.sentences.slice(0, 5),
      };

      setStudySets((prev) => [newSet, ...prev]);
      setRecords((prev) => ({
        ...prev,
        [todayKey]: createDailyRecordFromSet(todayKey, newSet),
      }));
    } catch (err: unknown) {
      setGenerateError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsGeneratingNew(false);
    }
  };

  const handleOpenArchiveDate = (dateKey: string) => {
    setArchiveFocusDate(dateKey);
    setActiveTab('archive');
  };

  const streakStats = useMemo(() => calculateStreaks(records), [records]);
  const completedToday = countCompletedSentences(todayRecord);
  const totalToday = todayRecord.sentences.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] dark:bg-[#141311] text-[#1E1D1B] dark:text-[#F0ECE1]">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentStreak={streakStats.currentStreak}
        completedCount={completedToday}
        totalCount={totalToday}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        onOpenPrint={() => setIsPrintOpen(true)}
      />

      <main className="no-print flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {activeTab === 'today' && (
          <DailyWorkspace
            key={todayRecord.studySetId}
            record={todayRecord}
            sourceSummary={activeSet.sourceSummary}
            isGeneratingNew={isGeneratingNew}
            generateError={generateError}
            onUpdateSentenceProgress={handleUpdateSentenceProgress}
            onSaveReflection={handleSaveReflection}
            onOpenPrint={() => setIsPrintOpen(true)}
            onOpenShare={() => setShareRecord(todayRecord)}
            onGenerateNewFive={handleGenerateNewFive}
          />
        )}

        {activeTab === 'archive' && (
          <NotebookArchive
            records={records}
            initialSelectedDate={archiveFocusDate}
            onOpenShareRecord={(rec) => setShareRecord(rec)}
          />
        )}

        {activeTab === 'calendar' && (
          <HabitCalendar
            records={records}
            onSelectArchiveDate={handleOpenArchiveDate}
          />
        )}
      </main>

      <footer className="no-print border-t border-[#E4DFD3] dark:border-[#2E2A25] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#666158] dark:text-[#A8A196]">
          <span>Inkwell Daily · 매일 5문장 영한 필사 노트</span>
          <span>모든 학습 기록은 브라우저에 자동 저장됩니다</span>
        </div>
      </footer>

      <PrintSheetModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        record={todayRecord}
      />

      {shareRecord && (
        <ShareCardModal
          isOpen={Boolean(shareRecord)}
          onClose={() => setShareRecord(null)}
          record={shareRecord}
          streakCount={streakStats.currentStreak}
        />
      )}
    </div>
  );
}
