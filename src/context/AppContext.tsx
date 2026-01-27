import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AttentionEntry, CategoryType, Experiment, UserSettings, WeeklySummary, PingSchedule } from '../types';
import {
  getSettings,
  saveSettings,
  getAllEntries,
  addEntry as dbAddEntry,
  getActiveExperiment,
  saveExperiment,
  getAllExperiments,
  getWeeklySummary,
  saveWeeklySummary,
  clearAllData,
  exportAllData,
} from '../lib/db';
import {
  calculateDayNumber,
  getNextDayNumber,
  calculateWeekNumber,
  hasEntryToday,
  generateWeeklySummary,
  getTodayDateString,
} from '../lib/calculations';
import { generateDailyPingSchedule, requestNotificationPermission } from '../lib/notifications';
import { getExerciseById } from '../data/exercises';

type View = 'onboarding' | 'dashboard' | 'ping-response' | 'weekly-summary' | 'analysis' | 'experiment' | 'exercise-library' | 'exercise-detail' | 'settings' | 'history';

interface AppContextValue {
  // State
  isLoading: boolean;
  settings: UserSettings | null;
  entries: AttentionEntry[];
  activeExperiment: Experiment | null;
  allExperiments: Experiment[];
  currentView: View;
  selectedExerciseId: string | null;
  currentWeeklySummary: WeeklySummary | null;
  showMilestone: 'week' | '30day' | null;

  // Computed
  currentDayNumber: number;
  todayCompletion: { ping1: boolean; ping2: boolean; count: number };

  // Actions
  setCurrentView: (view: View) => void;
  setSelectedExerciseId: (id: string | null) => void;
  completeOnboarding: (activeHoursStart: string, activeHoursEnd: string) => Promise<void>;
  addEntry: (category: CategoryType, details?: string) => Promise<void>;
  startExperiment: (exerciseId: string) => Promise<void>;
  markPracticeComplete: (date: string, note?: string) => Promise<void>;
  completeExperiment: (reflection?: string) => Promise<void>;
  abandonExperiment: () => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  exportData: () => Promise<void>;
  clearData: () => Promise<void>;
  dismissMilestone: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [entries, setEntries] = useState<AttentionEntry[]>([]);
  const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
  const [allExperiments, setAllExperiments] = useState<Experiment[]>([]);
  const [currentView, setCurrentView] = useState<View>('onboarding');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [currentWeeklySummary, setCurrentWeeklySummary] = useState<WeeklySummary | null>(null);
  const [showMilestone, setShowMilestone] = useState<'week' | '30day' | null>(null);

  // Computed values
  const currentDayNumber = calculateDayNumber(entries);
  const todayCompletion = hasEntryToday(entries);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedEntries, loadedActiveExp, loadedAllExps] = await Promise.all([
          getSettings(),
          getAllEntries(),
          getActiveExperiment(),
          getAllExperiments(),
        ]);

        setSettings(loadedSettings || null);
        setEntries(loadedEntries);
        setActiveExperiment(loadedActiveExp || null);
        setAllExperiments(loadedAllExps);

        // Determine initial view
        if (!loadedSettings?.onboardingCompleted) {
          setCurrentView('onboarding');
        } else {
          setCurrentView('dashboard');

          // Check for milestones
          const dayNum = calculateDayNumber(loadedEntries);
          const weekNum = calculateWeekNumber(dayNum);

          // Check if we just completed a week
          if (dayNum > 0 && dayNum % 7 === 0) {
            const existingSummary = await getWeeklySummary(weekNum);
            if (!existingSummary) {
              setShowMilestone('week');
            }
          }

          // Check for 30-day milestone
          if (dayNum >= 30 && loadedAllExps.length === 0) {
            setShowMilestone('30day');
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const refreshData = useCallback(async () => {
    const [loadedEntries, loadedActiveExp, loadedAllExps] = await Promise.all([
      getAllEntries(),
      getActiveExperiment(),
      getAllExperiments(),
    ]);
    setEntries(loadedEntries);
    setActiveExperiment(loadedActiveExp || null);
    setAllExperiments(loadedAllExps);
  }, []);

  const completeOnboarding = useCallback(async (activeHoursStart: string, activeHoursEnd: string) => {
    const hasPermission = await requestNotificationPermission();

    const newSettings: UserSettings = {
      id: 'settings',
      activeHoursStart,
      activeHoursEnd,
      notificationsEnabled: hasPermission,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      onboardingCompleted: true,
      firstUseDate: getTodayDateString(),
      lastPingSchedule: null,
      version: '1.0.0',
    };

    // Generate initial ping schedule
    newSettings.lastPingSchedule = generateDailyPingSchedule(newSettings);

    await saveSettings(newSettings);
    setSettings(newSettings);
    setCurrentView('dashboard');
  }, []);

  const addEntry = useCallback(async (category: CategoryType, details?: string) => {
    const allEntries = await getAllEntries();
    const dayNumber = getNextDayNumber(allEntries);
    const weekNumber = calculateWeekNumber(dayNumber);

    const entry: AttentionEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      category,
      details: details || undefined,
      dayNumber,
      weekNumber,
      createdAt: new Date().toISOString(),
    };

    await dbAddEntry(entry);

    // Update ping schedule completion
    if (settings?.lastPingSchedule) {
      const today = getTodayDateString();
      if (settings.lastPingSchedule.date === today) {
        const todayEntries = [...allEntries, entry].filter(e => e.timestamp.startsWith(today));
        const updatedSchedule: PingSchedule = {
          ...settings.lastPingSchedule,
          ping1Completed: todayEntries.length >= 1,
          ping2Completed: todayEntries.length >= 2,
        };
        const updatedSettings = { ...settings, lastPingSchedule: updatedSchedule };
        await saveSettings(updatedSettings);
        setSettings(updatedSettings);
      }
    }

    await refreshData();

    // Check for milestones
    const newDayNumber = dayNumber;
    const newWeekNumber = calculateWeekNumber(newDayNumber);

    // Check if this completes a week
    if (newDayNumber > 0 && newDayNumber % 7 === 0) {
      const prevSummary = newWeekNumber > 1 ? await getWeeklySummary(newWeekNumber - 1) : undefined;
      const newEntries = await getAllEntries();
      const summary = generateWeeklySummary(newWeekNumber, newEntries, prevSummary || undefined);
      if (summary) {
        await saveWeeklySummary(summary);
        setCurrentWeeklySummary(summary);
        setShowMilestone('week');
      }
    }

    // Check for 30-day milestone
    if (newDayNumber === 30 && allExperiments.length === 0) {
      setShowMilestone('30day');
    }
  }, [settings, allExperiments.length, refreshData]);

  const startExperiment = useCallback(async (exerciseId: string) => {
    const exercise = getExerciseById(exerciseId);
    if (!exercise) return;

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 7);

    // Calculate baseline from last 7 days
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEntries = entries.filter(e => {
      const entryDate = new Date(e.timestamp);
      return entryDate >= sevenDaysAgo && entryDate <= today;
    });

    let baselinePercentage = 0;
    if (recentEntries.length > 0) {
      const targetCategory = exercise.targetPattern.split(',')[0] as CategoryType;
      const targetCount = recentEntries.filter(e => e.category === targetCategory).length;
      baselinePercentage = (targetCount / recentEntries.length) * 100;
    }

    const experiment: Experiment = {
      id: uuidv4(),
      exerciseId,
      exerciseName: exercise.name,
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      targetPattern: exercise.targetPattern.split(',')[0] as CategoryType,
      baselinePercentage,
      status: 'active',
      dailyPracticeLog: [],
    };

    await saveExperiment(experiment);
    setActiveExperiment(experiment);
    setCurrentView('dashboard');
  }, [entries]);

  const markPracticeComplete = useCallback(async (date: string, note?: string) => {
    if (!activeExperiment) return;

    const updatedLog = [...activeExperiment.dailyPracticeLog];
    const existingIndex = updatedLog.findIndex(p => p.date === date);

    if (existingIndex >= 0) {
      updatedLog[existingIndex] = { date, completed: true, note };
    } else {
      updatedLog.push({ date, completed: true, note });
    }

    const updated = { ...activeExperiment, dailyPracticeLog: updatedLog };
    await saveExperiment(updated);
    setActiveExperiment(updated);
  }, [activeExperiment]);

  const completeExperiment = useCallback(async (reflection?: string) => {
    if (!activeExperiment) return;

    // Calculate results
    const startDate = new Date(activeExperiment.startDate);
    const endDate = new Date(activeExperiment.endDate);

    const duringEntries = entries.filter(e => {
      const entryDate = new Date(e.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });

    let resultPercentage = 0;
    if (duringEntries.length > 0 && activeExperiment.targetPattern !== 'scattered') {
      const targetCount = duringEntries.filter(e => e.category === activeExperiment.targetPattern).length;
      resultPercentage = (targetCount / duringEntries.length) * 100;
    }

    const updated: Experiment = {
      ...activeExperiment,
      status: 'completed',
      completedDate: getTodayDateString(),
      resultPercentage,
      percentageChange: resultPercentage - activeExperiment.baselinePercentage,
      userReflection: reflection,
    };

    await saveExperiment(updated);
    setActiveExperiment(null);
    await refreshData();
  }, [activeExperiment, entries, refreshData]);

  const abandonExperiment = useCallback(async () => {
    if (!activeExperiment) return;

    const updated: Experiment = {
      ...activeExperiment,
      status: 'abandoned',
      completedDate: getTodayDateString(),
    };

    await saveExperiment(updated);
    setActiveExperiment(null);
    await refreshData();
  }, [activeExperiment, refreshData]);

  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    if (!settings) return;

    const updated = { ...settings, ...updates };
    await saveSettings(updated);
    setSettings(updated);
  }, [settings]);

  const exportData = useCallback(async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attention-data-${getTodayDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const clearData = useCallback(async () => {
    await clearAllData();
    setSettings(null);
    setEntries([]);
    setActiveExperiment(null);
    setAllExperiments([]);
    setCurrentWeeklySummary(null);
    setCurrentView('onboarding');
  }, []);

  const dismissMilestone = useCallback(() => {
    setShowMilestone(null);
  }, []);

  const value: AppContextValue = {
    isLoading,
    settings,
    entries,
    activeExperiment,
    allExperiments,
    currentView,
    selectedExerciseId,
    currentWeeklySummary,
    showMilestone,
    currentDayNumber,
    todayCompletion,
    setCurrentView,
    setSelectedExerciseId,
    completeOnboarding,
    addEntry,
    startExperiment,
    markPracticeComplete,
    completeExperiment,
    abandonExperiment,
    updateSettings,
    exportData,
    clearData,
    dismissMilestone,
    refreshData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
