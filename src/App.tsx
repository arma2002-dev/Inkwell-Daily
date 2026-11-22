import { useEffect, useMemo, useState } from 'react';
import { DailyWorkspace } from './components/DailyWorkspace';
import { HabitCalendar } from './components/HabitCalendar';
import { Header } from './components/Header';
import { NotebookArchive } from './components/NotebookArchive';
import { PrintSheetModal } from './components/PrintSheetModal';
import { VideoExtractor } from './components/VideoExtractor';
import { SAMPLE_DAY1_SET } from './data/sampleDay1';
import type { ActiveTab, DailyRecord, SentenceProgress, StudySet } from './types';
import {
  calculateStreaks,
  countCompletedSentences,
  createDailyRecordFromSet,
  createEmptyProgress,
  getTodayKey,
  loadActiveSetId,
  loadDailyRecords,
  loadStudySets,
  loadTheme,
  saveActiveSetId,
  saveDailyRecords,
  saveStudySets,
  saveTheme,
} from './utils/storage';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [studySets, setStudySets] = useState<StudySet[]>(() => loadStudySets());
  const [activeSetId, setActiveSetId] = useState<string>(() => loadActiveSetId(loadStudySets()));
  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => loadDailyRecords());
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [archiveFocusDate, setArchiveFocusDate] = useState<string | null>(null);

  const todayKey = getTodayKey();

  const activeSet = useMemo(() => {
    return studySets.find((s) => s.id === activeSetId) || studySets[0] || SAMPLE_DAY1_SET;
  }, [studySets, activeSetId]);

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
    saveActiveSetId(activeSet.id);
  }, [activeSet.id]);

  useEffect(() => {
    saveDailyRecords(records);
  }, [records]);

  const todayRecord: DailyRecord = useMemo(() => {
    const existing = records[todayKey];
    if (existing && existing.studySetId === activeSet.id) {
      return existing;
    }
    const fresh = createDailyRecordFromSet(todayKey, activeSet);
    if (existing) {
      // Preserve any matching sentence progress or reflection for today
      for (const s of activeSet.sentences) {
        if (existing.progressBySentenceId[s.id]) {
          fresh.progressBySentenceId[s.id] = existing.progressBySentenceId[s.id];
        }
      }
      fresh.reflection = existing.reflection;
      fresh.isStamped = existing.isStamped;
      fresh.completedAt = existing.completedAt;
    }
    return fresh;
  }, [records, todayKey, activeSet]);

  const handleUpdateSentenceProgress = (
    sentenceId: string,
    patch: Partial<SentenceProgress>,
  ) => {
    setRecords((prev) => {
      const base =
        prev[todayKey] && prev[todayKey].studySetId === activeSet.id
          ? prev[todayKey]
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
      const base =
        prev[todayKey] && prev[todayKey].studySetId === activeSet.id
          ? prev[todayKey]
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

  const handleExtractedSet = (newSet: StudySet) => {
    setStudySets((prev) => [newSet, ...prev]);
    setActiveSetId(newSet.id);
    setRecords((prev) => ({
      ...prev,
      [todayKey]: createDailyRecordFromSet(todayKey, newSet),
    }));
    setActiveTab('today');
  };

  const handleSelectSet = (setId: string) => {
    const targetSet = studySets.find((s) => s.id === setId);
    if (!targetSet) return;
    setActiveSetId(setId);
    setActiveTab('today');
  };

  const handleDeleteSet = (setId: string) => {
    setStudySets((prev) => {
      const next = prev.filter((s) => s.id !== setId);
      if (activeSetId === setId && next[0]) {
        setActiveSetId(next[0].id);
      }
      return next.length > 0 ? next : [SAMPLE_DAY1_SET];
    });
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
            key={activeSet.id}
            record={todayRecord}
            sourceSummary={activeSet.sourceSummary}
            onUpdateSentenceProgress={handleUpdateSentenceProgress}
            onSaveReflection={handleSaveReflection}
            onOpenPrint={() => setIsPrintOpen(true)}
            onGoToExtract={() => setActiveTab('extract')}
          />
        )}

        {activeTab === 'extract' && (
          <VideoExtractor
            studySets={studySets}
            activeSetId={activeSet.id}
            onSelectSet={handleSelectSet}
            onDeleteSet={handleDeleteSet}
            onExtractedSet={handleExtractedSet}
          />
        )}

        {activeTab === 'archive' && (
          <NotebookArchive
            records={records}
            initialSelectedDate={archiveFocusDate}
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
          <span>Inkwell Daily · 매일 한 페이지의 영어와 한국어 필사 노트</span>
          <span>모든 학습 기록은 브라우저에 자동 저장됩니다</span>
        </div>
      </footer>

      <PrintSheetModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        record={todayRecord}
      />
    </div>
  );
}
